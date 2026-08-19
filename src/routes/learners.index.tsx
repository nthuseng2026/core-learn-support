import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GRADES } from "@/lib/demo-data";
import { initials, today } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Subject } from "@/lib/types";

const TITLE = "Learners — Nthuseng Learning Room";
const DESCRIPTION =
  "Manage learner profiles, grades, learning focus areas and progress in Nthuseng Learning Room.";

export const Route = createFileRoute("/learners/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: LearnersPage,
});

function LearnersPage() {
  const { learners, addLearner } = useStore();
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("all");
  const [subject, setSubject] = useState("all");
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    grade: "Grade 1",
    school: "",
    age: "7",
    guardian: "",
    guardianContact: "",
    format: "In person, weekly",
    focus: "",
    subject: "Literacy" as Subject,
  });

  const filtered = learners.filter(
    (l) =>
      (grade === "all" || l.grade === grade) &&
      (subject === "all" || l.subject === subject) &&
      (l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.focus.toLowerCase().includes(query.toLowerCase())),
  );

  function submit() {
    if (!form.name.trim()) {
      toast.error("Please add a learner name or learner ID.");
      return;
    }
    addLearner({
      ...form,
      age: Number(form.age) || 7,
      focus: form.focus.trim() || `${form.subject} support`,
      progress: 0,
      lastSession: today(),
      status: "New",
      strengths: [],
      growth: [],
      goals: [],
    });
    setOpen(false);
    setForm({ ...form, name: "", school: "", guardian: "", guardianContact: "", focus: "" });
    toast.success("Learner added — you can now start a Learning Check.");
  }

  return (
    <AppShell>
      <PageHeader
        title="Learners"
        subtitle="Every learner has their own profile, learning focus and journey. All learners shown are fictional demonstration data."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus /> Add Learner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add a learner</DialogTitle>
                <DialogDescription>
                  Please enter only the information you need. Avoid unnecessary sensitive personal details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Learner name or learner ID</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Thabo M. or LRN-014"
                  />
                </div>
                <div>
                  <Label>Grade</Label>
                  <Select value={form.grade} onValueChange={(v) => setForm({ ...form, grade: v })}>
                    <SelectTrigger>
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
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="school">School</Label>
                  <Input
                    id="school"
                    value={form.school}
                    onChange={(e) => setForm({ ...form, school: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Primary learning focus</Label>
                  <Select
                    value={form.subject}
                    onValueChange={(v) => setForm({ ...form, subject: v as Subject })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Literacy">Literacy</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="focus">Focus description</Label>
                  <Input
                    id="focus"
                    value={form.focus}
                    onChange={(e) => setForm({ ...form, focus: e.target.value })}
                    placeholder="e.g. Literacy — letter sounds"
                  />
                </div>
                <div>
                  <Label htmlFor="guardian">Parent / guardian</Label>
                  <Input
                    id="guardian"
                    value={form.guardian}
                    onChange={(e) => setForm({ ...form, guardian: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact">Contact</Label>
                  <Input
                    id="contact"
                    value={form.guardianContact}
                    onChange={(e) => setForm({ ...form, guardianContact: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="format">Preferred learning format</Label>
                  <Input
                    id="format"
                    value={form.format}
                    onChange={(e) => setForm({ ...form, format: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submit}>Save learner</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="card-soft mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search learners"
            className="pl-9"
            aria-label="Search learners"
          />
        </div>
        <Select value={grade} onValueChange={setGrade}>
          <SelectTrigger className="sm:w-40" aria-label="Filter by grade">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All grades</SelectItem>
            {GRADES.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger className="sm:w-44" aria-label="Filter by learning focus">
            <SelectValue placeholder="Learning focus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All focus areas</SelectItem>
            <SelectItem value="Literacy">Literacy</SelectItem>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="card-soft border-dashed p-12 text-center">
          <p className="font-semibold text-foreground">No learners match your search yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different grade or focus area, or add a new learner to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((l) => (
            <Link
              key={l.id}
              to="/learners/$learnerId"
              params={{ learnerId: l.id }}
              className="card-soft block p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft font-semibold text-primary">
                  {initials(l.name)}
                </span>
                <div>
                  <p className="font-semibold text-foreground">{l.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.grade} · {l.school}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-foreground">{l.focus}</p>
              <Progress value={l.progress} className="mt-3" />
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Last session {l.lastSession}</span>
                <Badge variant="secondary">{l.status}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}