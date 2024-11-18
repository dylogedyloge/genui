// utils/timeHelpers.ts

/**
 * Formats a JavaScript Date object into a Persian time format.
 * Example output: 3:45 بعدازظهر
 *
 * @param date - The JavaScript Date object to format
 * @returns A string representing the time in Persian format
 */
export const formatPersianTime = (date: Date): string => {
  const persianMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  // Get hours and minutes
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine if the time is AM or PM in Persian
  const period = hours >= 12 ? "بعدازظهر" : "صبح";

  // Convert to 12-hour format
  const persianHours = hours % 12 || 12;

  // Pad minutes with leading 0 if needed
  const paddedMinutes = minutes.toString().padStart(2, "0");

  // Return formatted time
  return `${persianHours}:${paddedMinutes} ${period}`;
};

/**
 * Converts a Date object to a Persian date string (year/month/day).
 * Example output: 1401/6/10
 *
 * @param date - The JavaScript Date object to format
 * @returns A string representing the date in Persian format
 */
export const formatPersianDate = (date: Date): string => {
  const persianDate = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date);

  return persianDate;
};
