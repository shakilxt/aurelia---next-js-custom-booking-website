import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center border border-line px-6 py-16 text-center sm:py-20">
      <Icon aria-hidden="true" className="size-8 text-gold-ink" strokeWidth={1.25} />
      <h2 className="mt-6 text-h3 text-forest-900">{title}</h2>
      <div className="mt-3 max-w-md text-muted">{description}</div>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}
