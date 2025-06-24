import { useEffect, useRef, useState } from "react";
import MyModal from "../../../UI/MyModal";
import MyInput from "../../../UI/MyInput";
import { myClass } from "../../../tailwindClasses";
import MyLoading from "../../../UI/MyLoading";

const UnitAddModal = ({
  setOpenAddModal,
  openAddModal,
  t,
  newUnit,
  setNewUnit,
  handleAddUnit,
  units,
  loading,
}) => {
  const addInputRef = useRef(null);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const addBtnRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      addInputRef.current?.focus();
    }, 20);
  }, []);

  useEffect(() => {
    const exists = units.some(
      (unit) => unit.name.trim().toLowerCase() === newUnit.trim().toLowerCase()
    );

    if (!exists && newUnit.trim()) {
      setDisabledBtn(false);
    } else {
      setDisabledBtn(true);
    }
  }, [newUnit, units]);

  return (
    <MyModal onClose={() => setOpenAddModal(false)}>
      <div className="flex flex-col gap-2 mt-5">
        <div>
          <MyInput
            ref={addInputRef}
            disabled={loading}
            type="text"
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
            placeholder={`${t("addUnit")}...`}
            className="flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 dark:focus:bg-gray-700"
            onKeyDown={(e) => {
              if (e.key == "Enter" && !disabledBtn) {
                e.preventDefault();
                handleAddUnit(newUnit);
              }
            }}
            // disabled={loadingAdd}
          />
        </div>
        <div className="flex justify-end">
          <button
            className={myClass.button}
            onClick={() => handleAddUnit(newUnit)}
            ref={addBtnRef}
            disabled={disabledBtn || loading}
          >
            {t("save")}
          </button>
        </div>
      </div>
      {loading && <MyLoading />}
    </MyModal>
  );
};

export default UnitAddModal;
