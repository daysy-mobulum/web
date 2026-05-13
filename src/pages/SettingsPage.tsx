import { useTranslation } from "react-i18next";

function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("settings.title")}</h1>
    </div>
  );
}

export default SettingsPage;
