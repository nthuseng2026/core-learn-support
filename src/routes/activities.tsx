import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Printer, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AiOutput, ResponsibleAiNotice } from "@/components/ai-output";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ACTIVITY_TYPES, DIFFICULTIES, GRADES, SKILLS } from "@/lib/demo-data";
import { useStore } from "@/lib/store";
import { useAiDraft } from "@/lib/use-ai";
import type { Subject } from "@/lib/types";

const TITLE = "Activity Generator — Nthuseng Learning Room";
const DESCRIPTION =
  "Generate targeted literacy and mathematics learning activities by grade, skill, difficulty and activity type.";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ActivitiesPage,
});

function ActivitiesPage() {
  const { activities, addActivity } = useStore();
  const [grade, setGrade] = useState("Grade 2");
  const [subject, setSubject] = useState<Subject>("Literacy");
  const [skill, setSkill] = useState(SKILLS.Literacy[0]!);
  const [difficulty, setDifficulty] = useState("Developing");
  const [type, setType] = useState("Word building");

  const ai = useAiDraft("activity");

  function changeSubject(next: Subject) {
    setSubject(next);
    setSkill(SKILLS[next][0]!);
  }

  function details() {
    return `Grade: ${grade}\nSubject: ${subject}\nSkill: ${skill}\nDifficulty: ${difficulty}\nActivity type: ${type}\nContext: one-on-one or small-group learning-support session, low-cost or recycled materials preferred.`;
  }

  function save() {
    if (!ai.value) return;
    const firstLine = ai.value
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l && !/^activity title$/i.test(l));
    addActivity({
      title: (firstLine ?? `${skill} activity`).replace(/^activity title:?\s*/i, "").slice(0, 90),
      grade,
      subject,
      skill,
      difficulty,
      type,
      content: ai.value,
    });
    toast.success("Activity saved to your activity library.");
  }

  return (
    <AppShell>
      <PageHeader
        title="Activities"
        subtitle="Create targeted, age-appropriate practice for the skill you are working on. Edit anything before you use it with a learner."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="card-soft grid gap-4 p-5 sm:grid-cols-2">
            <div>
              <Label>Grade</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject</Label>
              <Select value={subject} onValueChange={(v) => changeSubject(v as Subject)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Literacy">Literacy</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Skill</Label>
              <Select value={skill} onValueChange={setSkill}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SKILLS[subject].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Activity type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          <Button size="lg" onClick={() => ai.run(details())} disabled={ai.loading}>
            <Sparkles /> Generate Activity with AI
          </Button>

          <AiOutput
            value={ai.value}
            onChange={ai.setValue}
            loading={ai.loading}
            onRegenerate={ai.regenerate}
            onSave={save}
            saveLabel="Save Activity"
            emptyHint="Choose a grade, subject, skill, difficulty and activity type, then generate an activity."
            extraActions={
              <Button size="sm" variant="outline" onClick={() => window.print()}>
                <Printer /> Print
              </Button>
            }
          />
        </div>

        <aside className="space-y-6">
          <ResponsibleAiNotice />
          <div className="card-soft p-5">
            <h2 className="text-base font-semibold text-foreground">Activity library</h2>
            <div className="mt-3 space-y-3">
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved activities yet.</p>
              ) : (
                activities.map((a) => (
                  <div key={a.id} className="rounded-xl bg-secondary p-3">
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="secondary">{a.grade}</Badge>
                      <Badge variant="secondary">{a.skill}</Badge>
                      <Badge variant="secondary">{a.difficulty}</Badge>
                    </div>
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