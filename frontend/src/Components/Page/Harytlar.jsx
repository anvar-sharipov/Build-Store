import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const Harytlar = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("products");
  }, []);
 

  return (
    <div className="p-2">
      <h1 className="text-center text-2xl">{t("products")}</h1>
      
      <div className="mx-auto w-fit">
        <span>tailwindcss</span>
      </div>
    
    </div>
  );
};

export default Harytlar;
