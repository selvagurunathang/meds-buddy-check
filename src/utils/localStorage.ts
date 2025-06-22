// utils/localStorage.ts

/**
 * Load data from localStorage with a fallback if key is not present or JSON parsing fails.
 * @param key The localStorage key
 * @param fallback Default value if none is found
 * @returns Parsed value from localStorage or fallback
 */
export const loadFromStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch (error) {
    console.warn(`Error parsing localStorage key "${key}":`, error);
    return fallback;
  }
};

/**
 * Save data to localStorage.
 * @param key The localStorage key
 * @param data Data to persist (should be JSON-serializable)
 */
export const saveToStorage = <T>(key: string, data: T): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
};

/**
 * Remove a key from localStorage.
 * @param key The localStorage key
 */
export const removeFromStorage = (key: string): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};
