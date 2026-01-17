/**
 * Get the Monday of the week for a given date
 */
export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get an array of 7 dates starting from a Monday
 */
export function getWeekDays(monday: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    days.push(day);
  }
  return days;
}

/**
 * Format a date for display (e.g., "Lundi 13")
 */
export function formatDayName(date: Date): string {
  const dayNames = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  return `${dayNames[date.getDay()]} ${date.getDate()}`;
}

/**
 * Format a week range for display (e.g., "13 - 19 Janvier 2026")
 */
export function formatWeekRange(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const startDay = monday.getDate();
  const endDay = sunday.getDate();
  const startMonth = months[monday.getMonth()];
  const endMonth = months[sunday.getMonth()];
  const year = sunday.getFullYear();

  if (monday.getMonth() === sunday.getMonth()) {
    return `${startDay} - ${endDay} ${startMonth} ${year}`;
  } else {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
  }
}

/**
 * Format date for database storage (YYYY-MM-DD)
 */
export function formatDateForDB(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Parse date from database format
 */
export function parseDateFromDB(dateString: string): Date {
  return new Date(dateString + "T00:00:00.000Z");
}
