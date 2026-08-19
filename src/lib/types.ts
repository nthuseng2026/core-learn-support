export type Subject = "Literacy" | "Mathematics";

export type Learner = {
  id: string;
  name: string;
  grade: string;
  school: string;
  age: number;
  guardian: string;
  guardianContact: string;
  format: string;
  focus: string;
  subject: Subject;
  progress: number;
  lastSession: string;
  status: "On track" | "Needs attention" | "New";
  strengths: string[];
  growth: string[];
  goals: string[];
};

export type Session = {
  id: string;
  learnerId: string;
  date: string;
  time: string;
  focus: string;
};

export type LearningCheck = {
  id: string;
  learnerId: string;
  date: string;
  literacy: Record<string, number>;
  mathematics: Record<string, number>;
  observation: Record<string, string>;
  notes: string;
  analysis?: string;
};

export type LearningPlan = {
  id: string;
  learnerId: string;
  created: string;
  reviewDate: string;
  priorityAreas: string;
  currentLevel: string;
  goals: string;
  activities: string;
  frequency: string;
  indicators: string;
};

export type Activity = {
  id: string;
  title: string;
  grade: string;
  subject: Subject;
  skill: string;
  difficulty: string;
  type: string;
  content: string;
};

export type ProgressEntry = {
  id: string;
  learnerId: string;
  date: string;
  skill: string;
  activity: string;
  performance: number;
  prompting: string;
  successes: string;
  challenges: string;
  nextSteps: string;
};

export type Report = {
  id: string;
  learnerId: string;
  date: string;
  content: string;
};