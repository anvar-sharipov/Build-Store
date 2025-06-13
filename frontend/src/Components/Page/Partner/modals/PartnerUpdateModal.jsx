import MyModal from "../../../UI/MyModal"
import MyInput from "../../../UI/MyInput"
import MyButton from "../../../UI/MyButton"
import { CiNoWaitingSign } from "react-icons/ci";






const PartnerUpdateModal = ({
    setOpenModal,
      listItemRefs,
      selectedListItemRef,
      t,
      editInputRef,
      editName,
      setEditName,
      handleEditKeyDown,
      refUpdateRadioInput,
      editType,
      setEditType,
      refUpdateCancelButton,
      updatePartner,
      refUpdateSaveButton,
      loadingEdit,
}) => {
  return (
    <MyModal
          onClose={() => {
            setOpenModal(false);
            listItemRefs.current[selectedListItemRef]?.focus();
          }}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              {t("change")}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("changePartnerName")}
              </label>
              <MyInput
                ref={editInputRef}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder={t("enterPartnerName")}
                className="w-full focus:ring-2 focus:ring-blue-500"
                onKeyDown={handleEditKeyDown}
              />
            </div>

            {/* Type selection in modal */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("changePartnerType")}
              </label>
              <div className="flex gap-4">
                {["klient", "supplier", "both"].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      ref={(el) => (refUpdateRadioInput.current[type] = el)}
                      type="radio"
                      value={type}
                      checked={editType === type}
                      onChange={(e) => setEditType(e.target.value)}
                      className="text-blue-500 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          refUpdateCancelButton.current?.focus();
                        }
                        if (e.key === "ArrowUp") {
                          e.preventDefault();
                          editInputRef.current?.focus();
                        }
                        if (e.key === "Enter") {
                          e.preventDefault();
                          updatePartner();
                        }
                      }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {t(type)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
              <MyButton
                ref={refUpdateCancelButton}
                variant="blue"
                onClick={() => {
                  setOpenModal(false);
                  listItemRefs.current[selectedListItemRef]?.focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                    e.preventDefault();
                    refUpdateSaveButton.current?.focus();
                  }
                  if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    refUpdateRadioInput.current["supplier"]?.focus();
                  }
                }}
              >
                {t("cancel")}
              </MyButton>
              <MyButton
                ref={refUpdateSaveButton}
                variant="blue"
                onClick={updatePartner}
                disabled={loadingEdit}
                className="min-w-[100px]"
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    refUpdateCancelButton.current?.focus();
                  }
                }}
              >
                {loadingEdit ? (
                  <span className="flex items-center gap-2">
                    <CiNoWaitingSign className="animate-spin" />
                    {t("saving")}
                  </span>
                ) : (
                  t("save")
                )}
              </MyButton>
            </div>
          </div>
        </MyModal>
  )
}

export default PartnerUpdateModal