import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { countries } from "../data/countries";
import { getHolidaysForCountry } from "../data/holidays";
import { supportedLanguages } from "../i18n";
import { v4 as uuid } from "uuid";
import type { UserEvent } from "../types";

interface CountryChangeModalProps {
  newCountry: string;
  onConfirm: () => void;
  onClose: () => void;
}

function CountryChangeModal({ newCountry, onConfirm, onClose }: CountryChangeModalProps) {
  const { t, i18n } = useTranslation();
  const { settings, events, setEvents, updateSettings } = useApp();
  const [loadDefaults, setLoadDefaults] = useState(false);
  const [changeLanguage, setChangeLanguage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(settings.language);

  const countryData = countries.find((c) => c.code === newCountry);
  const holidays = getHolidaysForCountry(newCountry);
  const hasHolidays = holidays.length > 0;

  // Suggest first language of the country if it's supported
  const suggestedLang = countryData?.languages.find((l) =>
    supportedLanguages.some((sl) => sl.code === l),
  );

  function handleConfirm() {
    if (loadDefaults && hasHolidays) {
      const today = new Date();
      const newEvents: UserEvent[] = holidays.map((h) => {
        let date: string;
        if (h.month && h.day) {
          date = `${today.getFullYear()}-${String(h.month).padStart(2, "0")}-${String(h.day).padStart(2, "0")}`;
        } else if (h.dates && h.dates.length > 0) {
          const upcoming = h.dates.find((d) => new Date(d) >= today);
          date = upcoming || h.dates[h.dates.length - 1];
        } else {
          date = `${today.getFullYear()}-01-01`;
        }
        return {
          id: uuid(),
          name: h.name,
          date,
          recurrence: h.month && h.day ? "yearly" : "none",
          tags: [],
        };
      });
      setEvents([...events, ...newEvents]);
    }

    if (changeLanguage && selectedLanguage !== settings.language) {
      updateSettings({ language: selectedLanguage });
      i18n.changeLanguage(selectedLanguage);
    }

    onConfirm();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-bold mb-4">{t("countryChange.title")}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t("countryChange.message")}</p>

        {hasHolidays && (
          <label className="flex items-start gap-3 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={loadDefaults}
              onChange={(e) => setLoadDefaults(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm">{t("countryChange.loadDefaults")}</span>
          </label>
        )}

        <div className="mb-4">
          <label className="flex items-start gap-3 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={changeLanguage}
              onChange={(e) => setChangeLanguage(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm">{t("countryChange.changeLanguage")}</span>
          </label>
          {changeLanguage && (
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 mt-1"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName} ({l.name}) {l.code === suggestedLang ? "*" : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm border rounded-lg border-gray-300 dark:border-gray-600"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {t("countryChange.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CountryChangeModal;
