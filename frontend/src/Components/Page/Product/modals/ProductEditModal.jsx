import React, { useState, useEffect } from "react";
import {
  X,
  Package,
  Tag,
  DollarSign,
  Ruler,
  Weight,
  Layers,
} from "lucide-react";

import {
  fetchUnits,
  fetchCategories,
  fetchModels,
  fetchBrands,
  fetchTags,
} from "../../../fetchs/optionsFetchers";

const ProductEditModal = ({ productEditModal, setProductEditModal }) => {
  const [activeTab, setActiveTab] = useState("basic");
  const product = productEditModal?.data || {};

  const initialValues = {
    name: product.name || "",
    description: product.description || "",
    sku: product.sku || "",
    qr_code: product.qr_code || "",
    quantity: product.quantity || 0,
    purchase_price: product.purchase_price || 0,
    retail_price: product.retail_price || 0,
    wholesale_price: product.wholesale_price || 0,
    discount_price: product.discount_price || "",
    weight: product.weight || "",
    volume: product.volume || "",
    length: product.length || "",
    width: product.width || "",
    height: product.height || "",
    is_active: product.is_active ?? true,
    base_unit: product.base_unit || null,
    category: product.category || null,
    brand: product.brand || null,
    model: product.model || null,
    tags: product.tags || [],
  };

  const [formData, setFormData] = useState(initialValues);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Сохранённые значения:", formData);
    setProductEditModal({ open: false, data: null, index: null });
  };

  const [options, setOptions] = useState({
    base_units: [],
    categories: [],
    brands: [],
    models: [],
    tags: [],
  });

  useEffect(() => {
    const loadUnits = async () => {
      const units = await fetchUnits(); // [{id: 1, name: "kg"}, ...]
      if (units) {
        const formatted = units.map((unit) => ({
          value: unit.id,
          label: unit.name,
        }));
        setOptions((prev) => ({ ...prev, base_units: formatted }));
      }
    };
    loadUnits();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const categories = await fetchCategories();
      if (categories) {
        const formatted = categories.map((unit) => ({
          value: unit.id,
          label: unit.name,
        }));
        setOptions((prev) => ({ ...prev, categories: formatted }));
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadBrands = async () => {
      const brands = await fetchBrands();
      if (brands) {
        const formatted = brands.map((unit) => ({
          value: unit.id,
          label: unit.name,
        }));
        setOptions((prev) => ({ ...prev, brands: formatted }));
      }
    };
    loadBrands();
  }, []);


  useEffect(() => {
    const loadModels = async () => {
      const models = await fetchModels();
      if (models) {
        const formatted = models.map((unit) => ({
          value: unit.id,
          label: unit.name,
        }));
        setOptions((prev) => ({ ...prev, models: formatted }));
      }
    };
    loadModels();
  }, []);


  useEffect(() => {
    const loadTags = async () => {
      const tags = await fetchTags();
      if (tags) {
        const formatted = tags.map((unit) => ({
          value: unit.id,
          label: unit.name,
        }));
        setOptions((prev) => ({ ...prev, tags: formatted }));
      }
    };
    loadTags();
  }, []);

  const tabs = [
    { id: "basic", label: "Основные", icon: Package },
    { id: "pricing", label: "Цены", icon: DollarSign },
    { id: "dimensions", label: "Размеры", icon: Ruler },
    { id: "categories", label: "Категории", icon: Tag },
  ];

  const CustomSelect = ({
    options,
    value,
    onChange,
    placeholder,
    isMulti = false,
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOptions = isMulti
      ? options.filter((opt) => value?.includes(opt.value))
      : options.find((opt) => opt.value === value);

    const handleSelect = (option) => {
      if (isMulti) {
        const newValue = value?.includes(option.value)
          ? value.filter((v) => v !== option.value)
          : [...(value || []), option.value];
        onChange(newValue);
      } else {
        onChange(option.value);
        setIsOpen(false);
      }
    };

    return (
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          {isMulti ? (
            <div className="flex flex-wrap gap-1">
              {selectedOptions?.length > 0 ? (
                selectedOptions.map((opt) => (
                  <span
                    key={opt.value}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm"
                  >
                    {opt.label}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </div>
          ) : (
            <span
              className={selectedOptions ? "text-gray-900" : "text-gray-500"}
            >
              {selectedOptions?.label || placeholder}
            </span>
          )}
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors duration-150 ${
                  (
                    isMulti
                      ? value?.includes(option.value)
                      : value === option.value
                  )
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!productEditModal?.open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Редактировать продукт
              </h2>
              <p className="text-blue-100 mt-1">
                {formData.name || "Новый продукт"}
              </p>
            </div>
            <button
              onClick={() =>
                setProductEditModal({ open: false, data: null, index: null })
              }
              className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
            >
              <X size={24} className="text-white" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-lg"
                      : "text-blue-100 hover:bg-white/20"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="max-h-[50vh] overflow-y-auto pr-2">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Наименование *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="Введите название продукта"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Артикул (SKU)
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="Артикул продукта"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Описание
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
                    placeholder="Подробное описание продукта"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      QR-код
                    </label>
                    <input
                      type="text"
                      value={formData.qr_code}
                      onChange={(e) =>
                        handleInputChange("qr_code", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="QR-код продукта"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Количество *
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        handleInputChange("quantity", Number(e.target.value))
                      }
                      min="0"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) =>
                      handleInputChange("is_active", e.target.checked)
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-gray-700 font-medium cursor-pointer"
                  >
                    Продукт активен
                  </label>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === "pricing" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Закупочная цена
                    </label>
                    <input
                      type="number"
                      value={formData.purchase_price}
                      onChange={(e) =>
                        handleInputChange(
                          "purchase_price",
                          Number(e.target.value)
                        )
                      }
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Розничная цена *
                    </label>
                    <input
                      type="number"
                      value={formData.retail_price}
                      onChange={(e) =>
                        handleInputChange(
                          "retail_price",
                          Number(e.target.value)
                        )
                      }
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Оптовая цена
                    </label>
                    <input
                      type="number"
                      value={formData.wholesale_price}
                      onChange={(e) =>
                        handleInputChange(
                          "wholesale_price",
                          Number(e.target.value)
                        )
                      }
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Цена со скидкой
                    </label>
                    <input
                      type="number"
                      value={formData.discount_price}
                      onChange={(e) =>
                        handleInputChange(
                          "discount_price",
                          Number(e.target.value)
                        )
                      }
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Dimensions Tab */}
            {activeTab === "dimensions" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Вес (кг)
                    </label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) =>
                        handleInputChange("weight", e.target.value)
                      }
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Объем (м³)
                    </label>
                    <input
                      type="number"
                      value={formData.volume}
                      onChange={(e) =>
                        handleInputChange("volume", e.target.value)
                      }
                      min="0"
                      step="0.001"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="0.000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Длина (см)
                    </label>
                    <input
                      type="number"
                      value={formData.length}
                      onChange={(e) =>
                        handleInputChange("length", e.target.value)
                      }
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="0.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Ширина (см)
                    </label>
                    <input
                      type="number"
                      value={formData.width}
                      onChange={(e) =>
                        handleInputChange("width", e.target.value)
                      }
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="0.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Высота (см)
                    </label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) =>
                        handleInputChange("height", e.target.value)
                      }
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === "categories" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Базовая единица
                    </label>
                    <CustomSelect
                      options={options.base_units}
                      value={formData.base_unit}
                      onChange={(value) =>
                        handleInputChange("base_unit", value)
                      }
                      placeholder="Выберите единицу"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Категория
                    </label>
                    <CustomSelect
                      options={options.categories}
                      value={formData.category}
                      onChange={(value) => handleInputChange("category", value)}
                      placeholder="Выберите категорию"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Бренд
                    </label>
                    <CustomSelect
                      options={options.brands}
                      value={formData.brand}
                      onChange={(value) => handleInputChange("brand", value)}
                      placeholder="Выберите бренд"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Модель
                    </label>
                    <CustomSelect
                      options={options.models}
                      value={formData.model}
                      onChange={(value) => handleInputChange("model", value)}
                      placeholder="Выберите модель"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Теги
                  </label>
                  <CustomSelect
                    options={options.tags}
                    value={formData.tags}
                    onChange={(value) => handleInputChange("tags", value)}
                    placeholder="Выберите теги"
                    isMulti
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={() =>
                setProductEditModal({ open: false, data: null, index: null })
              }
              className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Сохранить изменения
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo component to show the modal
export default function App() {
  const [productEditModal, setProductEditModal] = useState({
    open: true,
    data: {
      name: "Samsung Galaxy S21",
      description: "Flagship smartphone with amazing camera",
      sku: "SAMS21-128",
      qr_code: "QR123456789",
      quantity: 25,
      purchase_price: 750,
      retail_price: 999,
      wholesale_price: 850,
      discount_price: 899,
      weight: 0.17,
      volume: 0.0001,
      length: 15.1,
      width: 7.1,
      height: 0.79,
      is_active: true,
      base_unit: 1,
      category: 1,
      brand: 1,
      model: 1,
      tags: [1, 4],
    },
    index: 0,
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Красивая модалка для редактирования продукта
        </h1>
        <button
          onClick={() =>
            setProductEditModal({ ...productEditModal, open: true })
          }
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          Открыть модалку
        </button>
      </div>

      <ProductEditModal
        productEditModal={productEditModal}
        setProductEditModal={setProductEditModal}
      />
    </div>
  );
}
