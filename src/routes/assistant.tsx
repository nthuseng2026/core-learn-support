import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ResponsibleAiNotice } from "@/components/ai-output";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { askAssistant } from "@/lib/ai.functions";

const TITLE = "Learning Assistant — Nthuseng Learning Room";
const DESCRIPTION =
  "Ask practical questions about learning-support strategies, activity ideas, differentiation and encouraging learners.";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AssistantPage,
});

const SUGGESTIONS = [
  "How do I help a Grade 2 learner who reverses b and d?",
  "Give me three multisensory ideas for teaching number bonds to 10.",
  "How can I keep a learner motivated when a skill takes weeks to grow?",
  "How do I explain a learning plan to a parent in simple language?",
];

type Message = { role: "user" | "assistant"; content: string };

function AssistantPage() {
  const ask = useServerFn(askAssistant);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your learning-support assistant. Ask me about strategies, activity ideas, differentiation, or how to explain something to a parent. I share educational guidance only — never a diagnosis.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;
    const next: Message[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const result = await ask({
        data: { messages: next.map((m) => ({ role: m.role, content: m.content })) },
      });
      setMessages([...next, { role: "assistant", content: result.content }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The assistant could not answer just now.");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Learning Assistant"
        subtitle="A thinking partner for your practice — strategies, ideas and wording, always for you to judge and adapt."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="card-soft flex min-h-[520px] flex-col p-5">
          <div className="flex-1 space-y-4 overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground"
                    : "mr-auto max-w-[90%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-secondary px-4 py-3 text-sm text-secondary-foreground"
                }
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="mr-auto flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
                <Sparkles className="size-4 animate-pulse" /> Thinking…
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                placeholder="Ask about a strategy, an activity idea or how to word something…"
                className="min-h-[64px]"
                aria-label="Message"
              />
              <Button size="lg" onClick={() => void send(input)} disabled={loading || !input.trim()}>
                <Send />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="card-soft p-5">
            <h2 className="text-base font-semibold text-foreground">Try asking</h2>
            <div className="mt-3 space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  className="w-full rounded-xl bg-secondary px-3 py-2 text-left text-sm text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <ResponsibleAiNotice />
        </aside>
      </div>
    </AppShell>
  );
}