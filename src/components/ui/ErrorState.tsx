import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";

interface ErrorStateProps {
  title: string;
  description: ReactNode;
  /** Usually a retry button or a link back to a safe page. */
  action?: ReactNode;
}

export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <div role="alert" className="mx-auto flex max-w-lg flex-col items-center text-center">
      <CircleAlert aria-hidden="true" className="size-8 text-danger" strokeWidth={1.5} />
      <h2 className="mt-6 text-h3 text-forest-900">{title}</h2>
      <div className="mt-3 text-muted">{description}</div>
      {action ? <div className="mt-8 flex flex-wrap justify-center gap-3">{action}</div> : null}
    </div>
  );
}
