import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { AiOutput, ResponsibleAiNotice } from "@/components/ai-output";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { useAiDraft } from "@/lib/use-ai";

const TITLE = "Parent Communication — Nthuseng Learning Room";
const DESCRIPTION =
  "Draft warm, clear and professional messages to parents: progress updates, session summaries, home-support tips and meeting invitations.";

export const Route = createFileRoute("/parent-communication")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ParentCommunicationPage,
});

const PURPOSES = [
  "Progress update",
  "Session summary",
  "Home support suggestions",
  "Invitation to a meeting",
  "Encouragement note",
  "Gentle concern to raise",
];

const TONES = ["Warm and encouraging", "Calm and factual", "Celebratory", "Supportive but honest"];

function ParentCommunicationPage() {
  const { learners, learnerById, progress } = useStore();
  const [learnerId, setLearnerId] = useState(learners[0]?.id ?? "");
  const [purpose, setPurpose] = useState(PURPOSES[0]!);
  const [tone, setTone] = useState(TONES[0]!);
  const [notes, setNotes] = useState("");

  const ai = useAiDraft("parent");
  const learner = learnerById(learnerId);
  const recent = progress.filter((p) => p.learnerId === learnerId).slice(0, 3);

  function details() {
    return [
      `Learner: ${learner?.name ?? "Learner"} (${learner?.grade ?? ""})`,
      `Parent/guardian: ${learner?.parentName ?? "Parent/guardian"}`,
      `Purpose of message: ${purpose}`,
      `Tone: ${tone}`,
      `Focus area: ${learner?.focus ?? ""}`,
      `Strengths: ${learner?.strengths.join("; ") || "not recorded"}`,
      "Recent session notes:",
      ...recent.map((r) => `- ${r.date}: ${r.skill}; successes: ${r.successes}; next steps: ${r.nextSteps}`),
      `Practitioner notes to include: ${notes || "none"}`,
    ].join("\n");
  }

  return (
    <AppShell>
      <PageHeader
        title="Parent Communication"
        subtitle="Get a friendly first draft, then make it your own before you send it."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="card-soft grid gap-4 p-5 sm:grid-cols-2">
            <div>
              <Label>Learner</Label>
              <Select value={learnerId} onValueChange={setLearnerId}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a learner" />
                </SelectTrigger>
                <SelectContent>
                  {learners.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name} · {l.grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Purpose</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PURPOSES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="notes">What would you like to say?</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. She is blending three-sound words on her own now, and I'd like them to read together for 10 minutes a night."
              />
            </div>
          </section>

          <Button size="lg" onClick={() => ai.run(details())} disabled={ai.loading || !learnerId}>
            <Sparkles /> Draft message with AI
          </Button>

          <AiOutput
            value={ai.value}
            onChange={ai.setValue}
            loading={ai.loading}
            onRegenerate={ai.regenerate}
            emptyHint="Choose a learner and a purpose, then generate a draft message you can copy into email or WhatsApp."
          />
        </div>

        <aside className="space-y-6">
          <ResponsibleAiNotice />
          <div className="card-soft p-5">
            <h2 className="text-base font-semibold text-foreground">Parent details</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Parent/guardian</dt>
                <dd className="text-foreground">{learner?.parentName ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Contact</dt>
                <dd className="text-foreground">{learner?.parentContact ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Focus area</dt>
                <dd className="text-foreground">{learner?.focus ?? "—"}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}