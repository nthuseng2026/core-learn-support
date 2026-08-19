import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AiOutput, ResponsibleAiNotice } from "@/components/ai-output";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { inWeeks, today } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useAiDraft } from "@/lib/use-ai";

const TITLE = "Learning Plans — Nthuseng Learning Room";
const DESCRIPTION =
  "Create and edit personalised learning plans with priority areas, measurable goals, activities, frequency and progress indicators.";

export const Route = createFileRoute("/learning-plans")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: LearningPlansPage,
});

function LearningPlansPage() {
  const { learners, plans, checks, addPlan, learnerById } = useStore();
  const [learnerId, setLearnerId] = useState(learners[0]?.id ?? "");
  const [form, setForm] = useState({
    reviewDate: inWeeks(6),
    priorityAreas: "",
    currentLevel: "",
    goals: "",
    activities: "",
    frequency: "Two 30-minute sessions per week",
    indicators: "",
  });

  const ai = useAiDraft("plan");
  const learner = learnerById(learnerId);
  const latestCheck = checks.find((c) => c.learnerId === learnerId);

  function details() {
    return [
      `Learner: ${learner?.name ?? "Learner"} (${learner?.grade ?? ""}, age ${learner?.age ?? "?"})`,
      `Focus: ${learner?.focus ?? ""}`,
      `Strengths: ${learner?.strengths.join("; ") || "not recorded"}`,
      `Areas for growth: ${learner?.growth.join("; ") || "not recorded"}`,
      `Latest Learning Check notes: ${latestCheck?.notes ?? "none"}`,
      `Practitioner notes on priority areas: ${form.priorityAreas || "none"}`,
      `Current skill level: ${form.currentLevel || "not recorded"}`,
      `Planned frequency: ${form.frequency}`,
      `Review date: ${form.reviewDate}`,
    ].join("\n");
  }

  function save() {
    if (!learnerId) return;
    addPlan({
      learnerId,
      created: today(),
      reviewDate: form.reviewDate,
      priorityAreas: form.priorityAreas || "See plan draft",
      currentLevel: form.currentLevel,
      goals: ai.value || form.goals,
      activities: form.activities,
      frequency: form.frequency,
      indicators: form.indicators,
    });
    toast.success("Learning plan saved.");
  }

  return (
    <AppShell>
      <PageHeader
        title="Learning Plans"
        subtitle="Turn a Learning Check into a practical, personalised plan. Every AI suggestion can be edited before you save it."
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
              <Label htmlFor="review">Review date</Label>
              <Input
                id="review"
                className="mt-2"
                value={form.reviewDate}
                onChange={(e) => setForm({ ...form, reviewDate: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="priority">Priority learning areas</Label>
              <Textarea
                id="priority"
                value={form.priorityAreas}
                onChange={(e) => setForm({ ...form, priorityAreas: e.target.value })}
                placeholder="e.g. Blending CVC words; b/d discrimination"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="level">Current skill level</Label>
              <Textarea
                id="level"
                value={form.currentLevel}
                onChange={(e) => setForm({ ...form, currentLevel: e.target.value })}
                placeholder="What the learner can currently do independently and with support"
              />
            </div>
            <div>
              <Label htmlFor="freq">Frequency</Label>
              <Input
                id="freq"
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="ind">Progress indicators</Label>
              <Input
                id="ind"
                value={form.indicators}
                onChange={(e) => setForm({ ...form, indicators: e.target.value })}
                placeholder="e.g. weekly CVC word check"
              />
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => ai.run(details())} disabled={ai.loading || !learnerId}>
              <Sparkles /> Generate Learning Plan with AI
            </Button>
            <Button size="lg" variant="outline" onClick={save} disabled={!learnerId}>
              Save plan
            </Button>
          </div>

          <AiOutput
            value={ai.value}
            onChange={ai.setValue}
            loading={ai.loading}
            onRegenerate={ai.regenerate}
            onSave={save}
            saveLabel="Save plan"
            emptyHint="Select a learner and generate a plan draft. You can edit every section before saving."
          />
        </div>

        <aside className="space-y-6">
          <ResponsibleAiNotice />
          <div className="card-soft p-5">
            <h2 className="text-base font-semibold text-foreground">Existing plans</h2>
            <div className="mt-3 space-y-3">
              {plans.length === 0 ? (
                <p className="text-sm text-muted-foreground">No plans yet.</p>
              ) : (
                plans.map((p) => (
                  <div key={p.id} className="rounded-xl bg-secondary p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {learnerById(p.learnerId)?.name ?? "Learner"}
                      </p>
                      <Badge variant="secondary">{p.created}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{p.priorityAreas}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Review: {p.reviewDate}</p>
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