"use client";

import { useState, useEffect, useCallback } from "react";
import { getMonday, getWeekDays } from "@/lib/utils";
import { getMealsForWeek, MealData } from "@/actions/meals";
import WeekNavigation from "./WeekNavigation";
import DayCard from "./DayCard";
import { Loader2 } from "lucide-react";

export default function WeekView() {
  const [currentMonday, setCurrentMonday] = useState<Date>(() =>
    getMonday(new Date())
  );
  const [meals, setMeals] = useState<MealData[]>([]);
  const [loading, setLoading] = useState(true);

  const weekDays = getWeekDays(currentMonday);

  const loadMeals = useCallback(async () => {
    setLoading(true);
    try {
      const dateStr = currentMonday.toISOString().split("T")[0];
      const data = await getMealsForWeek(dateStr);
      setMeals(data);
    } catch (error) {
      console.error("Error loading meals:", error);
    } finally {
      setLoading(false);
    }
  }, [currentMonday]);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  const handlePreviousWeek = () => {
    setCurrentMonday((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setCurrentMonday((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  const getMealForDay = (date: Date, type: "lunch" | "dinner") => {
    const dateStr = date.toISOString().split("T")[0];
    return meals.find((meal) => meal.date === dateStr && meal.type === type);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <WeekNavigation
        currentMonday={currentMonday}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-mint-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {weekDays.map((day, index) => (
            <DayCard
              key={day.toISOString()}
              date={day}
              lunchMeal={getMealForDay(day, "lunch")}
              dinnerMeal={getMealForDay(day, "dinner")}
              colorIndex={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
