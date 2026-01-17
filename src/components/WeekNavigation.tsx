"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatWeekRange } from "@/lib/utils";

interface WeekNavigationProps {
  currentMonday: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

export default function WeekNavigation({
  currentMonday,
  onPreviousWeek,
  onNextWeek,
}: WeekNavigationProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <button
        onClick={onPreviousWeek}
        className="p-2 rounded-full bg-mint-100 hover:bg-mint-200 text-mint-700 transition-colors shadow-sm hover:shadow-md"
        aria-label="Semaine précédente"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <h2 className="text-lg md:text-xl font-semibold text-gray-700 min-w-[200px] text-center">
        {formatWeekRange(currentMonday)}
      </h2>

      <button
        onClick={onNextWeek}
        className="p-2 rounded-full bg-mint-100 hover:bg-mint-200 text-mint-700 transition-colors shadow-sm hover:shadow-md"
        aria-label="Semaine suivante"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
