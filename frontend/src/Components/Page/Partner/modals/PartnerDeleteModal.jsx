import MyModal from "../../../UI/MyModal";
import { CiNoWaitingSign } from "react-icons/ci";
import { RiDeleteBin2Fill } from "react-icons/ri";
import TypeBadge from "../TypeBadge";
import MyButton from "../../../UI/MyButton";

const PartnerDeleteModal = ({
  setDeleteModal,
  listItemRefs,
  loadingDeleteId,
  t,
  deleteModal,
  deleteCancelRef,
  deleteOKRef,
  deletePartner,
}) => {
  return (
    <MyModal
      onClose={() => {
        setDeleteModal({ open: false, data: null, index: null });
        listItemRefs.current[deleteModal.index]?.focus();
      }}
    >
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-6">
        {/* Заголовок */}
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <div className="text-2xl">
            {loadingDeleteId !== null ? (
              <CiNoWaitingSign className="animate-spin" />
            ) : (
              <RiDeleteBin2Fill />
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {t("deletePartner")}
          </h2>
        </div>

        {/* Информация о партнёре */}
        <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-600 pb-4">
          <div className="text-lg font-medium text-gray-700 dark:text-gray-200">
            {deleteModal.data.name}
          </div>
          <TypeBadge
            typeText={t(deleteModal.data.type)}
            text={deleteModal.data.type_display}
            type={deleteModal.data.type}
          />
        </div>

        {/* Кнопки управления */}
        <div className="flex justify-end gap-4 pt-4">
          <MyButton
            ref={deleteCancelRef}
            variant="blue"
            onClick={() => {
              listItemRefs.current[deleteModal.index]?.focus();
              setDeleteModal({ open: false, data: null, index: null });
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") deleteOKRef.current?.focus();
            }}
            className="min-w-[100px]"
          >
            {t("cancel")}
          </MyButton>
          <MyButton
            ref={deleteOKRef}
            variant="red"
            onClick={() =>
              deletePartner(deleteModal.data.id, deleteModal.data.name)
            }
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") deleteCancelRef.current?.focus();
            }}
            className="min-w-[100px]"
            disabled={loadingDeleteId !== null}
          >
            {t("delete")}
          </MyButton>
        </div>
      </div>
    </MyModal>
  );
};

export default PartnerDeleteModal;
