import { useState } from "react";
import myAxios from "../../axios";

const TagModal = ({ onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await myAxios.post("/tags/", { name });
      onSuccess(res.data); // передать созданную единицу
      onClose();
    } catch (err) {
      setError("Ошибка при создании");
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-96 text-gray-900 dark:text-gray-100">
        <h2 className="text-lg font-semibold mb-4">Добавить тег</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 p-2 rounded w-full"
          placeholder="Введите тег (напр. Природа)"
        />
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <div className="flex justify-end mt-4 gap-2">
          <button
            className="bg-gray-400 dark:bg-gray-600 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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

export default TagModal;
