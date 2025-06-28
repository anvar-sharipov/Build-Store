import { useState, useEffect } from "react";
import myAxios from "../../axios";
import { fetchUnits } from "../../fetchs/optionsFetchers";
import { option } from "framer-motion/client";

const AdditionalUnitModal = ({ onClose, onSuccess, productId }) => {
  const [unit, setUnit] = useState("");
  const [error, setError] = useState("");
  const [units, setUnits] = useState("");
  const [conversionFactor, setConversionFactor] = useState("");

  const handleSubmit = async () => {
    if (!unit) {
      setError("Пожалуйста, выберите единицу измерения");
      return;
    }
    if (!conversionFactor || isNaN(conversionFactor)) {
      setError("Введите корректный коэффициент");
      return;
    }
    try {
      const res = await myAxios.post("/product-units/", {
        product: productId,
        unit: unit,
        conversion_factor: conversionFactor,
      });
      //   onSuccess(res.data); // передать созданную единицу
      onClose();
    } catch (err) {
      setError("Ошибка при сохранении1");
      if (err.response?.data) {
        console.error("Ошибка сервера:", err.response.data);
        setError(JSON.stringify(err.response.data)); // покажи подробности
      } else {
        setError("Ошибка при сохранении2");
      }
    }
  };

  useEffect(() => {
    const loadUnits = async () => {
      const unitsList = await fetchUnits(); // [{id: 1, name: "kg"}, ...]
      setUnits(unitsList);
    };
    loadUnits();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4">
          Добавить дополнительную единицу
        </h2>
        {/* <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Введите название (напр. кг)"
        /> */}
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={unit} // state, например: const [unit, setUnit] = useState("");
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="" disabled className="text-gray-400">
            Выберите дополнительную единицу
          </option>
          {units.length > 0 ? (
            units.map((unit) => (
              <option key={unit.id} value={unit.id} className="text-gray-800">
                {unit.name}
              </option>
            ))
          ) : (
            <option disabled className="text-gray-500 italic">
              Нет единиц измерения
            </option>
          )}
        </select>

        <input
          type="number"
          step="0.0001"
          className="w-full mt-3 p-2 border border-gray-300 rounded-md"
          placeholder="Коэффициент (напр. 18)"
          value={conversionFactor}
          onChange={(e) => setConversionFactor(e.target.value)}
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

export default AdditionalUnitModal;
