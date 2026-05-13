import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Layout from "../components/Layout";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SettingsPage from "../pages/SettingsPage";
import AboutPage from "../pages/AboutPage";

vi.mock("../context/AppContext", () => ({
  useApp: () => ({
    settings: { onboardingCompleted: true, country: "US", language: "en", timezone: "UTC", appearance: "system" },
    events: [],
    tags: [],
    updateSettings: vi.fn(),
    setEvents: vi.fn(),
    addEvent: vi.fn(),
    updateEvent: vi.fn(),
    deleteEvent: vi.fn(),
    setTags: vi.fn(),
    addTag: vi.fn(),
    deleteTag: vi.fn(),
    importAppData: vi.fn(),
    clearAllData: vi.fn(),
    data: { settings: {}, events: [], tags: [] },
  }),
  AppProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "nav.events": "Events",
        "nav.settings": "Settings",
        "nav.about": "About",
        "home.title": "My Events",
        "home.noEvents": "No events yet.",
        "settings.title": "Settings",
        "about.title": "About Daysy",
      };
      return map[key] || key;
    },
    i18n: { language: "en", changeLanguage: vi.fn() },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

function renderWithRouter(initialRoute = "/") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("Routing", () => {
  it("renders home page by default", () => {
    renderWithRouter("/");
    expect(screen.getByText("My Events")).toBeInTheDocument();
  });

  it("renders settings page", () => {
    renderWithRouter("/settings");
    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
  });

  it("renders about page", () => {
    renderWithRouter("/about");
    expect(screen.getByRole("heading", { name: "About Daysy" })).toBeInTheDocument();
  });

  it("renders header with Daysy logo", () => {
    renderWithRouter("/");
    expect(screen.getByText("Daysy")).toBeInTheDocument();
  });

  it("renders footer with GitHub link", () => {
    renderWithRouter("/");
    expect(screen.getByText("GitHub")).toHaveAttribute("href", "https://github.com/daysy-mobulum/web");
  });

  it("renders navigation links", () => {
    renderWithRouter("/");
    expect(screen.getByRole("link", { name: "Events" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });
});
