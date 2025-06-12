import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function ProductList() {
const { t } = useTranslation();

useEffect(() => {
    document.title = t("main");
  }, []);

  return (
    <div className="p-2">
      <div className="block lg:hidden text-center">
        {t("main")}
        <hr className="m-1" />
      </div>
    </div>
  );
}
