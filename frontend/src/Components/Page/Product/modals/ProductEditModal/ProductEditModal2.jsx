import MyModal from "../../../../UI/MyModal";
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // Для валидации (по желанию)
import BasicTab from "./tabs/BasicTab";
import PricesTab from "./tabs/PricesTab";
import DimensionsTab from "./tabs/DimensionsTab";
import CategoriesTab from "./tabs/CategoriesTab";
import HeaderForTabs from "./tabs/HeaderForTabs";
import { fetchUnits } from "../../../../fetchs/optionsFetchers";
import myAxios from "../../../../axios";
import { CiNoWaitingSign } from "react-icons/ci";

import {
  X,
  Package,
  Tag,
  DollarSign,
  Ruler,
  Weight,
  Layers,
  Image,
} from "lucide-react";
import MyLoading from "../../../../UI/MyLoading";
import MyButton from "../../../../UI/MyButton";
import { myClass } from "../../../../tailwindClasses";
import ImagesTab from "./tabs/ImagesTab";

const ProductEditModal2 = ({
  setProducts,
  productEditModal2,
  setProductEditModal2,
  options,
  t,
  setOptions,
}) => {
  const [product, setProduct] = useState(productEditModal2.data);
  // const product = productEditModal2.data;
  console.log("product", product);

  const [activeTab, setActiveTab] = useState("basic");
  const [loadingModal, setLoadingModal] = useState(false);

  const tabs = [
    { id: "basic", label: "Основные", icon: Package },
    { id: "prices", label: "Цены", icon: DollarSign },
    { id: "dimensions", label: "Размеры", icon: Ruler },
    { id: "categories", label: "Категории", icon: Tag },
    { id: "images", label: "Фото, QR", icon: Image },
  ];

  // 1️⃣ Начальные значения формы
  const initialValues = {
    id: product.id,
    name: product.name || "",
    description: product.description || "",
    sku: product.sku || "",
    qr_code: product.qr_code || "",
    quantity: product.quantity || 0,
    purchase_price: product.purchase_price || 0,
    retail_price: product.retail_price || 0,
    wholesale_price: product.wholesale_price || 0,
    // discount_price: product.discount_price || "",
    weight: product.weight || "",
    volume: product.volume || "",
    length: product.length || "",
    width: product.width || "",
    height: product.height || "",
    is_active: product.is_active ?? true,
    base_unit: product.base_unit_obj ? String(product.base_unit_obj.id) : "",
    category: product.category_name_obj
      ? String(product.category_name_obj.id)
      : "",
    brand: product.brand_obj ? String(product.brand_obj.id) : "",
    model: product.model_obj ? String(product.model_obj.id) : "",
    tags: product.tags_obj ? product.tags_obj.map((tag) => String(tag.id)) : [],
    units: product.units || [],
    free_items: product.free_items || [],
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Наименование обязательно")
      .test(
        "check-unique-name",
        "Такое имя уже существует",
        async function (value) {
          if (!value || value === initialValues.name) return true;

          try {
            const res = await myAxios(
              `/check-name-unique/?name=${encodeURIComponent(value)}`
            );
            return !res.data.exists;
          } catch (e) {
            console.log("errorr in check-name-unique", e);
            return true; // пропускаем ошибку сети
          }
        }
      ),
    // .min(3, "Минимум 3 символа"),
    quantity: Yup.number()
      .typeError("Введите число")
      .min(0, "Количество не может быть отрицательным")
      .notRequired(),
    // .required("Количество обязательно"),
    // .moreThan(0, "Должно быть больше нуля"),
    base_unit: Yup.number()
      .required("Выберите единицу")
      .typeError("Неверное значение"),
    category: Yup.number()
      .required("Выберите категорию")
      .typeError("Неверное значение"),
    purchase_price: Yup.number()
      .typeError("Введите цену")
      .min(0, "Цена не может быть отрицательным")
      .notRequired(),
    retail_price: Yup.number()
      .typeError("Введите цену")
      .min(0, "Цена не может быть отрицательным")
      .notRequired(),
    wholesale_price: Yup.number()
      .typeError("Введите цену")
      .min(0, "Цена не может быть отрицательным")
      .notRequired(),
    weight: Yup.number().min(0, "Не может быть отрицательным").notRequired(),
    volume: Yup.number().min(0, "Не может быть отрицательным").notRequired(),
    length: Yup.number().min(0, "Не может быть отрицательным").notRequired(),
    width: Yup.number().min(0, "Не может быть отрицательным").notRequired(),
    height: Yup.number().min(0, "Не может быть отрицательным").notRequired(),
  });

  // 2️⃣ Обработка отправки формы
  const onSubmit = async (values, { setSubmitting }) => {
    // console.log("Сохранённые данные:", values);
    setLoadingModal(true);
    try {
      const res = await myAxios.put(`/products/${values.id}/`, values);
      const updatedProduct = res.data;
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        )
      );
    } catch (error) {
      console.error("Ошибка при обновлении продукта:", error);
    } finally {
      setLoadingModal(false);
      setProductEditModal2({ open: false, data: null, index: null });
    }
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
        {({ touched, errors, isValid, isSubmitting }) => (
          <Form>
            <div className="flex flex-col max-h-[80vh]">
              {/* Контент таба с прокруткой */}
              <div className="flex-1 overflow-auto pr-1">
                {activeTab === "basic" ? (
                  <BasicTab
                    options={options}
                    loadingModal={loadingModal}
                    setOptions={setOptions}
                    productId={product.id}
                  />
                ) : activeTab === "prices" ? (
                  <PricesTab options={options} setOptions={setOptions} />
                ) : activeTab === "dimensions" ? (
                  <DimensionsTab options={options} setOptions={setOptions} />
                ) : activeTab === "categories" ? (
                  <CategoriesTab options={options} setOptions={setOptions} />
                ) : activeTab === "images" ? (
                  <ImagesTab
                    options={options}
                    setOptions={setOptions}
                    product={product}
                    setProduct={setProduct}
                  />
                ) : null}
              </div>

              {/* Кнопка внизу */}
              <div className="mt-4 pt-2 border-t border-gray-300 text-right bg-white dark:bg-gray-900 sticky bottom-0">
                <button
                  type="submit"
                  className={myClass.button}
                  disabled={!isValid || isSubmitting || loadingModal}
                >
                  {loadingModal ? (
                    <span className="flex items-center gap-2">
                      <CiNoWaitingSign className="animate-spin" />
                      {t("saving")}
                    </span>
                  ) : (
                    t("edit")
                  )}
                </button>

                {errors.name && touched.name && (
                  <div className="text-red-600 text-sm mt-2">
                    ⚠️ Невозможно сохранить, пока есть ошибка в поле
                    "Наименование"
                  </div>
                )}
              </div>
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
