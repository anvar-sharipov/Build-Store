import MyModal from "../../../UI/MyModal";
import MyInput from "../../../UI/MyInput";
import { CiNoWaitingSign } from "react-icons/ci";
import { IoIosAddCircleOutline } from "react-icons/io";

const PartnerAddModal = ({
  openModalAdd,
  setOpenModalAdd,
  t,
  radioRefs,
  partnerType,
  setPartnerType,
  addInputRef,
  addPartner,
  loadingAdd,
  newPartner,
  setNewPartner,
  handleAddKeyDown,
}) => {
  return (
    <MyModal
      onClose={() => {
        setOpenModalAdd(false);
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
          {t("addNewPartner")}
        </h2>

        {/* Type selection for adding */}
        <div className="flex gap-4 mb-3">
          {["klient", "supplier", "both"].map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                ref={(el) => (radioRefs.current[type] = el)}
                type="radio"
                value={type}
                checked={partnerType === type}
                onChange={(e) => setPartnerType(e.target.value)}
                className="text-blue-500 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    addInputRef.current?.focus();
                  }
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPartner();
                  }
                }}
              />
              <span className="text-gray-700 dark:text-gray-300">
                {t(type)}
              </span>
            </label>
          ))}
        </div>

        <div className="flex items-end gap-3">
          <button
            onClick={addPartner}
            disabled={loadingAdd}
            className="text-4xl text-green-500 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title={t("addPartner")}
          >
            {loadingAdd ? (
              <CiNoWaitingSign className="animate-spin" />
            ) : (
              <IoIosAddCircleOutline />
            )}
          </button>
          <MyInput
            ref={addInputRef}
            name="new_partner"
            type="text"
            value={newPartner}
            onChange={(e) => setNewPartner(e.target.value)}
            placeholder={`${t("addNewPartner")}...`}
            className="flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 dark:focus:bg-gray-700"
            onKeyDown={(e) => handleAddKeyDown(e)}
            disabled={loadingAdd}
          />
        </div>
      </div>
    </MyModal>
  );
};

export default PartnerAddModal;
