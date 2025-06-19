import MyModal from "../../../UI/MyModal";
import MyInput from "../../../UI/MyInput";
import { CiNoWaitingSign } from "react-icons/ci";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useState, useEffect, useRef } from "react";

const PartnerAddModal = ({
  showNotification,
  selectedAgent,
  setSelectedAgent,
  agentList,
  openModalAdd,
  setOpenModalAdd,
  t,
  radioRefs,
  partnerType,
  setPartnerType,
  addInputRef,
  addAgentInputRef,
  addPartner,
  loadingAdd,
  newPartner,
  setNewPartner,
  handleAddKeyDown,
}) => {
  const [agentQuery, setAgentQuery] = useState("");
  const [filteredAgents, setFilteredAgents] = useState([]);
  const agentItemRefs = useRef([]);

  const [choosedAgent, setChoosedAgent] = useState(false);

  // pri klike wse li skrywat li
  const wrapperRef = useRef(null);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  useEffect(() => {
    const handleFocusOut = (e) => {
      setTimeout(() => {
        if (!wrapperRef.current?.contains(document.activeElement)) {
          setShowAgentDropdown(false);
        }
      }, 100); // задержка нужна, чтобы успел перейти фокус
    };
    document.addEventListener("focusin", handleFocusOut);
    return () => document.removeEventListener("focusin", handleFocusOut);
  }, []);

  useEffect(() => {
    if (!agentQuery.trim()) {
      setFilteredAgents([]);
      return;
    }
    const filtered = agentList.filter((agent) =>
      agent.name.toLowerCase().includes(agentQuery.toLowerCase())
    );
    if (choosedAgent) {
      setChoosedAgent(false);
    } else {
      setFilteredAgents(filtered);
    }
  }, [agentQuery, agentList]);

  return (
    <MyModal
      onClose={() => {
        setOpenModalAdd(false);
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 flex flex-col gap-3">
        <div className="flex gap-2 items-center">
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
          <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300 mt-3">
            {t("addNewPartner")}
          </h2>
        </div>

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

        <div className="flex items-center gap-2">
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1 w-20">
            {t("partner")}
          </label>
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

        <div className="mb-4 relative">
          <div className="flex gap-2 items-center">
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1 w-20">
              {t("agent")}
            </label>
            <MyInput
              ref={addAgentInputRef}
              type="text"
              value={agentQuery}
              onChange={(e) => {
                setAgentQuery(e.target.value);
                setSelectedAgent(null);
                setShowAgentDropdown(true);
              }}
              placeholder={`${t("addAgent")}...`}
              className={`w-full focus:ring-2 focus:ring-blue-500`}
              disabled={loadingAdd}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  addInputRef.current?.focus();
                }
                if (e.key === "ArrowDown" && filteredAgents.length > 0) {
                  e.preventDefault();
                  agentItemRefs.current[0]?.focus();
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (agentQuery !== "" && selectedAgent?.id) {
                    addPartner();
                  } else {
                    showNotification(t("agentNotFound"), "error");
                  }
                }
              }}
            />
          </div>

          {showAgentDropdown && filteredAgents.length > 0 && (
            <ul className="absolute z-20 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded mt-1 max-h-40 overflow-y-auto w-full shadow-md">
              {filteredAgents.map((agent, index) => (
                <li
                  key={agent.id}
                  ref={(el) => (agentItemRefs.current[index] = el)}
                  tabIndex={0}
                  className="grid grid-cols-[auto_1fr_auto] px-4 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:bg-blue-400 dark:focus:bg-blue-800 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedAgent(agent);
                    setAgentQuery(agent.name);
                    setFilteredAgents([]);
                    addAgentInputRef.current?.focus();
                    setChoosedAgent(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      agentItemRefs.current[index + 1]?.focus();
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      if (index === 0) {
                        addAgentInputRef.current?.focus();
                      } else {
                        agentItemRefs.current[index - 1]?.focus();
                      }
                    }
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setSelectedAgent(agent);
                      setAgentQuery(agent.name);
                      setFilteredAgents([]);
                      addAgentInputRef.current?.focus();
                      setChoosedAgent(true);
                    }
                  }}
                >
                  {agent.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </MyModal>
  );
};

export default PartnerAddModal;
