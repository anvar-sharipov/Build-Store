import { useEffect, useRef } from "react";
import { myClass } from "../../../tailwindClasses";
import MyLoading from "../../../UI/MyLoading";
import MyModal from "../../../UI/MyModal";
import MyButton from "../../../UI/MyButton";

MyModal;

const UnitDeleteModal = ({
  setOpenDeleteModal,
  openDeleteModal,
  t,
  handleDeleteUnit,
  loading,
}) => {
  const cancelBtnRef = useRef(null);
  const deleteBtnRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      cancelBtnRef.current?.focus();
    }, 20);
  }, []);
  return (
    <MyModal onClose={() => setOpenDeleteModal({ open: false, data: null })}>
      <div className="text-center text-lg font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg shadow-sm">
        {t("delete")} {t("unit2")}{" "}
        <span className="text-red-600 dark:text-red-400">
          "{openDeleteModal.data.name}"
        </span>
        ?
      </div>

      <div className="flex justify-end gap-5 mt-10">
        <MyButton
          variant="gray"
          onClick={() => setOpenDeleteModal({ open: false, data: null })}
          disabled={loading}
          ref={cancelBtnRef}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              e.preventDefault();
              deleteBtnRef.current?.focus();
            }
          }}
        >
          {t("cancel")}
        </MyButton>

        <MyButton
          variant="blue"
          onClick={() => handleDeleteUnit(openDeleteModal.data.id)}
          disabled={loading}
          ref={deleteBtnRef}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
              e.preventDefault();
              cancelBtnRef.current?.focus();
            }
          }}
        >
          {t("delete")}
        </MyButton>
      </div>

      {loading && <MyLoading />}
    </MyModal>
  );
};

export default UnitDeleteModal;
