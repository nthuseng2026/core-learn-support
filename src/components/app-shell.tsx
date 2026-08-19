import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  BarChart3,
  BookOpenCheck,
  ClipboardCheck,
  LayoutDashboard,
  Mail,
  Menu,
  Settings,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/learners", label: "Learners", icon: Users },
  { to: "/learning-checks", label: "Learning Checks", icon: ClipboardCheck },
  { to: "/learning-plans", label: "Learning Plans", icon: BookOpenCheck },
  { to: "/activities", label: "Activities", icon: Wand2 },
  { to: "/progress", label: "Progress", icon: BarChart3 },
  { to: "/parent-communication", label: "Parent Communication", icon: Mail },
  { to: "/assistant", label: "AI Learning Assistant", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 px-2 py-1">
      <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">
        N
      </span>
      <span className="leading-tight">
        <span className="block font-heading text-[15px] font-semibold text-foreground">
          Nthuseng Learning Room
        </span>
        <span className="block text-xs text-muted-foreground">
          Building confident learners, one step at a time.
        </span>
      </span>
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <Icon className="size-[18px] shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col justify-between border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <div className="flex flex-col gap-6">
          <Brand />
          <NavList />
        </div>
        <div className="rounded-2xl bg-accent-soft p-4 text-xs leading-relaxed text-accent-foreground">
          <p className="font-semibold">Demonstration data</p>
          <p className="mt-1">All learners shown are fictional examples for demonstration purposes.</p>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open navigation menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-sidebar p-4">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="mt-6 flex flex-col gap-6">
              <NavList onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="lg:pl-72">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">{children}</div>
      </main>
    </div>
  );
}