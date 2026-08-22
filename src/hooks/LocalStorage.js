import { useState, useEffect } from "react";

/**
 * Drop-in replacement for useState that persists to localStorage.
 * Reads the saved value synchronously BEFORE first render (lazy init),
 * so there's never a window where an empty/default value can get
 * written over real saved data. Use this for every feature's state
 * (todos, transactions, cycles, and anything added later) instead of
 * writing a separate load-effect + save-effect each time.
 *
 * Usage:
 *   const [todos, setTodos] = useLocalStorage("todos", []);
 *   const [cycles, setCycles] = useLocalStorage("cycles", []);
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      // Corrupted or unavailable storage - fall back safely
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable - fail silently rather than crash the app
    }
  }, [key, value]);

  return [value, setValue];
}