import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { generateAiContent } from "./ai.functions";

type Kind = "profile" | "plan" | "activity" | "report" | "communication";

export function useAiDraft(kind: Kind) {
  const generate = useServerFn(generateAiContent);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastDetails, setLastDetails] = useState("");

  async function run(details: string) {
    if (!details.trim()) {
      toast.error("Add some information first so the AI has something to work with.");
      return;
    }
    setLastDetails(details);
    setLoading(true);
    try {
      const result = await generate({ data: { kind, details } });
      setValue(result.content);
      toast.success("AI draft ready — please review before using.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong generating the draft.");
    } finally {
      setLoading(false);
    }
  }

  return {
    value,
    setValue,
    loading,
    run,
    regenerate: lastDetails ? () => run(lastDetails) : undefined,
  };
}