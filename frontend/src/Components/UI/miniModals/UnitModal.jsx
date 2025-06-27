import { useState } from "react";
import myAxios from "../../axios";

const UnitModal = ({ onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await myAxios.post("/units/", { name });
      onSuccess(res.data); // передать созданную единицу
      onClose();
    } catch (err) {
      setError("Ошибка при создании");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4">Добавить единицу</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Введите название (напр. кг)"
        />
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <div className="flex justify-end mt-4 gap-2">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={onClose}
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

export default UnitModal;
