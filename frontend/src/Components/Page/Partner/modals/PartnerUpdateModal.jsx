import MyModal from "../../../UI/MyModal";
import MyInput from "../../../UI/MyInput";
import MyButton from "../../../UI/MyButton";
import { CiNoWaitingSign } from "react-icons/ci";
import { useState, useEffect, useRef } from "react";
import { FaLeaf } from "react-icons/fa";
import MyLoading from "../../../UI/MyLoading";

const PartnerUpdateModal = ({
  showNotification,
  selectedAgent,
  setSelectedAgent,
  agentList,
  setOpenModal,
  listItemRefs,
  selectedListItemRef,
  t,
  editInputRef,
  editName,
  setEditName,
  editAgent,
  setEditAgent,
  handleEditKeyDown,
  refUpdateRadioInput,
  editType,
  setEditType,
  refUpdateCancelButton,
  updatePartner,
  refUpdateSaveButton,
  loadingEdit,
}) => {
  const [filteredAgents, setFilteredAgents] = useState([]);
  const agentItemRefs = useRef([]);
  const agentInputRef = useRef();

  // ckryt li podskazki esli kliknut w drugoe mesto
  const wrapperRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowAgentDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);

  useEffect(() => {
  const handleBlur = (e) => {
    // Подождём чуть-чуть, чтобы учесть переход фокуса на элемент списка
    setTimeout(() => {
      const active = document.activeElement;
      if (
        agentInputRef.current &&
        !agentInputRef.current.contains(active) &&
        !agentItemRefs.current.some((ref) => ref === active)
      ) {
        setShowAgentDropdown(false);
      }
    }, 100); // 100 мс — оптимально
  };

  const inputEl = agentInputRef.current;
  inputEl?.addEventListener("blur", handleBlur);
  return () => inputEl?.removeEventListener("blur", handleBlur);
}, [filteredAgents]);

  useEffect(() => {
    if (!editAgent?.trim() || !Array.isArray(agentList)) {
      setFilteredAgents([]);
      return;
    }

    if (!showAgentDropdown) {
      setFilteredAgents([]);
      return;
    }
    const matches = agentList.filter((agent) =>
      agent.name.toLowerCase().includes(editAgent.toLowerCase())
    );
    setFilteredAgents(matches);
  }, [editAgent, agentList]);

  useEffect(() => {
    if (!showAgentDropdown) {
      setFilteredAgents([]);
    }
  }, [showAgentDropdown]);

  // useEffect(() => {
  //   agentItemRefs.current = [];
  // }, [filteredAgents]);

  useEffect(() => {
    if (filteredAgents.length === 1 && editAgent === filteredAgents[0].name) {
      setSelectedAgent(filteredAgents[0]);
    }
  }, [filteredAgents]);

  return (
    <MyModal
      onClose={() => {
        setOpenModal(false);
        listItemRefs.current[selectedListItemRef]?.focus();
        setSelectedAgent(null);
      }}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 justify-between">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            {t("change")}
          </h2>
          <div>
            {loadingEdit && (
              <MyLoading containerClass="h-16" spinnerClass="w-5 h-5" />
            )}
          </div>
        </div>

        {/* Partner name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("changePartnerName")}
          </label>
          <MyInput
            ref={editInputRef}
            disabled={loadingEdit}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder={t("enterPartnerName")}
            className="w-full focus:ring-2 focus:ring-blue-500"
            onKeyDown={handleEditKeyDown}
          />
        </div>

        {/* Partner type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("changePartnerType")}
          </label>
          <div className="flex gap-4">
            {["klient", "supplier", "both"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  ref={(el) => (refUpdateRadioInput.current[type] = el)}
                  disabled={loadingEdit}
                  type="radio"
                  value={type}
                  checked={editType === type}
                  onChange={(e) => setEditType(e.target.value)}
                  className="text-blue-500 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      agentInputRef.current?.focus();
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      editInputRef.current?.focus();
                    }
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (!selectedAgent && editAgent) {
                        console.log("editAgent", editAgent);

                        showNotification(t("agentNotFound"), "error");
                      } else {
                        updatePartner();
                      }
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

        {/* Agent search input */}
        <div className="mb-6 relative" ref={wrapperRef}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("agent")}
          </label>
          <MyInput
            ref={agentInputRef}
            type="text"
            value={editAgent || ""}
            onChange={(e) => {
              setEditAgent(e.target.value);
              setSelectedAgent(null);
              setShowAgentDropdown(true);
              setFilteredAgents([]);
            }}
            placeholder={t("addAgent")}
            className="w-full focus:ring-2 focus:ring-blue-500"
            disabled={loadingEdit}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                refUpdateRadioInput.current["supplier"]?.focus();
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                console.log(
                  "Key pressed:",
                  e.key,
                  "filteredAgents.length:",
                  filteredAgents.length
                );
                if (filteredAgents.length > 0) {
                  console.log("agentItemRefs", agentItemRefs);

                  agentItemRefs.current[0]?.focus();
                } else {
                  refUpdateCancelButton.current?.focus();
                }
              }

              if (e.key === "Enter") {
                e.preventDefault();
                if (!selectedAgent && editAgent) {
                  console.log("editAgent", editAgent);

                  showNotification(t("agentNotFound"), "error");
                } else {
                  updatePartner();
                }
              }
            }}
          />

          {showAgentDropdown && filteredAgents.length > 0 && (
            <ul className="absolute z-20 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded mt-1 max-h-40 overflow-y-auto w-full shadow-md">
              {filteredAgents.map((agent, index) => (
                <li
                  key={agent.id}
                  ref={(el) => (agentItemRefs.current[index] = el)}
                  tabIndex={0}
                  className="px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:bg-blue-400 dark:focus:bg-blue-800 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedAgent(agent);
                    setEditAgent(agent.name);
                    setFilteredAgents([]);
                    agentInputRef.current?.focus();
                    setShowAgentDropdown(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      agentItemRefs.current[index + 1]?.focus();
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      if (index === 0) {
                        agentInputRef.current?.focus();
                      } else {
                        agentItemRefs.current[index - 1]?.focus();
                      }
                    }
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setSelectedAgent(agent);
                      setEditAgent(agent.name);
                      setFilteredAgents([]);
                      agentInputRef.current?.focus();
                      setShowAgentDropdown(false);
                    }
                  }}
                >
                  {agent.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <MyButton
            ref={refUpdateCancelButton}
            disabled={loadingEdit}
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
                agentInputRef.current?.focus();
              }
            }}
          >
            {t("cancel")}
          </MyButton>
          <MyButton
            ref={refUpdateSaveButton}
            variant="blue"
            onClick={() => {
              if (!selectedAgent && editAgent) {
                console.log("editAgent", editAgent);
                showNotification(t("agentNotFound"), "error");
              } else {
                updatePartner();
              }
            }}
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
  );
};

export default PartnerUpdateModal;
