"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setIsDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Alternar entre modo escuro e claro
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        if (!document.body.classList.contains("login-page")) {
          document.body.classList.add("dark");
          document.body.classList.remove("light");
        }
      } else {
        document.body.classList.add("light");
        document.body.classList.remove("dark");
      }
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  // Carregar a preferência do tema do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      if (!document.body.classList.contains("login-page")) {
        document.body.classList.add("dark");
        document.body.classList.remove("light");
      }
    } else {
      setIsDarkMode(false);
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};