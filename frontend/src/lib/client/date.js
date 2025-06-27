import { formatNumberWithComma } from "./string";

/**
 * Formats a date according to the specified format string.
 *
 * Supported format tokens:
 *   - "yyyy": Full year in four digits (e.g., 2025)
 *   - "MM": Month as two digits (e.g., 01 for January)
 *   - "MMMM": Full month name (e.g., January)
 *   - "MMM": Abbreviated month name (e.g., Jan)
 *   - "dd": Day of the month as two digits (e.g., 01)
 *   - "EEEE": Full day name (e.g., Monday)
 *   - "EEE": Abbreviated day name (e.g., Mon)
 *   - "HH": Hours in 24-hour format (e.g., 14)
 *   - "mm": Minutes (e.g., 05)
 *   - "ss": Seconds (e.g., 09)
 *
 * If no format string is provided, the default format is "yyyy-MM-dd".
 *
 * @param {Date|string} date - The date to format, or a string representation of it.
 * @param {string} [format="yyyy-MM-dd"] - The format string to use.
 * @returns {string} - The formatted date string.
 */
export function formatDate(date, format = "yyyy-MM-dd") {
  if (!date) return "";

  let dateString = typeof date === "string" ? date : date.toISOString();
  dateString = dateString.replace(/([+-]\d{4})Z$/, "$1");

  const d = new Date(dateString);
  if (isNaN(d)) return "Invalid Date";

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const monthName = months[month - 1];
  const dayName = days[d.getDay()];

  return format
    .replace("yyyy", year)
    .replace("MMMM", monthName)
    .replace("MMM", monthName.slice(0, 3))
    .replace("MM", month < 10 ? `0${month}` : month)
    .replace("dd", day < 10 ? `0${day}` : day)
    .replace("EEEE", dayName)
    .replace("EEE", dayName.slice(0, 3))
    .replace("HH", hours < 10 ? `0${hours}` : hours)
    .replace("mm", minutes < 10 ? `0${minutes}` : minutes)
    .replace("ss", seconds < 10 ? `0${seconds}` : seconds);
}

/**
 * Get the time ago string for a given date.
 *
 * @param {string} date the date in ISO 8601 format
 * @return {string} the time ago string
 */
export function timeAgo(date) {
  const diff = (new Date().getTime() - new Date(date).getTime()) / 1000;

  const units = [
    { name: "year", seconds: 60 * 60 * 24 * 365 },
    { name: "month", seconds: 60 * 60 * 24 * 30 },
    { name: "day", seconds: 60 * 60 * 24 },
    { name: "hour", seconds: 60 * 60 },
    { name: "minute", seconds: 60 },
  ];

  for (const unit of units) {
    const amount = Math.floor(diff / unit.seconds);
    if (amount >= 1)
      return `${amount} ${unit.name}${amount > 1 ? "s" : ""} ago`;
  }

  return diff > 5 ? `${Math.floor(diff)} seconds ago` : "just now";
}

export function daysAgo(date, format = false, string = false) {
  if (!date) return "";
  const diff = (new Date().getTime() - new Date(date).getTime()) / 1000;
  const days = Math.abs(Math.floor(diff / 60 / 60 / 24));
  let dayCount = days;

  if (format) dayCount = formatNumberWithComma(days);

  return !string ? dayCount : `${dayCount} day${days > 1 ? "s" : ""}`;
}

/**
 * Converts a duration between two dates into a human-readable format.
 *
 * The format will display as "X years, Y months, Z days", with customizable placeholders.
 * The user can pass custom placeholders for years, months, and days using a format string.
 *
 * @param {Date|string} startDate - The starting date.
 * @param {Date|string} endDate - The ending date.
 * @param {boolean} [absolute=true] - Whether to show only positive durations.
 * @param {string} [format="Y years, M months, D days"] - The format string with placeholders:
 *   - "Y" for years
 *   - "M" for months
 *   - "D" for days
 * @returns {string} - The formatted duration string.
 */
export function formatDuration(
  startDate,
  endDate,
  absolute = true,
  format = ""
) {
  if (!startDate || !endDate) return "";

  let start = new Date(startDate);
  let end = new Date(endDate);

  if (absolute && start > end) {
    [start, end] = [end, start];
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const replacements = {
    Y: years,
    M: months,
    D: days,
  };

  let duration = format;

  for (const [key, value] of Object.entries(replacements)) {
    duration = duration.replace(key, `${value}`);
  }

  if (!format) {
    duration = `${years > 0 ? `${years} years, ` : ""} ${
      months > 0 ? `${months} months, ` : ""
    } ${days > 0 ? `${days} days` : ""}`;
  }

  return duration;
}

/**
 *
 * @param {number} duration in milliseconds
 *
 * @returns {string} formatted duration
 */
export function formatTimeDuration(duration) {
  const totalSeconds = Math.floor(duration / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`;
}
