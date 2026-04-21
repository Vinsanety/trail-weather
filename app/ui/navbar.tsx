"use client";
import { useState, useEffect } from "react";
import { CloudSun, Palette } from "lucide-react";

const THEMES = [
  { value: "trail_light", label: "Trail Light" },
  { value: "trail_dark", label: "Trail Dark" },
  { value: "alpine_accent", label: "Alpine Accent" },
];

export default function Navbar() {
  const [theme, setTheme] = useState("trail_light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const resolvedTheme = savedTheme || "trail_light";
    setTheme(resolvedTheme);
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="sticky top-0 z-20 border-b border-base-content/10 bg-base-100">
      <div className="navbar mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="flex-1">
          <a href="/" className="inline-flex items-center gap-2 text-xl font-semibold tracking-tight">
            <CloudSun className="h-5 w-5 text-primary" />
            Trail Weather
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs font-semibold uppercase tracking-wide text-base-content/65 md:inline">
            Theme
          </span>
          <label className="tw-chip-min gap-2">
            <Palette className="h-4 w-4 text-base-content/70" />
            <select
              className="bg-transparent text-sm outline-none"
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              aria-label="Select theme"
            >
              {THEMES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
