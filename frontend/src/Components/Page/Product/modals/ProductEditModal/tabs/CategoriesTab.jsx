import { useFormikContext, Field, ErrorMessage } from "formik";
import { useState } from "react";
import CategoryModal from "../../../../../UI/miniModals/CategoryModal";
import BrandModal from "../../../../../UI/miniModals/BrandModal";
import ModelModal from "../../../../../UI/miniModals/ModelModal";
import TagModal from "../../../../../UI/miniModals/TagModal";
import { myClass } from "../../../../../tailwindClasses";

const CategoriesTab = ({ options, setOptions }) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    initialValues,
    // validateForm ,
  } = useFormikContext();

  const handleAdd = (type, item) => {
    const newItem = { value: String(item.id), label: item.name };
    setOptions((prev) => ({
      ...prev,
      [type]: [...prev[type], newItem],
    }));
    if (type === "tags") {
      setFieldValue("tags", [...(values.tags || []), String(item.id)]);
    } else {
      setFieldValue(type.slice(0, -1), String(item.id));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Категория */}
      <div>
        <label className="text-sm font-medium">Категория</label>
        <div className="flex gap-2">
          <Field as="select" name="category" className={myClass.input2}>
            <option value="">Выберите категорию</option>
            {options.categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </Field>
          <button
            type="button"
            onClick={() => setShowCategoryModal(true)}
            className={myClass.buttonRounded}
          >
            +
          </button>
        </div>

        {errors.category && (
          <div className="text-red-500 text-sm mt-1">{errors.category}</div>
        )}
      </div>

      {/* Бренд */}
      <div>
        <label className="text-sm font-medium">Бренд</label>
        <div className="flex gap-2">
          <Field as="select" name="brand" className={myClass.input2}>
            <option value="">Выберите бренд</option>
            {options.brands.map((brand) => (
              <option key={brand.value} value={brand.value}>
                {brand.label}
              </option>
            ))}
          </Field>
          <button
            type="button"
            onClick={() => setShowBrandModal(true)}
            className={myClass.buttonRounded}
          >
            +
          </button>
        </div>
        <ErrorMessage
          name="brand"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      {/* Модель */}
      <div>
        <label className="text-sm font-medium">Модель</label>
        <div className="flex gap-2">
          <Field as="select" name="model" className={myClass.input2}>
            <option value="">Выберите модель</option>
            {options.models.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </Field>
          <button
            type="button"
            onClick={() => setShowModelModal(true)}
            className={myClass.buttonRounded}
          >
            +
          </button>
        </div>
        <ErrorMessage
          name="model"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      {/* Теги */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Теги
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {values.tags?.map((tagValue) => {
            const tag = options.tags.find((t) => t.value === tagValue);
            return (
              <span
                key={tagValue}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
              >
                {tag?.label || tagValue}
                <button
                  type="button"
                  onClick={() =>
                    setFieldValue(
                      "tags",
                      values.tags.filter((v) => v !== tagValue)
                    )
                  }
                  className="hover:text-blue-600 dark:hover:text-blue-300"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Field
            as="select"
            name="tags"
            multiple
            className="
          flex-1
          h-32
          pl-3 pr-3 py-2
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-600
          rounded-md
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition
        "
          >
            {options.tags.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Field>
          <button
            type="button"
            onClick={() => setShowTagModal(true)}
            className="
          flex items-center justify-center
          h-9 w-9
          bg-green-600 hover:bg-green-700
          text-white
          rounded-full
          shadow-md
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-green-400
        "
          >
            <span className="text-lg leading-none">+</span>
          </button>
        </div>
        <ErrorMessage
          name="tags"
          component="div"
          className="mt-1 text-sm text-red-600"
        />
      </div>

      {/* Модалки */}
      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          onSuccess={(cat) => handleAdd("categories", cat)}
        />
      )}
      {showBrandModal && (
        <BrandModal
          onClose={() => setShowBrandModal(false)}
          onSuccess={(brand) => handleAdd("brands", brand)}
        />
      )}
      {showModelModal && (
        <ModelModal
          onClose={() => setShowModelModal(false)}
          onSuccess={(model) => handleAdd("models", model)}
          brands={options.brands}
        />
      )}
      {showTagModal && (
        <TagModal
          onClose={() => setShowTagModal(false)}
          onSuccess={(tag) => handleAdd("tags", tag)}
        />
      )}
    </div>
  );
};

export default CategoriesTab;
