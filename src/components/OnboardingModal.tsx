import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { countries } from "../data/countries";
import { getHolidaysForCountry } from "../data/holidays";
import { supportedLanguages } from "../i18n";
import { v4 as uuid } from "uuid";
import type { UserEvent } from "../types";

interface OnboardingModalProps {
  onComplete: () => void;
}

function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const { t, i18n } = useTranslation();
  const { updateSettings, setEvents, events } = useApp();

  const detectedLang = navigator.language?.split("-")[0] || "en";
  const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const detectedCountry = guessCountryFromLanguage(detectedLang);

  const [step, setStep] = useState(0);
  const [country, setCountry] = useState(detectedCountry);
  const [language, setLanguage] = useState<string>(
    supportedLanguages.find((l) => l.code === detectedLang)?.code || "en",
  );
  const [timezone, setTimezone] = useState(detectedTimezone);
  const [loadDefaults, setLoadDefaults] = useState(true);

  const steps = ["country", "language", "timezone", "defaults"];

  function handleNext() {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleSkip() {
    // Use detected values
    updateSettings({
      country: detectedCountry,
      language: detectedLang,
      timezone: detectedTimezone,
      onboardingCompleted: true,
    });
    i18n.changeLanguage(
      supportedLanguages.find((l) => l.code === detectedLang) ? detectedLang : "en",
    );
    onComplete();
  }

  function handleFinish() {
    updateSettings({
      country,
      language,
      timezone,
      onboardingCompleted: true,
    });
    i18n.changeLanguage(language);

    if (loadDefaults) {
      const holidays = getHolidaysForCountry(country);
      const today = new Date();
      const newEvents: UserEvent[] = holidays.map((h) => {
        let date: string;
        if (h.month && h.day) {
          date = `${today.getFullYear()}-${String(h.month).padStart(2, "0")}-${String(h.day).padStart(2, "0")}`;
        } else if (h.dates && h.dates.length > 0) {
          // Find the next upcoming date
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

    onComplete();
  }

  const countryHasHolidays = getHolidaysForCountry(country).length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{t("onboarding.welcome")}</h2>
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {t("onboarding.skip")}
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t("onboarding.subtitle")}</p>

        {/* Progress dots */}
        <div className="flex gap-2 justify-center mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i === step ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"}`}
            />
          ))}
        </div>

        {/* Step content */}
        {step === 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">{t("onboarding.country")}</label>
            <p className="text-xs text-gray-500 mb-2">{t("onboarding.countryHint")}</p>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.nativeName} ({c.name})
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 1 && (
          <div>
            <label className="block text-sm font-medium mb-2">{t("onboarding.language")}</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-medium mb-2">{t("onboarding.timezone")}</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              {Intl.supportedValuesOf("timeZone").map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 3 && (
          <div>
            {countryHasHolidays ? (
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={loadDefaults}
                  onChange={(e) => setLoadDefaults(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <span className="text-sm font-medium">{t("onboarding.loadDefaults")}</span>
                  <p className="text-xs text-gray-500 mt-1">{t("onboarding.loadDefaultsHint")}</p>
                </div>
              </label>
            ) : (
              <p className="text-sm text-gray-500">
                No default holidays available for this country.
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
          >
            {t("onboarding.back")}
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {step === steps.length - 1 ? t("onboarding.finish") : t("onboarding.next")}
          </button>
        </div>
      </div>
    </div>
  );
}

function guessCountryFromLanguage(lang: string): string {
  const map: Record<string, string> = {
    en: "US",
    pl: "PL",
    de: "DE",
    fr: "FR",
    es: "ES",
    pt: "BR",
    it: "IT",
    ja: "JP",
    zh: "CN",
    ko: "KR",
    ar: "SA",
    hi: "IN",
    ru: "RU",
    tr: "TR",
    nl: "NL",
  };
  return map[lang] || "US";
}

export default OnboardingModal;
