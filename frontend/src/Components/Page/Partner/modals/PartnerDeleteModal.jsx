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
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex gap-2 items-center">
          <button
            disabled={loadingDeleteId !== null}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            {loadingDeleteId !== null ? (
              <CiNoWaitingSign className="animate-spin" size={28} />
            ) : (
              <RiDeleteBin2Fill size={28} />
            )}
          </button>
          <span>{t("deletePartner")}</span>
        </h2>
        <div className="flex justify-between mb-4">
          <div>{deleteModal.data.name}</div>
          <TypeBadge
            typeText={t(deleteModal.data.type)}
            text={deleteModal.data.type_display}
            type={deleteModal.data.type}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <MyButton
            ref={deleteCancelRef}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                deleteOKRef.current?.focus();
              }
            }}
            variant="blue"
            onClick={() => {
              listItemRefs.current[deleteModal.index]?.focus();
              setDeleteModal({
                open: false,
                data: null,
                index: null,
              });
            }}
          >
            {t("cancel")}
          </MyButton>
          <MyButton
            ref={deleteOKRef}
            variant="blue"
            onClick={() =>
              deletePartner(deleteModal.data.id, deleteModal.data.name)
            }
            // disabled={loadingEdit}
            className="min-w-[100px]"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                deleteCancelRef.current?.focus();
              }
            }}
          >
            {t("delete")}
          </MyButton>
        </div>
      </div>
    </MyModal>
  );
};

export default PartnerDeleteModal;
