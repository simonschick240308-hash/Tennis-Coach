import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic, COACH_MODEL, COACH_SYSTEM_INSTRUCTIONS } from "@/lib/anthropic";
import { buildCoachContext } from "@/lib/coach-context";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const conversationId =
    typeof body.conversationId === "string" ? body.conversationId : null;

  if (!message) {
    return new Response("Nachricht darf nicht leer sein", { status: 400 });
  }

  let conversation = conversationId
    ? await prisma.coachConversation.findUnique({ where: { id: conversationId } })
    : null;

  if (conversationId && (!conversation || conversation.userId !== session.user.id)) {
    return new Response("Not found", { status: 404 });
  }

  if (!conversation) {
    conversation = await prisma.coachConversation.create({
      data: {
        userId: session.user.id,
        title: message.slice(0, 80),
      },
    });
  }

  await prisma.chatMessage.create({
    data: { conversationId: conversation.id, role: "user", content: message },
  });

  const [history, context] = await Promise.all([
    prisma.chatMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
    }),
    buildCoachContext(session.user.id),
  ]);

  const conversationId_ = conversation.id;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      send("conversation", { conversationId: conversationId_ });

      let full = "";
      try {
        const anthropicStream = anthropic.messages.stream({
          model: COACH_MODEL,
          max_tokens: 4096,
          system: [
            {
              type: "text",
              text: COACH_SYSTEM_INSTRUCTIONS,
              cache_control: { type: "ephemeral" },
            },
            { type: "text", text: context },
          ],
          messages: history.map((m) => ({
            role: m.role === "user" ? ("user" as const) : ("assistant" as const),
            content: m.content,
          })),
        });

        for await (const event of anthropicStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            full += event.delta.text;
            send("delta", { text: event.delta.text });
          }
        }
      } catch (error) {
        console.error("Coach chat error:", error);
        send("error", {
          message:
            "Der KI-Coach konnte gerade nicht antworten. Bitte versuche es später erneut.",
        });
      }

      if (full) {
        await prisma.chatMessage.create({
          data: { conversationId: conversationId_, role: "assistant", content: full },
        });
        await prisma.coachConversation.update({
          where: { id: conversationId_ },
          data: { updatedAt: new Date() },
        });
      }

      send("done", {});
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
