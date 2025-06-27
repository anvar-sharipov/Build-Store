import { useFormikContext, Field, ErrorMessage } from "formik";
import { myClass } from "../../../../../tailwindClasses";
import { useEffect, useRef, useState } from "react";
import myAxios from "../../../../../axios";
import UnitModal from "../../../../../UI/miniModals/UnitModal";

const BasicTab = ({ options, loadingModal, setOptions }) => {
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

  // Для дебаунса — чтобы не слать запрос на каждый символ name
  const timeoutRef = useRef(null);

  return (
    <div className="space-y-4">
      {/* Наименование — на всю ширину */}
      <div>
        <label className="block text-sm font-medium">Наименование</label>
        <Field
          name="name"
          className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800"
          placeholder="Введите наименование"
          autoComplete="off"
        />
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
            className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800"
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
              className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800"
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
              className="bg-green-600 text-white px-3 rounded text-sm"
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
            className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800"
            placeholder="Автоматически"
            disabled={true}
          />
        </div>
      </div>

      {/* Описание — на всю ширину */}
      <div>
        <label className="block text-sm font-medium">Описание</label>
        <Field
          as="textarea"
          name="description"
          className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800"
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
