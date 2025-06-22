// hooks/useLocalStorageList.ts
import { useEffect, useState } from "react";
import { loadFromStorage, saveToStorage } from "@/utils/localStorage";

export function useLocalStorageList<T extends { id: string }>(
  key: string,
  initial: T[] = []
) {
  const [items, setItems] = useState<T[]>(() => loadFromStorage<T[]>(key, initial));

  // Sync localStorage when items change
  useEffect(() => {
    saveToStorage<T[]>(key, items);
  }, [key, items]);

  const addItem = (item: T) => {
    setItems(prev => (prev.find(i => i.id === item.id) ? prev : [...prev, item]));
  };

  const updateItem = (id: string, updatedFields: Partial<T>) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    clearAll,
    setItems, // for full control
  };
}
