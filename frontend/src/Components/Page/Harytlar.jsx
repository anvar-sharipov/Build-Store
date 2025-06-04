import React, { useEffect, useState } from "react";
import MyModal from "../UI/MyModal";
import MyButton from "../UI/MyButton";
import { useTranslation } from "react-i18next";

const Harytlar = () => {
  const [openModal, setOpenModal] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = "Harytlar";
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Insert") {
        setOpenModal((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div>
      <div className="p-2 space-x-2">
        <MyButton variant="green" onClick={() => setOpenModal(!openModal)}>
          {t("addProduct")} (insert)
        </MyButton>
  
      </div>


      {openModal && (
        <MyModal onClose={() => setOpenModal(false)}>{t("towary")}</MyModal>
      )}
    </div>
  );
};

export default Harytlar;
