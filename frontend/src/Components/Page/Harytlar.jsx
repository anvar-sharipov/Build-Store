import { div } from "framer-motion/client";
import React from "react";
import { useState, useEffect } from "react";
import MyModal from "../UI/MyModal";
import MyButton from "../UI/MyButton";

const Harytlar = () => {
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    document.title = "Harytlar";
  }, []);

  // Добавляем обработчик нажатия клавиши Insert
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Insert") {
        setOpenModal((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      <div className="p-2">
        <MyButton variant='Green' onClick={() => setOpenModal(!openModal)} >Haryt goshmak (insert)</MyButton>
      </div>
      Harytlar 
      {openModal && <MyModal onClose={() => setOpenModal(false)}>Harytlar</MyModal>}
    </div>
  );
};

export default Harytlar;
