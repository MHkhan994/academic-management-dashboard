"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface YearPickerProps {
  value?: number;
  onChange?: (year: number) => void;
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
}

export function YearPicker({
  value,
  onChange,
  minYear = 1900,
  maxYear = new Date().getFullYear() + 10,
  placeholder = "Pick a year",
}: YearPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    value || new Date().getFullYear()
  );
  const [displayRange, setDisplayRange] = useState(selectedYear - 6);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    onChange?.(year);
    setOpen(false);
  };

  const handlePrevious = () => {
    const newRange = Math.max(minYear, displayRange - 12);
    setDisplayRange(newRange);
  };

  const handleNext = () => {
    const newRange = Math.min(maxYear - 11, displayRange + 12);
    setDisplayRange(newRange);
  };

  // Generate years to display (12 years at a time)
  const yearsToDisplay = Array.from({ length: 12 }, (_, i) => displayRange + i);

  // Auto-scroll to selected year when popover opens
  useEffect(() => {
    if (
      open &&
      (selectedYear < displayRange || selectedYear > displayRange + 11)
    ) {
      setDisplayRange(selectedYear - 6);
    }
  }, [open, selectedYear, displayRange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {value ? selectedYear : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0" align="start">
        <div className="flex flex-col gap-4 p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Select Year</h3>
            <span className="text-lg font-bold text-primary">
              {selectedYear}
            </span>
          </div>

          {/* Year Grid with Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={displayRange <= minYear}
              aria-label="Previous years"
              className="h-8 w-8 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1 grid grid-cols-3 gap-2">
              {yearsToDisplay.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  disabled={year < minYear || year > maxYear}
                  className={cn(
                    "py-2 px-3 rounded-md text-sm font-medium transition-colors",
                    "hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
                    selectedYear === year
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {year}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={displayRange + 12 >= maxYear}
              aria-label="Next years"
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Year Range Info */}
          <div className="text-xs text-muted-foreground text-center">
            {displayRange} - {displayRange + 11}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
