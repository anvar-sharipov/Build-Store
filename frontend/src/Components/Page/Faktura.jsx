import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function ProductList() {
const { t } = useTranslation();

useEffect(() => {
    document.title = t("main");
  }, []);

  return (
    <div className="p-2">
      <h1 className="text-center text-2xl">{t("main")}</h1>
    </div>
  );
}
