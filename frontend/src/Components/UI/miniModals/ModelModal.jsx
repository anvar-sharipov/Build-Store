import { useState } from "react";
import myAxios from "../../axios";

const ModelModal = ({ onClose, onSuccess, brands }) => {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [error, setError] = useState("");

  console.log('name', name);
  console.log('brand', brand);
  

  const handleSubmit = async () => {
    if (!brand) {
      setError("Выберите бренд");
      return;
    }
    try {
      const res = await myAxios.post("/models/", { name, brand });
      onSuccess(res.data);
      onClose();
    } catch (err) {
      setError("Ошибка при создании");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4">Добавить модель</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-3"
          placeholder="Введите модель (напр. iPhone 15)"
        />

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
        >
          <option value="">Выберите бренд</option>
          {brands.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>

        {error && <div className="text-red-500 mt-2">{error}</div>}

        <div className="flex justify-end mt-4 gap-2">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={onClose}
            type="button"
          >
            Отмена
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
            type="button"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelModal;
