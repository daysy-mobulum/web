import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { countries } from "../data/countries";
import { supportedLanguages } from "../i18n";
import { exportData, importData } from "../utils/storage";
import { v4 as uuid } from "uuid";
import type { AppearanceMode, Tag } from "../types";
import { applyTheme } from "../utils/theme";
import CountryChangeModal from "../components/CountryChangeModal";

const TAG_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280",
];

function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { settings, tags, updateSettings, addTag, deleteTag, clearAllData, importAppData } = useApp();
  const [newTagName, setNewTagName] = useState("");
  const [importMsg, setImportMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCountryChange, setShowCountryChange] = useState(false);
  const [pendingCountry, setPendingCountry] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleAppearanceChange(mode: AppearanceMode) {
    updateSettings({ appearance: mode });
    applyTheme(mode);
  }

  function handleLanguageChange(lang: string) {
    updateSettings({ language: lang });
    i18n.changeLanguage(lang);
  }

  function handleCountryChange(code: string) {
    if (code !== settings.country) {
      setPendingCountry(code);
      setShowCountryChange(true);
    }
  }

  function handleCountryChangeConfirm() {
    updateSettings({ country: pendingCountry });
    setShowCountryChange(false);
  }

  function handleTimezoneChange(tz: string) {
    updateSettings({ timezone: tz });
  }

  function handleAddTag() {
    if (!newTagName.trim()) return;
    const tag: Tag = {
      id: uuid(),
      name: newTagName.trim(),
      color: TAG_COLORS[tags.length % TAG_COLORS.length],
    };
    addTag(tag);
    setNewTagName("");
  }

  function handleExport() {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "daysy-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importData(reader.result as string);
      if (result) {
        importAppData(result);
        setImportMsg({ type: "success", text: t("settings.importSuccess") });
        i18n.changeLanguage(result.settings.language);
      } else {
        setImportMsg({ type: "error", text: t("settings.importError") });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleDeleteAll() {
    clearAllData();
    setShowDeleteConfirm(false);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{t("settings.title")}</h1>

      {/* Appearance */}
      <section>
        <h2 className="text-lg font-semibold mb-3">{t("settings.appearance")}</h2>
        <div className="flex gap-2">
          {(["light", "dark", "system"] as AppearanceMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleAppearanceChange(mode)}
              className={`px-4 py-2 text-sm rounded-lg border ${
                settings.appearance === mode
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              {t(`settings.appearanceOptions.${mode}`)}
            </button>
          ))}
        </div>
      </section>

      {/* Locale */}
      <section>
        <h2 className="text-lg font-semibold mb-3">{t("settings.locale")}</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">{t("settings.country")}</label>
            <select
              value={settings.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.nativeName} ({c.name})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("settings.language")}</label>
            <select
              value={settings.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("settings.timezone")}</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleTimezoneChange(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              {Intl.supportedValuesOf("timeZone").map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Tags */}
      <section>
        <h2 className="text-lg font-semibold mb-3">{t("settings.tags")}</h2>
        <div className="space-y-2 mb-3">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center justify-between p-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color }} />
                <span className="text-sm">{tag.name}</span>
              </div>
              <button
                onClick={() => deleteTag(tag.id)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                {t("settings.deleteTag")}
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder={t("settings.addTag")}
            className="flex-1 p-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
          />
          <button
            onClick={handleAddTag}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {t("settings.addTag")}
          </button>
        </div>
      </section>

      {/* Data Management */}
      <section>
        <h2 className="text-lg font-semibold mb-3">{t("settings.dataManagement")}</h2>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm border rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t("settings.exportData")}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm border rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t("settings.importData")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
        {importMsg && (
          <p className={`mt-2 text-sm ${importMsg.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {importMsg.text}
          </p>
        )}
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-red-600">{t("settings.dangerZone")}</h2>
        {showDeleteConfirm ? (
          <div className="p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-400 mb-3">{t("settings.deleteAllConfirm")}</p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {t("settings.deleteAllButton")}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm border rounded-lg border-gray-300"
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            {t("settings.deleteAll")}
          </button>
        )}
      </section>

      {showCountryChange && (
        <CountryChangeModal
          newCountry={pendingCountry}
          onConfirm={handleCountryChangeConfirm}
          onClose={() => setShowCountryChange(false)}
        />
      )}
    </div>
  );
}

export default SettingsPage;
