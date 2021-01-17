import { useState, useEffect } from "react";

const useLocalStorage = (key, initialVal) => {
  const [state, setState] = useState(
    () => JSON.parse(localStorage.getItem(key)) || initialVal
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

export default useLocalStorage;
