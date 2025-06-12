import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const Harytlar = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("products");
  }, []);

  return (
    <div className="p-2">
      <div className="block lg:hidden text-center">
        {t("products")}
        <hr className="m-1" />
      </div>
    </div>
  );
};

export default Harytlar;
