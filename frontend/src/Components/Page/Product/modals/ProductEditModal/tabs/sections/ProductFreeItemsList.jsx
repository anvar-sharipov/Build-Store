import { useFormikContext, Field, ErrorMessage } from "formik";
import AsyncSelect from "react-select/async";
import myAxios from "../../../../../../axios";
import { useState, useCallback } from "react";

const ProductFreeItemsList = ({ productOptions = [] }) => {
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const [selectedProducts, setSelectedProducts] = useState({}); // Кэш выбранных продуктов

  const handleAddFreeItem = () => {
    const newItem = { gift_product: "", quantity_per_unit: "" };
    setFieldValue("free_items", [...(values.free_items || []), newItem]);
  };

  const handleRemoveFreeItem = (index) => {
    const updated = [...(values.free_items || [])];
    updated.splice(index, 1);
    setFieldValue("free_items", updated);
    
    // Очищаем кэш для удаленного элемента
    const newSelectedProducts = { ...selectedProducts };
    delete newSelectedProducts[index];
    // Обновляем индексы в кэше
    const updatedCache = {};
    Object.keys(newSelectedProducts).forEach(key => {
      const keyIndex = parseInt(key);
      if (keyIndex > index) {
        updatedCache[keyIndex - 1] = newSelectedProducts[key];
      } else if (keyIndex < index) {
        updatedCache[keyIndex] = newSelectedProducts[key];
      }
    });
    setSelectedProducts(updatedCache);
  };

  const loadProductOptions = useCallback(async (inputValue) => {
    if (!inputValue || inputValue.length < 2) {
      return [];
    }
    
    try {
      const res = await myAxios.get(`search-products/?q=${inputValue}`);
      return res.data.map((p) => ({ 
        value: String(p.id), // Приводим к строке для консистентности
        label: p.name 
      }));
    } catch (error) {
      console.error('Ошибка поиска продуктов:', error);
      return [];
    }
  }, []);

  // Функция для получения значения селекта
  const getSelectValue = (item, index) => {
    if (!item.gift_product) return null;
    
    // Сначала проверяем кэш
    if (selectedProducts[index]) {
      return selectedProducts[index];
    }
    
    // Потом ищем в productOptions
    const option = productOptions.find((opt) => String(opt.value) === String(item.gift_product));
    if (option) {
      return option;
    }
    
    // Если не найдено, возвращаем базовое значение
    return { 
      value: String(item.gift_product), 
      label: `${item.gift_product_name}` 
    };
  };

  const handleProductChange = (selectedOption, index) => {
    const value = selectedOption?.value || "";
    setFieldValue(`free_items[${index}].gift_product`, value);
    
    // Сохраняем выбранный продукт в кэше
    if (selectedOption) {
      setSelectedProducts(prev => ({
        ...prev,
        [index]: selectedOption
      }));
    } else {
      const newCache = { ...selectedProducts };
      delete newCache[index];
      setSelectedProducts(newCache);
    }
  };

  const freeItems = values.free_items || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Бесплатные товары в комлекте</label>
        <button
          type="button"
          onClick={handleAddFreeItem}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          + Добавить
        </button>
      </div>

      {freeItems.length === 0 && (
        <div className="text-sm text-gray-500 italic">
          Нет бесплатных товаров.
        </div>
      )}

      {freeItems.map((item, index) => (
        <div
          key={index}
          className="flex gap-3 items-start border p-3 rounded bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
        >
          <div className="flex-1">
            <AsyncSelect
              cacheOptions
              defaultOptions={false}
              loadOptions={loadProductOptions}
              placeholder="Введите название продукта (мин. 2 символа)..."
              noOptionsMessage={({ inputValue }) => 
                inputValue.length < 2 
                  ? "Введите минимум 2 символа" 
                  : "Продукты не найдены"
              }
              loadingMessage={() => "Поиск..."}
              value={getSelectValue(item, index)}
              onChange={(selectedOption) => handleProductChange(selectedOption, index)}
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '38px',
                }),
                placeholder: (base) => ({
                  ...base,
                  fontSize: '14px',
                }),
              }}
            />
            {/* Ошибка валидации для продукта */}
            <ErrorMessage
              name={`free_items[${index}].gift_product`}
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div className="w-32">
            <Field
              type="number"
              step="0.01"
              min="0"
              name={`free_items[${index}].quantity_per_unit`}
              className="w-full p-2 border rounded text-sm dark:bg-gray-800 dark:border-gray-600"
              placeholder="Кол-во"
            />
            {/* Ошибка валидации для количества */}
            <ErrorMessage
              name={`free_items[${index}].quantity_per_unit`}
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <button
            type="button"
            onClick={() => handleRemoveFreeItem(index)}
            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors text-lg leading-none"
            title="Удалить товар"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductFreeItemsList;