import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";

const TITLE = "Settings — Nthuseng Learning Room";
const DESCRIPTION =
  "Practice details, responsible AI principles and an overview of the records held in your Nthuseng Learning Room.";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: SettingsPage,
});

const PRINCIPLES = [
  "The AI supports your professional judgement — it never replaces it.",
  "No diagnosis, medical or psychological labelling of any learner.",
  "Strengths-based, encouraging language about every child.",
  "Every AI draft is editable, and you decide what is used or shared.",
  "Learner information stays in your practice and is never used to teach the AI.",
];

function SettingsPage() {
  const { learners, plans, checks, activities, progress, reports } = useStore();

  const stats = [
    { label: "Learners", value: learners.length },
    { label: "Learning checks", value: checks.length },
    { label: "Learning plans", value: plans.length },
    { label: "Activities saved", value: activities.length },
    { label: "Sessions recorded", value: progress.length },
    { label: "Reports saved", value: reports.length },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Settings"
        subtitle="Your practice at a glance, and the principles that guide how AI is used here."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-soft p-6">
          <h2 className="text-lg font-semibold text-foreground">Practice details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Practice</dt>
              <dd className="font-medium text-foreground">Nthuseng Learning Room</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Approach</dt>
              <dd className="font-medium text-foreground">Personalised learning support</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Subjects</dt>
              <dd className="font-medium text-foreground">Literacy &amp; Mathematics</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">AI support</dt>
              <dd className="font-medium text-foreground">Enabled</dd>
            </div>
          </dl>
        </section>

        <section className="card-soft p-6">
          <h2 className="text-lg font-semibold text-foreground">Your records</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl bg-secondary p-4">
                <p className="text-2xl font-semibold text-foreground">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card-soft p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Responsible AI</h2>
            <Badge variant="secondary">Always on</Badge>
          </div>
          <ul className="mt-4 space-y-3">
            {PRINCIPLES.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-muted-foreground">
                <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">
            If a learner may need specialised assessment or therapy, refer to a qualified professional. This
            platform is a teaching and planning support tool, not an assessment or diagnostic instrument.
          </p>
        </section>
      </div>
    </AppShell>
  );
}