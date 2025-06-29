import { useFormikContext, Field, ErrorMessage } from "formik";
import { myClass } from "../../../../../tailwindClasses";
import { useEffect, useRef, useState } from "react";
import myAxios from "../../../../../axios";
import UnitModal from "../../../../../UI/miniModals/UnitModal";
import ProductUnitsList from "./sections/ProductUnitsList";
import ProductFreeItemsList from "./sections/ProductFreeItemsList";

const BasicTab = ({ options, loadingModal, setOptions, productId }) => {
  const [showUnitModal, setShowUnitModal] = useState(false);

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    initialValues,
    // validateForm ,
  } = useFormikContext();
  // console.log("options", options);

  const handleUnitAdded = (newUnit) => {
    // добавляем в список options и сразу выбираем
    setOptions((prev) => ({
      ...prev,
      base_units: [
        ...prev.base_units,
        {
          value: String(newUnit.id),
          label: newUnit.name,
        },
      ],
    }));
    setFieldValue("base_unit", String(newUnit.id));
  };

  //  const handleAdditionalUnitAdded = (newUnit) => {
  //   // добавляем в список options и сразу выбираем
  //   setOptions((prev) => ({
  //     ...prev,
  //     base_units: [
  //       ...prev.base_units,
  //       {
  //         value: String(newUnit.id),
  //         label: newUnit.name,
  //       },
  //     ],
  //   }));
  //   setFieldValue("base_unit", String(newUnit.id));
  // };

  // Для дебаунса — чтобы не слать запрос на каждый символ name
  const timeoutRef = useRef(null);

  return (
    <div className="space-y-4">
      {/* Наименование — на всю ширину */}
      <div className="mt-5">
        <div className="flex gap-2 items-center">
          <label className="block text-sm font-medium">Наименование</label>
          <Field
            name="name"
            className={myClass.input2}
            placeholder="Введите наименование"
            autoComplete="off"
          />
        </div>

        <ErrorMessage
          name="name"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      {/* Компактный блок: Кол-во, Баз.ед., SKU */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Количество */}
        <div className="flex-1">
          <label className="block text-sm font-medium">Количество</label>
          <Field
            type="number"
            name="quantity"
            className={myClass.input2}
            placeholder="Введите количество"
          />
          <ErrorMessage
            name="quantity"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* Базовая единица + кнопка */}
        <div className="flex-1">
          <label className="block text-sm font-medium">Базовая единица</label>
          <div className="flex gap-2">
            <Field
              as="select"
              name="base_unit"
              className={myClass.input2}
            >
              <option value="">Выберите единицу</option>
              {options.base_units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </Field>
            <button
              type="button"
              className={myClass.buttonRounded}
              onClick={() => setShowUnitModal(true)}
            >
              +
            </button>
          </div>
          <ErrorMessage
            name="base_unit"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* SKU */}
        <div className="flex-1">
          <label className="block text-sm font-medium">Артикул (SKU)</label>
          <Field
            name="sku"
            placeholder="Автоматически"
            disabled={true}
          />
        </div>

        {/* Активен */}
        <div className="flex items-center gap-2">
          <Field
            type="checkbox"
            name="is_active"
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <label className="text-sm font-medium">Активен</label>
        </div>
      </div>

      {/* Описание — на всю ширину */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Описание
        </label>
        <Field
          as="textarea"
          name="description"
          rows={4}
          placeholder="Введите описание..."
          className={myClass.input2}
        />
      </div>

      <div className="flex flex-col gap-4 sm:gap-6 sm:flex-col lg:flex-row justify-between">
        <ProductFreeItemsList productOptions={options.products} />
        <ProductUnitsList unitOptions={options.base_units} errors={errors} />
      </div>

      {/* Модалка */}
      {showUnitModal && (
        <UnitModal
          onClose={() => setShowUnitModal(false)}
          onSuccess={handleUnitAdded}
        />
      )}
    </div>
  );
};

export default BasicTab;
