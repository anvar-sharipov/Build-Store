import { useEffect, useRef, useState } from "react";
import MyModal from "../../../UI/MyModal";
import MyInput from "../../../UI/MyInput";
import MyButton from "../../../UI/MyButton";
import MyLoading from "../../../UI/MyLoading";

const UnitEditModal = ({
  openEditModal,
  setOpenEditModal,
  t,
  handleUpdateUnit,
  loading,
  units,
}) => {
  const [editedName, setEditedName] = useState("");
  const [editedId, setEditedId] = useState(null);
  const inputNameRef = useRef(null);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const saveBtnRef = useRef(null);

  useEffect(() => {
    setEditedName(openEditModal.data.name);
    setEditedId(openEditModal.data.id);
    setTimeout(() => {
      inputNameRef.current?.focus();
    }, 20);
  }, []);

  useEffect(() => {
    const exists = units.some(
      (unit) =>
        unit.name.trim().toLowerCase() === editedName.trim().toLowerCase()
    );

    if (!exists && editedName.trim()) {
      setDisabledBtn(false);
    } else {
      setDisabledBtn(true);
    }
  }, [editedName, units]);

  return (
    <MyModal
      onClose={() => setOpenEditModal({ open: false, data: null, index: null })}
    >
      <div className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 text-center">
        <span>{t("changeUnitName")}</span>
        <span className="text-red-600 dark:text-red-400 ml-5">
          {openEditModal.data.name}
        </span>
      </div>
      <div className="flex flex-col items-center gap-5">
        <MyInput
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          ref={inputNameRef}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              saveBtnRef.current?.focus();
            } else if (e.key === "Enter" && !disabledBtn) {
              e.preventDefault();
              handleUpdateUnit(editedName, editedId);
            }
          }}
        />

        <MyButton
          ref={saveBtnRef}
          variant="blue"
          onClick={() => {
            handleUpdateUnit(editedName, editedId);
          }}
          disabled={loading || disabledBtn}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              inputNameRef.current?.focus();
            }
          }}
        >
          {t("save")}
        </MyButton>
      </div>

      {loading && <MyLoading />}
    </MyModal>
  );
};

export default UnitEditModal;
