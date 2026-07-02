"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Message = { id: string; role: "user" | "assistant"; content: string };

export function ChatWindow({
  conversationId,
  initialMessages,
}: {
  conversationId: string;
  initialMessages: Message[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isStreaming) return;

    setError(null);
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: text },
    ]);
    setIsStreaming(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      const res = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: text }),
      });

      if (!res.body) {
        throw new Error("Kein Stream erhalten");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          let eventName = "message";
          let dataLine = "";
          for (const line of part.split("\n")) {
            if (line.startsWith("event: ")) eventName = line.slice(7).trim();
            if (line.startsWith("data: ")) dataLine = line.slice(6);
          }
          if (!dataLine) continue;
          const data = JSON.parse(dataLine);

          if (eventName === "delta") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + data.text } : m,
              ),
            );
          } else if (eventName === "error") {
            setError(data.message);
          }
        }
      }
    } catch {
      setError("Verbindung zum KI-Coach fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setIsStreaming(false);
      router.refresh();
    }
  }

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[400px] flex-col rounded-md border bg-background">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Stelle deinem Coach eine Frage, z.B. &quot;Wie war meine
            1.-Aufschlagquote zuletzt?&quot;
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "max-w-[80%] whitespace-pre-wrap rounded-lg px-4 py-2 text-sm",
              m.role === "user"
                ? "self-end bg-primary text-primary-foreground"
                : "self-start bg-muted",
            )}
          >
            {m.content || (isStreaming && m.role === "assistant" ? "…" : "")}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {error && <p className="px-4 pb-2 text-sm text-destructive">{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex gap-2 border-t p-4"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Deine Nachricht..."
          rows={2}
          className="flex-1 resize-none"
        />
        <Button type="submit" disabled={isStreaming || !input.trim()}>
          Senden
        </Button>
      </form>
    </div>
  );
}
