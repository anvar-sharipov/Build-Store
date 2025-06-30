import { useFormikContext, Field, ErrorMessage } from "formik";
import { myClass } from "../../../../../tailwindClasses";

const PricesTab = ({ t }) => {
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
          <label className="block text-sm font-medium">{t("purchasePrice")}</label>
          <Field
            type="number"
            name="purchase_price"
            className={myClass.input2}
            placeholder={t("enterPrice")}
          />
          <ErrorMessage
            name="purchase_price"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* Розничная цена */}
        <div className="flex-1">
          <label className="block text-sm font-medium">{t("retailPrice")}</label>
          <Field
            type="number"
            name="retail_price"
            className={myClass.input2}
            placeholder={t("enterPrice")}
          />
          <ErrorMessage
            name="retail_price"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* Оптовая цена */}
        <div className="flex-1">
          <label className="block text-sm font-medium">{t("wholesalePrice")}</label>
          <Field
            type="number"
            name="wholesale_price"
            className={myClass.input2}
            placeholder={t("enterPrice")}
          />
          <ErrorMessage
            name="wholesale_price"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* Firma цена */}
        <div className="flex-1">
          <label className="block text-sm font-medium">{t("firmaPrice")}</label>
          <Field
            type="number"
            name="firma_price"
            className={myClass.input2}
            placeholder={t("enterPrice")}
          />
        </div>
      </div>
    </div>
  );
};

export default PricesTab;
