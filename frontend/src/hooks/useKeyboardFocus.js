import { useEffect } from "react";

export default function useKeyboardFocus(addRef, searchRef) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Insert") {
        e.preventDefault();
        addRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [addRef]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);
}
