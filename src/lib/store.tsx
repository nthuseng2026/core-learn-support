import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  demoActivities,
  demoChecks,
  demoLearners,
  demoPlans,
  demoProgress,
  demoReports,
  demoSessions,
} from "./demo-data";
import type {
  Activity,
  LearningCheck,
  LearningPlan,
  Learner,
  ProgressEntry,
  Report,
  Session,
} from "./types";

const uid = () => Math.random().toString(36).slice(2, 9);

type Store = {
  learners: Learner[];
  sessions: Session[];
  checks: LearningCheck[];
  plans: LearningPlan[];
  activities: Activity[];
  progress: ProgressEntry[];
  reports: Report[];
  addLearner: (l: Omit<Learner, "id">) => Learner;
  updateLearner: (id: string, patch: Partial<Learner>) => void;
  addCheck: (c: Omit<LearningCheck, "id">) => void;
  addPlan: (p: Omit<LearningPlan, "id">) => void;
  updatePlan: (id: string, patch: Partial<LearningPlan>) => void;
  addActivity: (a: Omit<Activity, "id">) => void;
  addProgress: (p: Omit<ProgressEntry, "id">) => void;
  addReport: (r: Omit<Report, "id">) => void;
  learnerById: (id: string) => Learner | undefined;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [learners, setLearners] = useState<Learner[]>(demoLearners);
  const [sessions] = useState<Session[]>(demoSessions);
  const [checks, setChecks] = useState<LearningCheck[]>(demoChecks);
  const [plans, setPlans] = useState<LearningPlan[]>(demoPlans);
  const [activities, setActivities] = useState<Activity[]>(demoActivities);
  const [progress, setProgress] = useState<ProgressEntry[]>(demoProgress);
  const [reports, setReports] = useState<Report[]>(demoReports);

  const value = useMemo<Store>(
    () => ({
      learners,
      sessions,
      checks,
      plans,
      activities,
      progress,
      reports,
      addLearner: (l) => {
        const learner = { ...l, id: uid() };
        setLearners((prev) => [learner, ...prev]);
        return learner;
      },
      updateLearner: (id, patch) =>
        setLearners((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l))),
      addCheck: (c) => setChecks((prev) => [{ ...c, id: uid() }, ...prev]),
      addPlan: (p) => setPlans((prev) => [{ ...p, id: uid() }, ...prev]),
      updatePlan: (id, patch) =>
        setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
      addActivity: (a) => setActivities((prev) => [{ ...a, id: uid() }, ...prev]),
      addProgress: (p) => setProgress((prev) => [{ ...p, id: uid() }, ...prev]),
      addReport: (r) => setReports((prev) => [{ ...r, id: uid() }, ...prev]),
      learnerById: (id) => learners.find((l) => l.id === id),
    }),
    [learners, sessions, checks, plans, activities, progress, reports],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}