import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.tsx";

// Apply theme before render to avoid flash
const stored = localStorage.getItem("daysy-data");
if (stored) {
  try {
    const data = JSON.parse(stored);
    const mode = data?.settings?.appearance;
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else if (mode === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      }
    }
  } catch {
    // ignore
  }
} else {
  // Default to system
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark");
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
