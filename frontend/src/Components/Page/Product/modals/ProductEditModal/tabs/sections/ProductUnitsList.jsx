import { useFormikContext, Field, ErrorMessage } from "formik";

const ProductUnitsList = ({ unitOptions, errors }) => {
  const { values, setFieldValue } = useFormikContext();

  const handleAddUnit = () => {
    const newUnit = {
      unit: "", // ID выбранной единицы
      conversion_factor: "",
      is_default_for_sale: false,
    };
    setFieldValue("units", [...values.units, newUnit]);
  };

  const handleRemoveUnit = (index) => {
    const updated = [...values.units];
    updated.splice(index, 1);
    setFieldValue("units", updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-4">
        <label className="text-sm font-medium">Дополнительные единицы</label>
        <button
          type="button"
          onClick={handleAddUnit}
          className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
        >
          + Добавить
        </button>
      </div>

      {values.units.length === 0 && (
        <div className="text-sm text-gray-500">Нет дополнительных единиц.</div>
      )}

      {values.units.map((unit, index) => (
        <div className="flex flex-col" key={index}>
          <div
            key={index}
            className="flex gap-2 items-center border p-2 rounded bg-gray-50 dark:bg-gray-900"
          >
            {/* Выбор единицы */}
            <Field
              as="select"
              name={`units[${index}].unit`}
              className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 
             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
             placeholder-gray-400 dark:placeholder-gray-500 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
             transition-all duration-150"
            >
              <option value="">Выберите</option>
              {unitOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Field>

            {/* Коэффициент */}
            <Field
              type="number"
              step="0.0001"
              name={`units[${index}].conversion_factor`}
              className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 
             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
             placeholder-gray-400 dark:placeholder-gray-500 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
             transition-all duration-150"
              placeholder="Коэфф."
            />

            {/* Default checkbox */}
            <div className="flex items-center gap-1">
              <Field
                type="checkbox"
                name={`units[${index}].is_default_for_sale`}
                className="form-checkbox h-4 w-4"
              />
              <label className="text-xs">По умолч.</label>
            </div>

            {/* Удаление */}
            <button
              type="button"
              onClick={() => handleRemoveUnit(index)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-5">
            {errors.units &&
              errors.units[index] &&
              errors.units[index].unit && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.units[index].unit}
                </span>
              )}

            {errors.units &&
              errors.units[index] &&
              errors.units[index].conversion_factor && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.units[index].conversion_factor}
                </span>
              )}

            {/* <ErrorMessage
              name={`units[${index}].unit`}
              component="div"
              className="text-red-500 text-xs mt-1"
            />
            <ErrorMessage
              name={`units[${index}].conversion_factor`}
              component="div"
              className="text-red-500 text-xs mt-1"
            /> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductUnitsList;
