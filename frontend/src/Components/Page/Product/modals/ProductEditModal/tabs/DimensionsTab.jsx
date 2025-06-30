import { useFormikContext, Field, ErrorMessage } from "formik";
import { myClass } from "../../../../../tailwindClasses";

const DimensionsTab = ({ t }) => {
  const { values, errors, touched } = useFormikContext();

  const labelClass = "block text-sm font-medium";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Вес */}
        <div>
          <label className={labelClass}>{t("weightLabel")}</label>
          <Field type="number" name="weight" className={myClass.input2} />
          <ErrorMessage
            name="weight"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* Объём */}
        <div>
          <label className={labelClass}>{t("volumeLabel")}</label>
          <Field type="number" name="volume" className={myClass.input2} />
          <ErrorMessage
            name="volume"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* Длина */}
        <div>
          <label className={labelClass}>{t("lengthLabel")}</label>
          <Field type="number" name="length" className={myClass.input2} />
          <ErrorMessage
            name="length"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* Ширина */}
        <div>
          <label className={labelClass}>{t("widthLabel")}</label>
          <Field type="number" name="width" className={myClass.input2} />
          <ErrorMessage
            name="width"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* Высота */}
        <div>
          <label className={labelClass}>{t("heightLabel")}</label>
          <Field type="number" name="height" className={myClass.input2} />
          <ErrorMessage
            name="height"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default DimensionsTab;
