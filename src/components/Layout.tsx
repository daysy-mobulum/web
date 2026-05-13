import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Layout() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="6" fill="currentColor" />
              <path d="M7 9h14M7 14h14M7 19h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="21" cy="19" r="3" fill="#fbbf24" />
            </svg>
            Daysy
          </NavLink>
          <nav className="flex gap-4">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`
              }
            >
              {t("nav.events")}
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`
              }
            >
              {t("nav.settings")}
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`
              }
            >
              {t("nav.about")}
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2026 Daysy. Open Source.{" "}
        <a
          href="https://github.com/daysy-mobulum/web"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}

export default Layout;
