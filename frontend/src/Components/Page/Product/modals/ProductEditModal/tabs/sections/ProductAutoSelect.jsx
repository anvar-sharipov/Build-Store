import AsyncSelect from "react-select/async";
import { useFormikContext } from "formik";
import myAxios from "../../../../../../axios";

const ProductAutoSelect = ({ index }) => {
  const { values, setFieldValue } = useFormikContext();

  const loadOptions = (inputValue, callback) => {
    myAxios
      .get(`search-products/?q=${inputValue}`)
      .then((res) => {
        const options = res.data.map((p) => ({
          value: p.id,
          label: p.name,
        }));
        callback(options);
      });
  };

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      placeholder="Поиск товара..."
      onChange={(selectedOption) => {
        setFieldValue(`free_items[${index}].gift_product`, selectedOption.value);
      }}
    />
  );
};

export default ProductAutoSelect;
