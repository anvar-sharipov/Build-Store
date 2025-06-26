import { useFormikContext, Field, ErrorMessage } from "formik";

const PricesTab = () => {
  const { values, errors, touched, setFieldValue } = useFormikContext();
  return (
    <div>PricesTab</div>
  )
}

export default PricesTab