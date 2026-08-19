import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCheck, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initials } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/learners/$learnerId")({
  head: () => ({
    meta: [
      { title: "Learner profile — Nthuseng Learning Room" },
      {
        name: "description",
        content: "Learner overview: strengths, areas for growth, learning goals, plans and session history.",
      },
      { property: "og:title", content: "Learner profile — Nthuseng Learning Room" },
      {
        property: "og:description",
        content: "Learner overview: strengths, areas for growth, learning goals, plans and session history.",
      },
    ],
  }),
  component: LearnerProfile,
});

function Empty({ text }: { text: string }) {
  return <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">{text}</p>;
}

function LearnerProfile() {
  const { learnerId } = Route.useParams();
  const { learnerById, plans, checks, progress } = useStore();
  const learner = learnerById(learnerId);

  if (!learner) {
    return (
      <AppShell>
        <div className="card-soft p-10 text-center">
          <p className="font-semibold text-foreground">This learner could not be found</p>
          <Button asChild className="mt-4">
            <Link to="/learners">Back to learners</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const learnerPlans = plans.filter((p) => p.learnerId === learner.id);
  const learnerChecks = checks.filter((c) => c.learnerId === learner.id);
  const sessions = progress.filter((p) => p.learnerId === learner.id);

  return (
    <AppShell>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to="/learners">
          <ArrowLeft /> All learners
        </Link>
      </Button>

      <section className="card-soft bg-gradient-warm mb-8 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex size-16 items-center justify-center rounded-3xl bg-card text-xl font-semibold text-primary shadow-soft">
              {initials(learner.name)}
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{learner.name}</h1>
              <p className="text-sm text-foreground/80">
                {learner.grade} · Age {learner.age} · {learner.school}
              </p>
              <Badge className="mt-2 bg-card text-foreground">{learner.status}</Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link to="/learning-checks">
                <ClipboardCheck /> Learning Check
              </Link>
            </Button>
            <Button asChild>
              <Link to="/learning-plans">
                <Sparkles /> Learning Plan
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Current focus", value: learner.focus },
          { label: "Preferred format", value: learner.format },
          { label: "Parent / guardian", value: learner.guardian },
          { label: "Contact", value: learner.guardianContact },
        ].map((item) => (
          <div key={item.label} className="card-soft p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-sm font-medium text-foreground">{item.value || "—"}</p>
          </div>
        ))}
      </div>

      <div className="card-soft mb-8 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Progress summary</h2>
          <span className="text-sm font-semibold text-primary">{learner.progress}%</span>
        </div>
        <Progress value={learner.progress} className="mt-4" />
        <p className="mt-3 text-xs text-muted-foreground">
          Based on recorded session performance in the learner's current focus area.
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="overview">Learning overview</TabsTrigger>
          <TabsTrigger value="plans">Learning plans</TabsTrigger>
          <TabsTrigger value="checks">Learning Checks</TabsTrigger>
          <TabsTrigger value="sessions">Session history</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid gap-4 lg:grid-cols-3">
          {[
            { title: "Strengths", items: learner.strengths, tone: "bg-success/10 text-foreground" },
            { title: "Areas for growth", items: learner.growth, tone: "bg-warning/15 text-foreground" },
            { title: "Current learning goals", items: learner.goals, tone: "bg-primary-soft text-foreground" },
          ].map((block) => (
            <div key={block.title} className="card-soft p-5">
              <h3 className="text-base font-semibold text-foreground">{block.title}</h3>
              {block.items.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Nothing recorded yet — complete a Learning Check to build this section.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {block.items.map((item) => (
                    <li key={item} className={`rounded-xl px-3 py-2 text-sm ${block.tone}`}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          {learnerPlans.length === 0 ? (
            <Empty text="No learning plan yet. Create one from the Learning Plans page." />
          ) : (
            learnerPlans.map((p) => (
              <div key={p.id} className="card-soft p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-foreground">Plan created {p.created}</h3>
                  <Badge variant="secondary">Review {p.reviewDate}</Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{p.priorityAreas}</p>
                <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{p.goals}</p>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="checks" className="space-y-4">
          {learnerChecks.length === 0 ? (
            <Empty text="No Learning Checks recorded yet." />
          ) : (
            learnerChecks.map((c) => (
              <div key={c.id} className="card-soft p-5">
                <h3 className="text-base font-semibold text-foreground">Learning Check · {c.date}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.notes}</p>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-3">
          {sessions.length === 0 ? (
            <Empty text="No sessions recorded yet. Add one from the Progress page." />
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="card-soft flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {s.date} · {s.skill}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {s.activity} · prompting: {s.prompting}
                  </p>
                </div>
                <Badge variant="secondary">{s.performance}%</Badge>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}