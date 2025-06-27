import crypto from "crypto";

/**
 * Uppercase the first letter of a string and lowercase the rest of the string.
 *
 * @example
 * ucFirst('hello world') // 'Hello world'
 *
 * @param {string} string
 * @returns {string}
 */

export function ucFirst(string) {
  return (
    string.slice(0, 1).toUpperCase() +
    string.substring(1, string.length).toLowerCase()
  );
}

export function ucFirstWords(string) {
  return string
    .split(" ")
    .map((word) => ucFirst(word))
    .join(" ");
}

export function truncateString(str, num, trucateFromEnd = false) {
  let len = str.length;
  if (len < num) return str;

  const final = `${str.slice(0, num / 2)}...${str.slice(-num / 2)}`;
  const slices = str.split(" ");

  if (slices.length <= 1) {
    return final;
  }

  if (trucateFromEnd) {
    return `${str.slice(0, num)}...`;
  }

  for (let i = slices.length - 2; i >= 0; i--) {
    const removed = slices.splice(i, 1);
    len = len - removed[0].length;

    if (len < num) {
      break;
    }
  }

  const prefix = slices.slice(0, slices.length - 1);
  if (prefix.length > 0) {
    return `${prefix.join(" ")} ... ${slices[slices.length - 1]}`;
  }

  return final;
}

export function generateRandomString(length = 16) {
  if (typeof length !== "number" || length <= 0) {
    length = 16;
  }

  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);

  let result = "";
  for (let i = 0; i < length; i++) {
    result += randomValues[i].toString(16).padStart(2, "0");
  }

  return result;
}

export const generateUniqueHash = (length = 5) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

export function formatNumberWithSuffix(num) {
  num = Number(num) || 0;

  if (num > 1e15) return (num / 1e15).toFixed(1) + "Q";
  if (num > 1e12) return (num / 1e12).toFixed(1) + "T";
  if (num > 1e9) return (num / 1e9).toFixed(1) + "B";
  if (num > 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num > 1e3) return (num / 1e3).toFixed(1) + "K";

  return num;
}

export function formatFileSize(size) {
  size = Number(size) || 0;

  if (size >= 1e15) return (size / 1e15).toFixed(2) + " PB";
  if (size >= 1e12) return (size / 1e12).toFixed(2) + " TB";
  if (size >= 1e9) return (size / 1e9).toFixed(2) + " GB";
  if (size >= 1e6) return (size / 1e6).toFixed(2) + " MB";
  if (size >= 1e3) return (size / 1e3).toFixed(2) + " KB";

  return size + " B";
}

export function formatNumberWithPrecision(number, precision = 2) {
  const num = Number(number) || 0;
  return Number(num.toFixed(precision));
}

export function formatNumberWithComma(
  number,
  locale = "en-US",
  maxPrecision = 2,
  minPrecision = 0
) {
  return (Number(number) || 0).toLocaleString(locale, {
    maximumFractionDigits: maxPrecision,
    minimumFractionDigits: minPrecision,
  });
}

/**
 * Converts an array of RGB values to a hexadecimal color string.
 *
 * @param {number[]} rgbArray - An array containing the red, green, and blue
 *   components of the color, each ranging from 0 to 255.
 * @returns {string} - The hexadecimal color string in the format "#rrggbb".
 */

export function rgbToHex(rgbArray) {
  const toHex = (n) => n.toString(16).padStart(2, "0");
  return `#${toHex(rgbArray[0])}${toHex(rgbArray[1])}${toHex(rgbArray[2])}`;
}
