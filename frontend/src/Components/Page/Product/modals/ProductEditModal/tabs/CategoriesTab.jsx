import { useFormikContext, Field, ErrorMessage } from "formik";
import { useState } from "react";
import CategoryModal from "../../../../../UI/miniModals/CategoryModal";
import BrandModal from "../../../../../UI/miniModals/BrandModal";
import ModelModal from "../../../../../UI/miniModals/ModelModal";
import TagModal from "../../../../../UI/miniModals/TagModal";

const CategoriesTab = ({ options, setOptions }) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const { values, setFieldValue } = useFormikContext();

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Категория */}
      <div>
        <label className="text-sm font-medium">Категория</label>
        <div className="flex gap-2">
          <Field
            as="select"
            name="category"
            className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800"
          >
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
            className="px-3 py-2 bg-green-600 text-white rounded"
          >
            +
          </button>
        </div>
        <ErrorMessage
          name="category"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      {/* Бренд */}
      <div>
        <label className="text-sm font-medium">Бренд</label>
        <div className="flex gap-2">
          <Field
            as="select"
            name="brand"
            className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800"
          >
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
            className="px-3 py-2 bg-green-600 text-white rounded"
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
          <Field
            as="select"
            name="model"
            className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800"
          >
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
            className="px-3 py-2 bg-green-600 text-white rounded"
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
        <label className="text-sm font-medium">Теги</label>
        <div className="flex gap-2">
          <Field
            as="select"
            name="tags"
            multiple
            className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800 h-[90px]"
          >
            {options.tags.map((tag) => (
              <option key={tag.value} value={tag.value}>
                {tag.label}
              </option>
            ))}
          </Field>
          <button
            type="button"
            onClick={() => setShowTagModal(true)}
            className="px-3 py-2 bg-green-600 text-white rounded h-[42px]"
          >
            +
          </button>
        </div>
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
