/**
 * Utility Functions Module
 *
 * A collection of helper functions for handling common operations throughout the application.
 * Includes utilities for error handling, image processing, URL manipulation, and object operations.
 *
 * Features:
 * - Class name merging with Tailwind
 * - Error handling and logging
 * - Image placeholder generation
 * - URL query manipulation
 * - Debouncing
 * - Image size calculations
 * - File downloading
 * - Deep object merging
 */

/* eslint-disable prefer-const */
/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import qs from "qs";
import { twMerge } from "tailwind-merge";
import { aspectRatioOptions } from "@/constants";

/**
 * Merges class names using clsx and tailwind-merge
 * Useful for combining conditional classes with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Standardized error handling function
 * Processes different types of errors and provides consistent error logging
 * @param error - The error to be handled (can be Error object, string, or unknown)
 */
export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    // This is a native JavaScript error (e.g., TypeError, RangeError)
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    // This is a string error message
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    // This is an unknown type of error
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};

/**
 * Generates SVG shimmer effect for image placeholders
 * Creates a loading animation while images are being transformed
 * @param w - Width of the shimmer effect
 * @param h - Height of the shimmer effect
 */
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#7986AC" offset="20%" />
      <stop stop-color="#68769e" offset="50%" />
      <stop stop-color="#7986AC" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#7986AC" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

/**
 * Converts string to base64 encoding
 * Handles both browser and Node.js environments
 */
const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

/**
 * Base64 encoded SVG data URL for the shimmer effect
 * Used as placeholder for loading images
 */
export const dataUrl = `data:image/svg+xml;base64,${toBase64(
  shimmer(1000, 1000)
)}`;

/**
 * Constructs URL query string with new parameters
 * @param searchParams - Current search parameters
 * @param key - Key to add or update
 * @param value - Value for the key
 */
export const formUrlQuery = ({ searchParams, key, value }: FormUrlQueryParams) => {
  const params = { ...qs.parse(searchParams.toString()), [key]: value };

  return `${window.location.pathname}?${qs.stringify(params, {
    skipNulls: true,
  })}`;
};

/**
 * Removes specified keys from URL query parameters
 * @param searchParams - Current search parameters
 * @param keysToRemove - Array of keys to remove from query
 */
export function removeKeysFromQuery({
  searchParams,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(searchParams);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  // Remove null or undefined values
  Object.keys(currentUrl).forEach(
    (key) => currentUrl[key] == null && delete currentUrl[key]
  );

  return `${window.location.pathname}?${qs.stringify(currentUrl)}`;
}

/**
 * Creates a debounced version of a function
 * Useful for limiting the rate at which a function can fire
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 */
export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout | null;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Type for aspect ratio keys from constants
 */
export type AspectRatioKey = keyof typeof aspectRatioOptions;

/**
 * Calculates image dimensions based on type and aspect ratio
 * @param type - Transformation type
 * @param image - Image object with dimensions
 * @param dimension - Dimension to calculate (width or height)
 */
export const getImageSize = (
  type: string,
  image: any,
  dimension: "width" | "height"
): number => {
  if (type === "fill") {
    return (
      aspectRatioOptions[image.aspectRatio as AspectRatioKey]?.[dimension] ||
      1000
    );
  }
  return image?.[dimension] || 1000;
};

/**
 * Downloads a file from a URL
 * @param url - URL of the file to download
 * @param filename - Name to save the file as
 */
export const download = (url: string, filename: string) => {
  if (!url) {
    throw new Error("Resource URL not provided! You need to provide one");
  }

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobURL;

      if (filename && filename.length)
        a.download = `${filename.replace(" ", "_")}.png`;
      document.body.appendChild(a);
      a.click();
    })
    .catch((error) => console.log({ error }));
};

/**
 * Deep merges two objects recursively
 * Useful for combining configuration objects
 * @param obj1 - First object to merge
 * @param obj2 - Second object to merge
 */
export const deepMergeObjects = (obj1: any, obj2: any) => {
  if(obj2 === null || obj2 === undefined) {
    return obj1;
  }

  let output = { ...obj2 };

  for (let key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (
        obj1[key] &&
        typeof obj1[key] === "object" &&
        obj2[key] &&
        typeof obj2[key] === "object"
      ) {
        output[key] = deepMergeObjects(obj1[key], obj2[key]);
      } else {
        output[key] = obj1[key];
      }
    }
  }

  return output;
};