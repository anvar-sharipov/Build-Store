import { useFormikContext, Field, ErrorMessage } from "formik";

const CategoriesTab = () => {
  const { values, errors, touched, setFieldValue } = useFormikContext();
  return (
    <div>CategoriesTab</div>
  )
}

export default CategoriesTab