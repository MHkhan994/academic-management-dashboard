import { ReactNode } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { cn } from "@/lib/utils";

type TProps = {
  title: string | ReactNode;
  subtitle?: string;
  buttons?: ReactNode;
  className?: string;
};

const PageHeader = ({ title, subtitle, buttons, className }: TProps) => {
  return (
    <div
      className={cn(
        "flex items-center border-b flex-wrap gap-x-3 gap-y-3 pb-3 min-w-0",
        className
      )}
    >
      <div className="flex items-center">
        <SidebarTrigger size={"sm"} />
        <div className="border-l-2 pl-4 ml-3">
          <h4 className="page-title">{title}</h4>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </div>
      {buttons && <div className="flex gap-2 ml-10">{buttons}</div>}
    </div>
  );
};

export default PageHeader;
