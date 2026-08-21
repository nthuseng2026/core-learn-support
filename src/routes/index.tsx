import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Plus,
  Users,
  Wand2,
} from "lucide-react";
import heroLearning from "@/assets/hero-learning.jpg";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAiNotice } from "@/components/ai-output";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";
import { initials } from "@/lib/format";

const TITLE = "Nthuseng Learning Room — Personalised Learning Support";
const DESCRIPTION =
  "A learning-support platform for practitioners: learner profiles, learning checks, personalised plans, AI activities, progress tracking and parent reports.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Dashboard,
});

const QUICK_ACTIONS = [
  { to: "/learners", label: "Add Learner", icon: Plus },
  { to: "/learning-checks", label: "Start Learning Check", icon: ClipboardCheck },
  { to: "/learning-plans", label: "Create Learning Plan", icon: BookOpenCheck },
  { to: "/activities", label: "Generate Activity", icon: Wand2 },
  { to: "/progress", label: "Create Progress Report", icon: FileText },
] as const;

function Dashboard() {
  const { learners, sessions, plans, reports, activities, learnerById } = useStore();

  const stats = [
    { label: "Active Learners", value: learners.length, icon: Users },
    { label: "Upcoming Sessions", value: sessions.length, icon: CalendarDays },
    { label: "Learning Plans", value: plans.length, icon: BookOpenCheck },
    { label: "Progress Reports", value: reports.length, icon: BarChart3 },
    { label: "Activities Created", value: activities.length, icon: Wand2 },
  ];

  return (
    <AppShell>
      <section className="card-soft mb-8 overflow-hidden p-6 sm:p-10">
        <div className="flex flex-col items-center gap-8 lg:flex-row">
          <div className="flex-1">
            <Badge className="mb-4 bg-card text-foreground shadow-soft">Demonstration data</Badge>
            <h1 className="text-2xl font-semibold text-foreground sm:text-4xl">
              Welcome back to Nthuseng Learning Room
            </h1>
            <p className="mt-3 max-w-xl text-sm text-foreground/80 sm:text-base">
              Support every learner's journey with personalised learning tools.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
                <Button key={label} asChild variant={label === "Add Learner" ? "default" : "secondary"} size="lg">
                  <Link to={to}>
                    <Icon /> {label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          <div className="w-full max-w-md shrink-0 lg:max-w-sm xl:max-w-md">
            <img
              src={heroLearning}
              alt="A warm one-on-one learning scene with an educator and a learner surrounded by books and learning materials"
              className="h-auto w-full rounded-2xl object-cover shadow-lift"
            />
          </div>
        </div>
      </section>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card-soft p-5 transition-shadow duration-200 hover:shadow-lift">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Icon className="size-[18px]" aria-hidden />
            </span>
            <p className="mt-4 text-2xl font-semibold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent learners</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/learners">View all</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {learners.slice(0, 4).map((l) => (
              <Link
                key={l.id}
                to="/learners/$learnerId"
                params={{ learnerId: l.id }}
                className="card-soft block p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-accent-soft font-semibold text-accent-foreground">
                    {initials(l.name)}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{l.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.grade} · {l.focus}
                    </p>
                  </div>
                </div>
                <Progress value={l.progress} className="mt-4" />
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last session {l.lastSession}</span>
                  <Badge variant="secondary">{l.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Upcoming sessions</h2>
          <div className="card-soft divide-y divide-border">
            {sessions.map((s) => (
              <div key={s.id} className="flex items-start gap-3 p-4">
                <span className="flex size-10 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-soft text-[11px] font-semibold text-primary">
                  {s.time}
                </span>
                <div className="text-sm">
                  <p className="font-medium text-foreground">{learnerById(s.learnerId)?.name ?? "Learner"}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.date} · {s.focus}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <ResponsibleAiNotice />
          </div>
        </section>
      </div>

      <PageHeader title="" />
    </AppShell>
  );
}
