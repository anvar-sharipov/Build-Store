import { useFormikContext, Field, ErrorMessage } from "formik";
import { myClass } from "../../../../../tailwindClasses";

const BasicTab = () => {
  const { values, errors, touched, setFieldValue } = useFormikContext();
  return (
    <div>
      <Field name="name" className={myClass.input} />
      <ErrorMessage name="name" component="div" className="text-red-500" />
    </div>
  )
}

export default BasicTab