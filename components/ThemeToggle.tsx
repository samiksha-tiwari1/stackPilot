"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ThemeToggle() {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateIcon = () => {
      const isDark = document.documentElement.classList.contains("dark");
      if (btnRef.current) {
        btnRef.current.dataset.theme = isDark ? "dark" : "light";
      }
    };

    updateIcon();
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    if (btnRef.current) {
      btnRef.current.dataset.theme = isDark ? "dark" : "light";
    }
  };

  return (
    <button
      ref={btnRef}
      onClick={toggleTheme}
      data-theme="light"
      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-sidebar-accent transition-colors duration-200"
      aria-label="Toggle theme"
    >
      <Sun className="w-4 h-4 text-sidebar-foreground hidden data-[theme=dark]:block" />
      <Moon className="w-4 h-4 text-sidebar-foreground block data-[theme=dark]:hidden" />
    </button>
  );
}