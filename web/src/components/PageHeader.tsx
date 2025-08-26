import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="mb-4">
      <div className="flex items-start justify-between my-3">
        <h2 className="text-xl font-bold ml-3">{title}</h2>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
      <Separator />
    </div>
  );
}
