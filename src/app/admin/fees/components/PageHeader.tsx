"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
}

export function PageHeader({
  title,
  description,
  actionLabel = "Create New",
  onAction,
  actionDisabled = false,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      {onAction ? (
        <Button className="gap-2" onClick={onAction} disabled={actionDisabled}>
          <Plus className="w-4 h-4" />
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
