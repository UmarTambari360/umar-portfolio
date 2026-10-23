import type { ReactNode } from "react";
import { CircleAlert, Inbox } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface StatePanelProps {
  /** "error" announces itself to screen readers (shadcn Alert); "empty" uses shadcn Empty. */
  tone: "empty" | "error";
  title: string;
  description?: string;
  /** Usually a Button: "Try again", "Add project". */
  action?: ReactNode;
}

/** Empty and error states for lists and pages. */
export function StatePanel({
  tone,
  title,
  description,
  action,
}: StatePanelProps) {
  if (tone === "error") {
    return (
      <Alert variant="destructive" className="p-6">
        <CircleAlert aria-hidden />
        <AlertTitle className="font-display text-title font-bold">
          {title}
        </AlertTitle>
        {description ? (
          <AlertDescription>{description}</AlertDescription>
        ) : null}
        {action ? <div className="col-start-2 mt-4">{action}</div> : null}
      </Alert>
    );
  }

  return (
    <Empty role="status" className="border border-dashed py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox aria-hidden />
        </EmptyMedia>
        <EmptyTitle className="font-display text-title font-bold">
          {title}
        </EmptyTitle>
        {description ? (
          <EmptyDescription>{description}</EmptyDescription>
        ) : null}
      </EmptyHeader>
      {action ? <EmptyContent>{action}</EmptyContent> : null}
    </Empty>
  );
}
