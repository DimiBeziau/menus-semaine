"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface MealData {
  id: string;
  date: string;
  type: "lunch" | "dinner";
  content: string;
}

export async function getMealsForWeek(
  startDate: string
): Promise<MealData[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non authentifié");
  }

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const meals = await prisma.meal.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: start,
        lt: end,
      },
    },
    orderBy: { date: "asc" },
  });

  return meals.map((meal) => ({
    id: meal.id,
    date: meal.date.toISOString().split("T")[0],
    type: meal.type as "lunch" | "dinner",
    content: meal.content,
  }));
}

export async function saveMeal(
  date: string,
  type: "lunch" | "dinner",
  content: string
): Promise<MealData> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non authentifié");
  }

  const mealDate = new Date(date);
  mealDate.setHours(12, 0, 0, 0);

  const meal = await prisma.meal.upsert({
    where: {
      userId_date_type: {
        userId: session.user.id,
        date: mealDate,
        type,
      },
    },
    update: {
      content,
    },
    create: {
      userId: session.user.id,
      date: mealDate,
      type,
      content,
    },
  });

  revalidatePath("/dashboard");

  return {
    id: meal.id,
    date: meal.date.toISOString().split("T")[0],
    type: meal.type as "lunch" | "dinner",
    content: meal.content,
  };
}

export async function deleteMeal(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non authentifié");
  }

  await prisma.meal.delete({
    where: {
      id,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
}
