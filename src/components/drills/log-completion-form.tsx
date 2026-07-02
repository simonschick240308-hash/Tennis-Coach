"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { logDrillCompletion, type DrillLogState } from "@/actions/drills";

export function LogCompletionForm({ drillId }: { drillId: string }) {
  const action = logDrillCompletion.bind(null, drillId);
  const [state, formAction, isPending] = useActionState<DrillLogState, FormData>(
    action,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success("Als erledigt markiert");
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <Textarea
        name="notes"
        placeholder="Notiz zu diesem Durchgang (optional)"
        rows={2}
      />
      <Button type="submit" size="sm" disabled={isPending} className="w-fit">
        {isPending ? "Speichern..." : "Als erledigt markieren"}
      </Button>
    </form>
  );
}
