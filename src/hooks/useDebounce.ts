import { useState, useEffect } from "react";

type DebounceOptions = {
  delay?: number;
  callbackFn?: () => void;
};

function useDebounce<T>(value: T, options: DebounceOptions = {}) {
  const { delay = 500, callbackFn } = options;
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      callbackFn?.();
    }, delay);

    // Cleanup the timeout on value change
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, callbackFn]);

  return debouncedValue;
}

export default useDebounce;
