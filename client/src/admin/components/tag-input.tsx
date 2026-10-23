import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { X } from "lucide-react";
import { describedBy, FIELD_LABEL_CLASS } from "@/admin/components/field-utils";
import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  hint?: string;
  error?: string | null;
  placeholder?: string;
  maxTags?: number;
  maxTagLength?: number;
}

/**
 * Free-text tags built from shadcn Field, Input and Badge (shadcn has no tag
 * input). Enter or a comma adds one, Backspace on an empty field removes the
 * last, and leaving the field adds whatever was typed so nothing is lost.
 * Duplicates (any casing) and over-long tags are refused with a message.
 * Order is kept: it is the order the tags are shown in.
 */
export function TagInput({
  label,
  value,
  onChange,
  hint,
  error,
  placeholder,
  maxTags = 12,
  maxTagLength = 40,
}: TagInputProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const countText = (count: number) =>
    `${count} ${count === 1 ? "tag" : "tags"}`;

  /** Adds every non-empty piece of `raw`, and says why anything was skipped. */
  const addTags = (raw: string) => {
    const pieces = raw
      .split(/[,\n]/)
      .map((piece) => piece.trim())
      .filter((piece) => piece.length > 0);
    if (pieces.length === 0) return;

    const next = [...value];
    const added: string[] = [];
    let problem: string | null = null;

    for (const piece of pieces) {
      if (piece.length > maxTagLength) {
        problem = `Tags can be up to ${maxTagLength} characters.`;
        continue;
      }
      if (next.some((tag) => tag.toLowerCase() === piece.toLowerCase())) {
        problem = `“${piece}” is already added.`;
        continue;
      }
      if (next.length >= maxTags) {
        problem = `You can add up to ${maxTags} tags.`;
        break;
      }
      next.push(piece);
      added.push(piece);
    }

    if (added.length > 0) {
      onChange(next);
      setAnnouncement(`Added ${added.join(", ")}. ${countText(next.length)}.`);
    }
    setNotice(problem);
  };

  const removeAt = (index: number) => {
    const removed = value[index];
    if (removed === undefined) return;
    const next = value.filter((_, position) => position !== index);
    onChange(next);
    setNotice(null);
    setAnnouncement(`Removed ${removed}. ${countText(next.length)}.`);
    inputRef.current?.focus();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    if (text.includes(",") || text.includes("\n")) {
      // Everything before the last comma is complete; the rest is still being typed.
      const lastBreak = Math.max(text.lastIndexOf(","), text.lastIndexOf("\n"));
      addTags(text.slice(0, lastBreak));
      setDraft(text.slice(lastBreak + 1));
      return;
    }
    setDraft(text);
    setNotice(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && draft.trim().length > 0) {
      // Add the tag instead of submitting the surrounding form.
      event.preventDefault();
      addTags(draft);
      setDraft("");
    } else if (event.key === "Backspace" && draft.length === 0) {
      if (value.length > 0) removeAt(value.length - 1);
    }
  };

  const handleBlur = () => {
    if (draft.trim().length > 0) {
      addTags(draft);
      setDraft("");
    }
  };

  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id} className={FIELD_LABEL_CLASS}>
        {label}
      </FieldLabel>
      {/* Looks like an Input; the real (borderless) Input sits inside it. */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-md border border-input bg-transparent p-2 shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 dark:bg-input/30",
          error &&
            "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
        )}
      >
        {value.length > 0 ? (
          <ul aria-label={`${label} added`} className="flex flex-wrap gap-2">
            {value.map((tag, index) => (
              <li key={tag.toLowerCase()}>
                <Badge
                  variant="secondary"
                  className="h-8 gap-1 rounded-full pr-1 pl-3 text-micro font-medium tracking-label uppercase"
                >
                  {tag}
                  <button
                    type="button"
                    aria-label={`Remove ${tag}`}
                    onClick={() => {
                      removeAt(index);
                    }}
                    className="grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-border hover:text-foreground"
                  >
                    <X aria-hidden size={12} />
                  </button>
                </Badge>
              </li>
            ))}
          </ul>
        ) : null}
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={draft}
          placeholder={placeholder}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, Boolean(hint), Boolean(error))}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="h-8 min-w-32 flex-1 border-0 bg-transparent px-2 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
      </div>
      {notice ? (
        <p role="status" className="text-caption text-muted-foreground">
          {notice}
        </p>
      ) : null}
      {hint ? (
        <FieldDescription id={`${id}-hint`}>{hint}</FieldDescription>
      ) : null}
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </Field>
  );
}
