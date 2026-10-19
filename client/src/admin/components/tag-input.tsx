import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { X } from "lucide-react";
import { FieldFrame } from "@/admin/components/field";
import { describedBy } from "@/admin/components/field-utils";
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
 * Free-text tags. Enter or a comma adds one, Backspace on an empty field
 * removes the last, and leaving the field adds whatever was typed so nothing
 * is lost. Duplicates (any casing) and over-long tags are refused with a
 * message. Order is kept: it is the order the tags are shown in.
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
    <FieldFrame id={id} label={label} hint={hint} error={error}>
      <div
        className={cn(
          "mt-2 rounded-button border bg-bg p-2 focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-focus-ring",
          error ? "border-danger" : "border-border",
        )}
      >
        {value.length > 0 ? (
          <ul
            aria-label={`${label} added`}
            className="mb-2 flex flex-wrap gap-2"
          >
            {value.map((tag, index) => (
              <li
                key={tag.toLowerCase()}
                className="inline-flex h-8 items-center gap-1 rounded-full border border-border bg-surface-raised pr-1 pl-3 text-micro font-medium tracking-label text-fg uppercase"
              >
                {tag}
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={() => {
                    removeAt(index);
                  }}
                  className="grid size-6 place-items-center rounded-full text-fg-muted hover:bg-border hover:text-fg"
                >
                  <X aria-hidden size={12} />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <input
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
          className="h-8 w-full bg-transparent px-2 text-body text-fg outline-none placeholder:text-fg-subtle"
        />
      </div>
      {notice ? (
        <p role="status" className="mt-2 text-caption text-fg-muted">
          {notice}
        </p>
      ) : null}
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </FieldFrame>
  );
}
