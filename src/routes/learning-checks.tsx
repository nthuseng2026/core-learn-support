import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AiOutput, ResponsibleAiNotice } from "@/components/ai-output";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { LITERACY_CHECK_ITEMS, MATHS_CHECK_ITEMS, OBSERVATION_ITEMS } from "@/lib/demo-data";
import { today } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useAiDraft } from "@/lib/use-ai";

const TITLE = "Learning Check — Nthuseng Learning Room";
const DESCRIPTION =
  "Record literacy, mathematics and observation information for a learner, then organise it into strengths and learning goals with AI support.";

export const Route = createFileRoute("/learning-checks")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: LearningChecksPage,
});

const LEVELS = ["Not yet observed", "Emerging", "Developing", "Mostly secure", "Secure"];

function ScoreRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-border py-3 last:border-0 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-full text-sm font-medium text-foreground sm:w-56">{label}</span>
      <Slider
        value={[value]}
        min={0}
        max={4}
        step={1}
        onValueChange={([v]) => onChange(v ?? 0)}
        aria-label={label}
        className="flex-1"
      />
      <span className="w-full text-xs text-muted-foreground sm:w-32 sm:text-right">{LEVELS[value]}</span>
    </div>
  );
}

function LearningChecksPage() {
  const { learners, checks, addCheck, learnerById } = useStore();
  const [learnerId, setLearnerId] = useState(learners[0]?.id ?? "");
  const [literacy, setLiteracy] = useState<Record<string, number>>(
    Object.fromEntries(LITERACY_CHECK_ITEMS.map((i) => [i, 2])),
  );
  const [maths, setMaths] = useState<Record<string, number>>(
    Object.fromEntries(MATHS_CHECK_ITEMS.map((i) => [i, 2])),
  );
  const [observation, setObservation] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");

  const ai = useAiDraft("profile");
  const learner = learnerById(learnerId);

  function details() {
    return [
      `Learner: ${learner?.name ?? "Learner"} (${learner?.grade ?? "grade unknown"}, age ${learner?.age ?? "?"})`,
      `Current focus: ${learner?.focus ?? "not set"}`,
      "Literacy check (0 = not yet observed, 4 = secure):",
      ...Object.entries(literacy).map(([k, v]) => `- ${k}: ${v}/4 (${LEVELS[v]})`),
      "Mathematics check (0 = not yet observed, 4 = secure):",
      ...Object.entries(maths).map(([k, v]) => `- ${k}: ${v}/4 (${LEVELS[v]})`),
      "Observations:",
      ...OBSERVATION_ITEMS.map((k) => `- ${k}: ${observation[k] || "not noted"}`),
      `General notes: ${notes || "none"}`,
    ].join("\n");
  }

  function save() {
    addCheck({
      learnerId,
      date: today(),
      literacy,
      mathematics: maths,
      observation,
      notes,
      analysis: ai.value,
    });
    toast.success("Learning Check saved to the learner's profile.");
  }

  return (
    <AppShell>
      <PageHeader
        title="Learning Check"
        subtitle="Record what you observed during assessment and teaching. Nothing here is a diagnosis — it builds a picture of how the learner is currently working."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="card-soft p-5">
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

          <section className="card-soft p-5">
            <h2 className="text-lg font-semibold text-foreground">Literacy</h2>
            <div className="mt-2">
              {LITERACY_CHECK_ITEMS.map((item) => (
                <ScoreRow
                  key={item}
                  label={item}
                  value={literacy[item] ?? 0}
                  onChange={(v) => setLiteracy({ ...literacy, [item]: v })}
                />
              ))}
            </div>
          </section>

          <section className="card-soft p-5">
            <h2 className="text-lg font-semibold text-foreground">Mathematics</h2>
            <div className="mt-2">
              {MATHS_CHECK_ITEMS.map((item) => (
                <ScoreRow
                  key={item}
                  label={item}
                  value={maths[item] ?? 0}
                  onChange={(v) => setMaths({ ...maths, [item]: v })}
                />
              ))}
            </div>
          </section>

          <section className="card-soft p-5">
            <h2 className="text-lg font-semibold text-foreground">Observation</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {OBSERVATION_ITEMS.map((item) => (
                <div key={item}>
                  <Label htmlFor={item}>{item}</Label>
                  <Input
                    id={item}
                    value={observation[item] ?? ""}
                    onChange={(e) => setObservation({ ...observation, [item]: e.target.value })}
                    placeholder="Short note"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Label htmlFor="notes">General comments</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What worked well, what needed support, materials used…"
                className="min-h-28"
              />
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => ai.run(details())} disabled={ai.loading || !learnerId}>
              <Sparkles /> Analyse Learning Profile with AI
            </Button>
            <Button size="lg" variant="outline" onClick={save} disabled={!learnerId}>
              Save Learning Check
            </Button>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">AI Learner Profile Assistant</h2>
            <AiOutput
              value={ai.value}
              onChange={ai.setValue}
              loading={ai.loading}
              onRegenerate={ai.regenerate}
              onSave={save}
              saveLabel="Save to learner"
              emptyHint="Complete the Learning Check above, then select “Analyse Learning Profile with AI” to organise it into strengths, areas needing support, priority areas and suggested goals."
            />
          </div>
        </div>

        <aside className="space-y-6">
          <ResponsibleAiNotice />
          <div className="card-soft p-5">
            <h2 className="text-base font-semibold text-foreground">Previous Learning Checks</h2>
            <div className="mt-3 space-y-3">
              {checks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No checks recorded yet.</p>
              ) : (
                checks.map((c) => (
                  <div key={c.id} className="rounded-xl bg-secondary p-3 text-sm">
                    <p className="font-medium text-foreground">
                      {learnerById(c.learnerId)?.name ?? "Learner"} · {c.date}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{c.notes}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}