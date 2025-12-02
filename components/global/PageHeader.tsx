import { ReactNode } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import ThemeSwitcher from "../shared/ThemeSwitcher";

type TProps = {
  title: string | ReactNode;
  subtitle?: string;
  buttons?: ReactNode;
};

const PageHeader = ({ title, subtitle, buttons }: TProps) => {
  return (
    <div className="flex items-center p-4 border-b flex-wrap gap-x-3 gap-y-1.5 justify-between pb-4">
      <div className="flex items-center">
        <SidebarTrigger size={"sm"} />
        <div className="border-l-2 pl-4 ml-3">
          <h4 className="page-title">{title}</h4>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {buttons} <ThemeSwitcher />
      </div>
    </div>
  );
};

export default PageHeader;
