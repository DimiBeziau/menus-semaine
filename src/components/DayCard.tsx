"use client";

import { useState, useCallback, useEffect } from "react";
import { Sun, Moon, Loader2 } from "lucide-react";
import { formatDayName } from "@/lib/utils";
import { saveMeal, MealData } from "@/actions/meals";

interface DayCardProps {
  date: Date;
  lunchMeal?: MealData;
  dinnerMeal?: MealData;
  colorIndex: number;
}

const cardColors = [
  "bg-mint-50 border-mint-200",
  "bg-sky-50 border-sky-200",
  "bg-lemon-50 border-lemon-200",
  "bg-rose-50 border-rose-200",
  "bg-mint-50 border-mint-200",
  "bg-sky-50 border-sky-200",
  "bg-lemon-50 border-lemon-200",
];

export default function DayCard({
  date,
  lunchMeal,
  dinnerMeal,
  colorIndex,
}: DayCardProps) {
  const [lunch, setLunch] = useState(lunchMeal?.content || "");
  const [dinner, setDinner] = useState(dinnerMeal?.content || "");
  const [savingLunch, setSavingLunch] = useState(false);
  const [savingDinner, setSavingDinner] = useState(false);

  const dateStr = date.toISOString().split("T")[0];
  const dayName = formatDayName(date);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  // Update local state when props change (e.g., when navigating weeks)
  useEffect(() => {
    setLunch(lunchMeal?.content || "");
    setDinner(dinnerMeal?.content || "");
  }, [lunchMeal, dinnerMeal]);

  const handleSave = useCallback(
    async (type: "lunch" | "dinner", content: string) => {
      const setSaving = type === "lunch" ? setSavingLunch : setSavingDinner;
      setSaving(true);

      try {
        await saveMeal(dateStr, type, content);
      } catch (error) {
        console.error("Error saving meal:", error);
      } finally {
        setSaving(false);
      }
    },
    [dateStr]
  );

  const handleLunchBlur = useCallback(() => {
    if (lunch !== (lunchMeal?.content || "")) {
      handleSave("lunch", lunch);
    }
  }, [lunch, lunchMeal, handleSave]);

  const handleDinnerBlur = useCallback(() => {
    if (dinner !== (dinnerMeal?.content || "")) {
      handleSave("dinner", dinner);
    }
  }, [dinner, dinnerMeal, handleSave]);

  return (
    <div
      className={`rounded-xl border-2 shadow-md hover:shadow-lg transition-shadow p-4 ${cardColors[colorIndex]} ${isWeekend ? "opacity-90" : ""}`}
    >
      <h3
        className={`font-semibold text-gray-700 mb-3 ${isWeekend ? "text-purple-700" : ""}`}
      >
        {dayName}
      </h3>

      {/* Lunch */}
      <div className="mb-3">
        <label className="flex items-center gap-2 text-sm font-medium text-amber-700 mb-1">
          <Sun className="w-4 h-4" />
          Déjeuner
          {savingLunch && <Loader2 className="w-3 h-3 animate-spin" />}
        </label>
        <textarea
          value={lunch}
          onChange={(e) => setLunch(e.target.value)}
          onBlur={handleLunchBlur}
          placeholder="Qu'allez-vous manger ?"
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent resize-none transition-all"
          rows={2}
        />
      </div>

      {/* Dinner */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-indigo-700 mb-1">
          <Moon className="w-4 h-4" />
          Dîner
          {savingDinner && <Loader2 className="w-3 h-3 animate-spin" />}
        </label>
        <textarea
          value={dinner}
          onChange={(e) => setDinner(e.target.value)}
          onBlur={handleDinnerBlur}
          placeholder="Qu'allez-vous manger ?"
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent resize-none transition-all"
          rows={2}
        />
      </div>
    </div>
  );
}
