import { useState } from "react";

const useLocalStorage = (
  key: string,
  initialValue: any
): [storedValue: any, setValue: (value: any) => void] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // 서버사이드에서 실행되지 않도록 처리
      if (typeof document !== "undefined") {
        console.error(error);
      }

      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore =
        typeof value === "function" ? value(storedValue) : value;

      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
