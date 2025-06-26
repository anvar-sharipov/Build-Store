import MyModal from "../../../../UI/MyModal";
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // Для валидации (по желанию)
import BasicTab from "./tabs/BasicTab";
import PricesTab from "./tabs/PricesTab";
import DimensionsTab from "./tabs/DimensionsTab";
import CategoriesTab from "./tabs/categoriesTab";
import HeaderForTabs from "./tabs/HeaderForTabs";

import {
  X,
  Package,
  Tag,
  DollarSign,
  Ruler,
  Weight,
  Layers,
} from "lucide-react";


const ProductEditModal2 = ({ productEditModal2, setProductEditModal2 }) => {
  const product = productEditModal2.data;
  const [activeTab, setActiveTab] = useState("basic");

  const tabs = [
    { id: "basic", label: "Основные", icon: Package },
    { id: "prices", label: "Цены", icon: DollarSign },
    { id: "dimensions", label: "Размеры", icon: Ruler },
    { id: "categories", label: "Категории", icon: Tag },
  ];

  // 1️⃣ Начальные значения формы
  const initialValues = {
    name: product.name || "",
    // description: product.description || "",
    // sku: product.sku || "",
    // qr_code: product.qr_code || "",
    quantity: product.quantity || 0,
    // purchase_price: product.purchase_price || 0,
    // retail_price: product.retail_price || 0,
    // wholesale_price: product.wholesale_price || 0,
    // discount_price: product.discount_price || "",
    // weight: product.weight || "",
    // volume: product.volume || "",
    // length: product.length || "",
    // width: product.width || "",
    // height: product.height || "",
    // is_active: product.is_active ?? true,
    // base_unit: product.base_unit || null,
    // category: product.category || null,
    // brand: product.brand || null,
    // model: product.model || null,
    // tags: product.tags || [],
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Наименование обязательно")
      .min(3, "Минимум 3 символа"),

    quantity: Yup.number()
      .typeError("Введите число")
      .required("Количество обязательно")
      .moreThan(0, "Должно быть больше нуля"),
  });

  // 2️⃣ Обработка отправки формы
  const onSubmit = (values) => {
    console.log("Сохранённые данные:", values);
    setProductEditModal2({ open: false, data: null, index: null });
  };

  return (
    <MyModal
      onClose={() => {
        setProductEditModal2({ open: false, data: null, index: null });
      }}
    >
      <HeaderForTabs 
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      />


      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ touched, errors }) => (
          <Form>
            {activeTab === "basic" ? (
              <BasicTab />
            ) : activeTab === "prices" ? (
              <PricesTab />
            ) : activeTab === "dimensions" ? (
              <DimensionsTab />
            ) : activeTab === "categories" ? (
              <CategoriesTab />
            ) : null}
            <div className="mt-4 text-right">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Сохранить
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ values, errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Наименование</label>
              <Field
                name="name"
                className="border border-gray-300 p-2 rounded w-full"
                placeholder="Введите наименование"
                autocomplate="off"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Количество</label>
              <Field
                type="number"
                name="quantity"
                className={`border p-2 rounded w-full ${
                  touched.quantity && errors.quantity
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Введите количество"
              />
              <ErrorMessage
                name="quantity"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Сохранить
            </button>
          </Form>
        )}
      </Formik> */}
    </MyModal>
  );
};

export default ProductEditModal2;
