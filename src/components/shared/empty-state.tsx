import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-border bg-card/80 px-6 py-10 text-center shadow-sm">
      {icon ? (
        <div className="mx-auto mb-4 flex w-fit rounded-full bg-muted p-4">
          {icon}
        </div>
      ) : null}
      <h3 className="font-serif text-2xl text-foreground">{title}</h3>
      <p className="mx-auto mt-3 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction ? (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
