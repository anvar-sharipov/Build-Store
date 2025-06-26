import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function ProductList() {
  const initialValues = {
    name: "",
    email: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Введите имя").min(3, "Минимум 3 символа"),
    email: Yup.string().email("Неверный email").required("Введите email"),
  });

  const onSubmit = (values) => {
    alert("Форма отправлена: " + JSON.stringify(values, null, 2));
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ errors, touched }) => (
        <Form className="space-y-4 max-w-md mx-auto mt-10">
          {/* Имя */}
          <div>
            <label className="block font-medium mb-1">Имя</label>
            <Field
              name="name"
              className={`w-full p-2 border rounded
                ${
                  touched.name
                    ? errors.name
                      ? "border-red-500"
                      : "border-green-500"
                    : "border-gray-300"
                }
              `}
              placeholder="Введите имя"
            />
            {touched.name && errors.name && (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <Field
              name="email"
              type="email"
              className={`w-full p-2 border rounded
                ${
                  touched.email
                    ? errors.email
                      ? "border-red-500"
                      : "border-green-500"
                    : "border-gray-300"
                }
              `}
              placeholder="Введите email"
            />
            {touched.email && errors.email && (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Отправить
          </button>
        </Form>
      )}
    </Formik>
  );
}

// import { useTranslation } from "react-i18next";
// import { useEffect } from "react";

// export default function ProductList() {
// const { t } = useTranslation();

// useEffect(() => {
//     document.title = t("main");
//   }, []);

//   return (
//     <div className="p-2">
//       <div className="block lg:hidden text-center">
//         {t("main")}
//         <hr className="m-1" />
//       </div>
//     </div>
//   );
// }
