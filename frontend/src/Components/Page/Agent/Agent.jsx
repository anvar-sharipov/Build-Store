import { useEffect, useRef, useState } from "react";
import myAxios from "../../axios";
import { useTranslation } from "react-i18next";
import MyModal from "../../UI/MyModal";
import SearchFuse from "../../common/SearchFuse";
import GenericList from "../../common/GenericList";
import AgentSearchAndAddSection from "./sections/AgentSearchAndAddSection";
import AgentAddModal from "./modals/agentAddModal";
import Notification from "../../Notification";

const Agent = () => {
  const { t } = useTranslation();
  const [agentList, setAgentList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const [openAddModal, setOpenAddModal] = useState(false);

  // add
  const [newAgent, setNewAgent] = useState("");
  const addInputRef = useRef(null);

  // notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  // window events
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Insert") {
        e.preventDefault();

        setOpenAddModal(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // get
  useEffect(() => {
    fetchAgents();
  }, []);

  // get
  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await myAxios.get("agents/");
      setAgentList(res.data);
    } catch (e) {
      console.error("Ошибка при загрузке agents:", e);
      showNotification(t("errorAgentList"), "error");
    } finally {
      setLoading(false);
    }
  };

  // add
  const handleAddAgent = async () => {
    if (!newAgent.trim()) {
      console.log("dadadadda");
      showNotification(t("agentCantBeEmpty"), "error");
      return;
    }
    setLoading(true);
    try {
      const res = await myAxios.post("agents/", { name: newAgent });
      setAgentList((prev) => [res.data.data, ...prev])
      showNotification(t("newAgentAdded"), "success")
    } catch {
      console.log("ne udalos dobawit");
    } finally {
      setLoading(false);
      setOpenAddModal(false);
      setNewAgent('')
    }
  };

  // add modal
  useEffect(() => {
    if (openAddModal) {
      addInputRef.current?.focus();
    } else {
    }
  }, [openAddModal]);

  return (
    <div className="p-2">
      <Notification
        message={t(notification.message)}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
      {/* add modal */}
      {openAddModal && (
        <AgentAddModal
          addInputRef={addInputRef}
          handleAddAgent={handleAddAgent}
          loading={loading}
          setLoading={setLoading}
          setOpenAddModal={setOpenAddModal}
          openAddModal={openAddModal}
          newAgent={newAgent}
          setNewAgent={setNewAgent}
          t={t}
        />
      )}

      <div>
        <AgentSearchAndAddSection
          t={t}
          data={agentList}
          searchKey={["name"]}
          onFiltered={setFilteredList}
          openAddModal={openAddModal}
          setOpenAddModal={setOpenAddModal}
        />
      </div>

      <div>
        <GenericList
          data={filteredList}
          renderItem={(item, index) => (
            <>
              {index + 1}. {item.name}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default Agent;
