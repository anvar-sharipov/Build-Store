import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function ProductsFilter({
  searchParams,
  setSearchParams,
  categories,
  t,
  setSearchQuery,
}) {
  // начальные значения берем из searchParams
  const initialValues = {
    categories: searchParams.get("categories")?.split(",") || [],
    wholesale_price_min: searchParams.get("wholesale_price_min") || "",
    wholesale_price_max: searchParams.get("wholesale_price_max") || "",
    retail_price_min: searchParams.get("retail_price_min") || "",
    retail_price_max: searchParams.get("retail_price_max") || "",
    ordering: searchParams.get("ordering") || "",
  };

  // при сабмите обновляем параметры URL
  const onSubmit = (values) => {
    // создаём копию текущих параметров
    const params = new URLSearchParams(searchParams);

    // категории — массив в строку
    if (values.categories.length > 0) {
      params.set("categories", values.categories.join(","));
    } else {
      params.delete("categories");
    }

    // цены
    if (values.wholesale_price_min) {
      params.set("wholesale_price_min", values.wholesale_price_min);
    } else {
      params.delete("wholesale_price_min");
    }

    if (values.wholesale_price_max) {
      params.set("wholesale_price_max", values.wholesale_price_max);
    } else {
      params.delete("wholesale_price_max");
    }

    if (values.retail_price_min) {
      params.set("retail_price_min", values.retail_price_min);
    } else {
      params.delete("retail_price_min");
    }

    if (values.retail_price_max) {
      params.set("retail_price_max", values.retail_price_max);
    } else {
      params.delete("retail_price_max");
    }

    // сортировка
    if (values.ordering) {
      params.set("ordering", values.ordering);
    } else {
      params.delete("ordering");
    }

    // Не трогаем параметр 'search', он останется, если был

    setSearchParams(params);
  };

  // Formik передаёт в Yup пустую строку "", если поле пустое. А Yup.number() по умолчанию считает "" невалидным значением. Чтобы "" превратилось в null (и пропустилось как "ничего не введено") — мы добавляем transform.
  const validationSchema = Yup.object({
    wholesale_price_min: Yup.number()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? null : value
      )
      .typeError("Должно быть числом")
      .min(0, "Минимум 0")
      .nullable(true),

    wholesale_price_max: Yup.number()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? null : value
      )
      .typeError("Должно быть числом")
      .min(0, "Минимум 0")
      .nullable(true)
      .when("wholesale_price_min", (min, schema) =>
        min ? schema.min(min, "Не может быть меньше минимальной") : schema
      ),

    retail_price_min: Yup.number()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? null : value
      )
      .typeError("Должно быть числом")
      .min(0, "Минимум 0")
      .nullable(true),

    retail_price_max: Yup.number()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? null : value
      )
      .typeError("Должно быть числом")
      .min(0, "Минимум 0")
      .nullable(true)
      .when("retail_price_min", (min, schema) =>
        min ? schema.min(min, "Не может быть меньше минимальной") : schema
      ),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ values, setFieldValue, resetForm }) => (
        <Form className="text-gray-400 text-sm">
          <div className="border p-2 border-gray-600 rounded">
            <h3 className="font-semibold text-base text-center text-gray-600">
              {t("categories")}
            </h3>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-auto">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center cursor-pointer select-none whitespace-nowrap px-2 py-1 rounded border border-gray-700  hover:bg-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={values.categories.includes(String(cat.id))}
                    onChange={() => {
                      if (values.categories.includes(String(cat.id))) {
                        setFieldValue(
                          "categories",
                          values.categories.filter((c) => c !== String(cat.id))
                        );
                      } else {
                        setFieldValue("categories", [
                          ...values.categories,
                          String(cat.id),
                        ]);
                      }
                    }}
                    className="mr-1 accent-blue-600 w-4 h-4 "
                  />
                  <span className="text-sm">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border p-2 border-gray-600 rounded">
            <h3 className="font-semibold text-base text-center text-gray-600">
              {t("wholesale_price")}
            </h3>
            <div className="flex">
              <label className="flex flex-col flex-1">
                <span className="mb-1">{t("min")}</span>
                <Field
                  type="number"
                  name="wholesale_price_min"
                  placeholder={t("priceFrom")}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 border-gray-600 w-20"
                />
                <ErrorMessage
                  name="wholesale_price_min"
                  component="div"
                  className="text-red-500 text-xs mt-0.5"
                />
              </label>
              <label className="flex flex-col flex-1">
                <span className="mb-1">{t("max")}</span>
                <Field
                  type="number"
                  name="wholesale_price_max"
                  placeholder={t("priceTo")}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 border-gray-600 w-20"
                />
                <ErrorMessage
                  name="wholesale_price_max"
                  component="div"
                  className="text-red-500 text-xs mt-0.5"
                />
              </label>
            </div>
          </div>

          <div className="border p-2 border-gray-600 rounded">
            <h3 className="font-semibold text-base text-center text-gray-600">
              {t("retail_price")}
            </h3>
            <div className="flex">
              <label className="flex flex-col flex-1">
                <span className="mb-1">{t("min")}</span>
                <Field
                  type="number"
                  name="retail_price_min"
                  placeholder={t("priceFrom")}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 border-gray-600 w-20"
                />
                <ErrorMessage
                  name="retail_price_min"
                  component="div"
                  className="text-red-500 text-xs mt-0.5"
                />
              </label>
              <label className="flex flex-col flex-1">
                <span className="mb-1">{t("max")}</span>
                <Field
                  type="number"
                  name="retail_price_max"
                  placeholder={t("priceTo")}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 border-gray-600 w-20"
                />
                <ErrorMessage
                  name="retail_price_max"
                  component="div"
                  className="text-red-500 text-xs mt-0.5"
                />
              </label>
            </div>
          </div>

          <div className="border p-2 border-gray-600 rounded">
            <h3 className="font-semibold text-base text-center text-gray-600">
              {t("sort")}
            </h3>
            <Field
              as="select"
              name="ordering"
              className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 border-gray-600"
            >
              <option value="">{t("noneSort")}</option>
              <option value="wholesale_price">{t("wholesale_price")} ↑</option>
              <option value="-wholesale_price">{t("wholesale_price")} ↓</option>
              <option value="retail_price">{t("retail_price")} ↑</option>
              <option value="-retail_price">{t("retail_price")} ↓</option>
              <option value="name">{t("name")} ↑</option>
              <option value="-name">{t("name")} ↓</option>
            </Field>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button
              type="submit"
              className="flex-1 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {t("acceptFilter")}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                const params = new URLSearchParams(searchParams);
                params.delete("categories");
                params.delete("wholesale_price_min");
                params.delete("wholesale_price_max");
                params.delete("retail_price_min");
                params.delete("retail_price_max");
                params.delete("ordering");
                // search оставить как есть, если нужно можно удалить params.delete("search");
                setSearchParams(params);
                setSearchQuery("");
              }}
              className="flex-1 px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-500 transition"
            >
              {t("cancelFilter")}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ProductsFilter;
