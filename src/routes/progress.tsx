import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { AiOutput, ResponsibleAiNotice } from "@/components/ai-output";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { today } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useAiDraft } from "@/lib/use-ai";

const TITLE = "Progress — Nthuseng Learning Room";
const DESCRIPTION =
  "Record session progress, view simple progress charts and generate warm, parent-friendly progress reports.";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ProgressPage,
});

const PROMPTING = ["Independent", "Minimal", "Occasional", "Moderate", "Frequent"];

function ProgressPage() {
  const { learners, progress, reports, addProgress, addReport, learnerById } = useStore();
  const [learnerId, setLearnerId] = useState(learners[0]?.id ?? "");
  const [form, setForm] = useState({
    date: today(),
    skill: "",
    activity: "",
    performance: 60,
    prompting: "Occasional",
    successes: "",
    challenges: "",
    nextSteps: "",
  });

  const ai = useAiDraft("report");
  const learner = learnerById(learnerId);
  const entries = progress.filter((p) => p.learnerId === learnerId);
  const chartData = entries
    .slice()
    .reverse()
    .map((e) => ({ date: e.date.slice(0, 6), performance: e.performance }));

  function saveEntry() {
    if (!learnerId || !form.skill.trim()) {
      toast.error("Add the skill practised before saving the session.");
      return;
    }
    addProgress({ learnerId, ...form });
    toast.success("Session recorded.");
    setForm({ ...form, skill: "", activity: "", successes: "", challenges: "", nextSteps: "" });
  }

  function details() {
    return [
      `Learner: ${learner?.name ?? "Learner"} (${learner?.grade ?? ""})`,
      `Focus: ${learner?.focus ?? ""}`,
      `Strengths on record: ${learner?.strengths.join("; ") || "not recorded"}`,
      `Areas for growth: ${learner?.growth.join("; ") || "not recorded"}`,
      "Recent sessions:",
      ...entries.map(
        (e) =>
          `- ${e.date}: ${e.skill} using ${e.activity}; performance ${e.performance}%; prompting ${e.prompting}; successes: ${e.successes}; challenges: ${e.challenges}; next steps: ${e.nextSteps}`,
      ),
      `Current session notes: ${form.skill} — ${form.successes} / ${form.challenges} / ${form.nextSteps}`,
    ].join("\n");
  }

  return (
    <AppShell>
      <PageHeader
        title="Progress"
        subtitle="Record what happened in each session and keep a simple, clear picture of the learner's journey."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="card-soft p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Overall progress</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{learner?.progress ?? 0}%</p>
          <Progress value={learner?.progress ?? 0} className="mt-3" />
        </div>
        <div className="card-soft p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Sessions recorded</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{entries.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Current focus: {learner?.focus ?? "—"}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="card-soft p-5">
            <h2 className="text-lg font-semibold text-foreground">Skill progress over time</h2>
            {chartData.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No sessions recorded for this learner yet. Add one below to start the chart.
              </p>
            ) : (
              <ChartContainer
                className="mt-4 h-[240px] w-full"
                config={{ performance: { label: "Performance", color: "var(--color-chart-1)" } }}
              >
                <LineChart data={chartData} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="performance"
                    stroke="var(--color-performance)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </section>

          <section className="card-soft grid gap-4 p-5 sm:grid-cols-2">
            <h2 className="text-lg font-semibold text-foreground sm:col-span-2">Record a session</h2>
            <div>
              <Label htmlFor="date">Session date</Label>
              <Input id="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="skill">Skill practised</Label>
              <Input
                id="skill"
                value={form.skill}
                onChange={(e) => setForm({ ...form, skill: e.target.value })}
                placeholder="e.g. Blending CVC words"
              />
            </div>
            <div>
              <Label htmlFor="activity">Activity used</Label>
              <Input
                id="activity"
                value={form.activity}
                onChange={(e) => setForm({ ...form, activity: e.target.value })}
              />
            </div>
            <div>
              <Label>Level of prompting</Label>
              <Select value={form.prompting} onValueChange={(v) => setForm({ ...form, prompting: v })}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROMPTING.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Learner performance: {form.performance}%</Label>
              <Slider
                className="mt-3"
                value={[form.performance]}
                min={0}
                max={100}
                step={5}
                onValueChange={([v]) => setForm({ ...form, performance: v ?? 0 })}
                aria-label="Learner performance"
              />
            </div>
            <div>
              <Label htmlFor="succ">Successes</Label>
              <Textarea
                id="succ"
                value={form.successes}
                onChange={(e) => setForm({ ...form, successes: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="chal">Challenges</Label>
              <Textarea
                id="chal"
                value={form.challenges}
                onChange={(e) => setForm({ ...form, challenges: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="next">Next steps</Label>
              <Textarea
                id="next"
                value={form.nextSteps}
                onChange={(e) => setForm({ ...form, nextSteps: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Button onClick={saveEntry}>Save session</Button>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">AI Progress Report</h2>
            <Button
              size="lg"
              className="mb-4"
              onClick={() => ai.run(details())}
              disabled={ai.loading || !learnerId}
            >
              <Sparkles /> Generate Progress Report with AI
            </Button>
            <AiOutput
              value={ai.value}
              onChange={ai.setValue}
              loading={ai.loading}
              onRegenerate={ai.regenerate}
              onSave={() => {
                addReport({ learnerId, date: today(), content: ai.value });
                toast.success("Progress report saved.");
              }}
              saveLabel="Save report"
              emptyHint="Record a few sessions, then generate a warm, parent-friendly progress report."
            />
          </section>
        </div>

        <aside className="space-y-6">
          <ResponsibleAiNotice />
          <div className="card-soft p-5">
            <h2 className="text-base font-semibold text-foreground">Session log</h2>
            <div className="mt-3 space-y-3">
              {entries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No sessions yet for this learner.</p>
              ) : (
                entries.map((e) => (
                  <div key={e.id} className="rounded-xl bg-secondary p-3 text-sm">
                    <p className="font-medium text-foreground">
                      {e.date} · {e.skill}
                    </p>
                    <Progress value={e.performance} className="mt-2" />
                    <p className="mt-2 text-xs text-muted-foreground">Next: {e.nextSteps || "—"}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="card-soft p-5">
            <h2 className="text-base font-semibold text-foreground">Saved reports</h2>
            <div className="mt-3 space-y-3">
              {reports.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reports saved yet.</p>
              ) : (
                reports.map((r) => (
                  <div key={r.id} className="rounded-xl bg-secondary p-3 text-sm">
                    <p className="font-medium text-foreground">
                      {learnerById(r.learnerId)?.name ?? "Learner"} · {r.date}
                    </p>
                    <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{r.content}</p>
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