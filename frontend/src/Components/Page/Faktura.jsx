import React, { useEffect, useState } from "react";
import myAxios from "../axios";
import axios from "axios";
import axiosInstance from "../axiosInstance";
import MyButton from "../UI/MyButton";
import MyModal from "../UI/MyModal";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  // const fetchProducts = (accessToken) => {
  //   return axios.get("http://localhost:8000/api/products/", {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });
  // };

  useEffect(() => {
    myAxios
      .get("products/")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Ошибка загрузки:", err));
  }, []);

  useEffect(() => {
    document.title = "Faktura";
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
        <MyButton variant="Pink" onClick={() => setOpenModal(!openModal)}>
          Hereket (insert)
        </MyButton>
      </div>

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} — {p.quantity} sany -- kategoriya {p.category} — bahasy{" "}
            {p.purchase_price} ₽
          </li>
        ))}
      </ul>
      {openModal && <MyModal onClose={() => setOpenModal(false)}>Faktura</MyModal>}
    </div>
  );
}
