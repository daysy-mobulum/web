import { useTranslation } from "react-i18next";

function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("home.title")}</h1>
      <p className="text-gray-500 dark:text-gray-400">{t("home.noEvents")}</p>
    </div>
  );
}

export default HomePage;
