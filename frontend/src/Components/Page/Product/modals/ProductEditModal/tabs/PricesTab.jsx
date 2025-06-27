import { useFormikContext, Field, ErrorMessage } from "formik";

const PricesTab = () => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    initialValues,
  } = useFormikContext();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Закупочная цена */}
        <div className="flex-1">
          <label className="block text-sm font-medium">Закупочная цена</label>
          <Field
            type="number"
            name="purchase_price"
            className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800"
            placeholder="Введите цену"
          />
          <ErrorMessage
            name="purchase_price"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* Розничная цена */}
        <div className="flex-1">
          <label className="block text-sm font-medium">Розничная цена</label>
          <Field
            type="number"
            name="retail_price"
            className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800"
            placeholder="Введите цену"
          />
          <ErrorMessage
            name="retail_price"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* Оптовая цена */}
        <div className="flex-1">
          <label className="block text-sm font-medium">Оптовая цена</label>
          <Field
            type="number"
            name="wholesale_price"
            className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800"
            placeholder="Введите цену"
          />
          <ErrorMessage
            name="wholesale_price"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default PricesTab;
