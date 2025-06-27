import { useFormikContext, Field, ErrorMessage } from "formik";

const DimensionsTab = () => {
  const { values, errors, touched } = useFormikContext();

  const inputClass =
    "border border-gray-300 p-2 rounded w-full dark:bg-gray-800";

  const labelClass = "block text-sm font-medium";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Вес */}
        <div>
          <label className={labelClass}>Вес (кг)</label>
          <Field type="number" name="weight" className={inputClass} />
          <ErrorMessage
            name="weight"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* Объём */}
        <div>
          <label className={labelClass}>Объём (м³)</label>
          <Field type="number" name="volume" className={inputClass} />
          <ErrorMessage
            name="volume"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* Длина */}
        <div>
          <label className={labelClass}>Длина (см)</label>
          <Field type="number" name="length" className={inputClass} />
          <ErrorMessage
            name="length"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* Ширина */}
        <div>
          <label className={labelClass}>Ширина (см)</label>
          <Field type="number" name="width" className={inputClass} />
          <ErrorMessage
            name="width"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* Высота */}
        <div>
          <label className={labelClass}>Высота (см)</label>
          <Field type="number" name="height" className={inputClass} />
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
