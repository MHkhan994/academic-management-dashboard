"use client";
import React, { Activity } from "react";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "../ui/switch";
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const { open } = useSidebar();

  return (
    <Button
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      variant={open ? "outline" : "ghost"}
      className="w-full px-2 text-base font-medium shrink-0 overflow-hidden"
      size={"lg"}
    >
      <div className="flex gap-2 items-center flex-1">
        {theme === "dark" ? <Moon className="size-5" /> : <Sun size={24} />}
        <span className={cn(open ? "" : "hidden")}>Dark Mode</span>
      </div>
      <Switch className={cn(open ? "" : "hidden")} checked={theme === "dark"} />
    </Button>
  );
};

export default ThemeSwitcher;
