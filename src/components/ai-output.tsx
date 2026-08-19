import { useState } from "react";
import { Copy, Eraser, Pencil, RefreshCw, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ResponsibleAiNotice({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={
        compact
          ? "text-xs leading-relaxed text-muted-foreground"
          : "rounded-2xl border border-border bg-secondary p-4 text-xs leading-relaxed text-muted-foreground"
      }
    >
      <span className="font-semibold text-foreground">AI Support Notice: </span>
      AI-generated suggestions are intended to support educational planning and administrative tasks. They do not
      replace professional judgement, formal diagnostic assessment, or advice from appropriately qualified
      professionals. Always review AI-generated content before using it with a learner or sharing it with a parent.
    </p>
  );
}

export function AiOutput({
  value,
  onChange,
  onRegenerate,
  onSave,
  loading = false,
  saveLabel = "Save",
  emptyHint = "Complete the fields above and generate a draft with AI.",
  extraActions,
}: {
  value: string;
  onChange: (next: string) => void;
  onRegenerate?: () => void;
  onSave?: () => void;
  loading?: boolean;
  saveLabel?: string;
  emptyHint?: string;
  extraActions?: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);

  if (loading) {
    return (
      <div className="card-soft flex items-center gap-3 p-6 text-sm text-muted-foreground">
        <Sparkles className="size-4 animate-pulse text-primary" aria-hidden />
        Drafting with AI — this usually takes a few seconds…
      </div>
    );
  }

  if (!value) {
    return (
      <div className="card-soft border-dashed p-8 text-center text-sm text-muted-foreground">{emptyHint}</div>
    );
  }

  return (
    <div className="card-soft overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/60 px-4 py-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-foreground">
          <Sparkles className="size-4 text-primary" aria-hidden /> AI draft — review before using
        </span>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setEditing((e) => !e)}>
            <Pencil /> {editing ? "Done" : "Edit"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(value);
                toast.success("Copied to clipboard");
              } catch {
                toast.error("Copying isn't available in this browser");
              }
            }}
          >
            <Copy /> Copy
          </Button>
          {onRegenerate ? (
            <Button size="sm" variant="outline" onClick={onRegenerate}>
              <RefreshCw /> Regenerate
            </Button>
          ) : null}
          <Button size="sm" variant="outline" onClick={() => onChange("")}>
            <Eraser /> Clear
          </Button>
          {extraActions}
          {onSave ? (
            <Button size="sm" onClick={onSave}>
              <Save /> {saveLabel}
            </Button>
          ) : null}
        </div>
      </div>
      {editing ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[320px] rounded-none border-0 text-sm focus-visible:ring-0"
        />
      ) : (
        <div className="whitespace-pre-wrap px-5 py-5 text-sm leading-relaxed text-foreground">{value}</div>
      )}
    </div>
  );
}