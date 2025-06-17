import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import myAxios from "../../axios";
import { useTranslation } from "react-i18next";
import MyModal from "../../UI/MyModal";
import GenericList from "../../common/GenericList";
import AgentAddModal from "./modals/agentAddModal";
import Notification from "../../Notification";
import { IoIosAddCircleOutline } from "react-icons/io";
import Tooltip from "../../ToolTip";
import MyInput from "../../UI/MyInput";
import { RiFileExcel2Fill } from "react-icons/ri";
import AgentDeleteModal from "./modals/AgentDeleteModal";
import AgentEditModal from "./modals/AgentEditModal";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBin2Fill } from "react-icons/ri";
import MyLoading from "../../UI/MyLoading";

const Agent = () => {
  const { t } = useTranslation();
  const [agentList, setAgentList] = useState([]);
  // const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // loading
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [notification, setNotification] = useState({ message: "", type: "" });

  // modals
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState({
    open: false,
    data: null,
    index: null,
  });
  const [openEditModal, setOpenEditModal] = useState({
    open: false,
    data: null,
    index: null,
  });

  // add
  const [newAgent, setNewAgent] = useState("");
  const addInputRef = useRef(null);

  // add and search section
  // add icon
  const addIconRef = useRef(null);
  const [addIconHovered, setAddIconHovered] = useState(false);

  // useMemo
  const filteredList = useMemo(() => {
    if (!searchQuery) return agentList;
    return agentList.filter((agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [agentList, searchQuery]);

  // excel
  const excelIconRef = useRef(null);
  const [excelIconHovered, setExcelIconHovered] = useState(false);
  const [excelIconIsAnimating, setExcelIconIsAnimating] = useState(false);

  // search
  const searchInputRef = useRef(null);

  // ##############################################################################################################################################
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const loadMoreButtonRef = useRef(null);

  // Фокусируемые элементы списка
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const listItemRefs = useRef([]);

  // Для дебаунса клавиш
  const debounceRef = useRef(null);
  

  const listEndRef = useRef(null);
  

  const visibleItems = useMemo(() => {
    const start = 0;
    const end = currentPage * itemsPerPage;
    return filteredList.slice(start, end);
  }, [filteredList, currentPage, itemsPerPage]);

  useEffect(() => {
    setHasMore(visibleItems.length < filteredList.length);
  }, [visibleItems, filteredList]);

  // // Навешиваем обработчик только если нет модалей
  useEffect(() => {
    if (!openEditModal?.open && !openDeleteModal?.open && !openAddModal) {
      searchInputRef.current.focus();
    };
    
  }, [openEditModal?.open, openDeleteModal?.open, openAddModal]);


  // ##############################################################################################################################################

  useEffect(() => {
    searchInputRef.current?.focus();
  }, [t]);

  // excel
  const handleDownloadExcel = () => {
    setExcelIconIsAnimating(true);
  };
  useEffect(() => {
    if (excelIconIsAnimating) {
      const timer = setTimeout(() => setExcelIconIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [excelIconIsAnimating]);

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

  useEffect(() => {
    if (openAddModal) {
      // маленькая задержка, чтобы DOM успел обновиться
      setTimeout(() => {
        addInputRef.current?.focus();
      }, 0);
    }
  }, [openAddModal]);

  // get
  useEffect(() => {
    setTimeout(() => {
      fetchAgents();
    }, 0);
  }, []);

  // get
  const fetchAgents = async () => {
    setLoading(true);
    // await new Promise((r) => setTimeout(r, 100));
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
      setAgentList((prev) => [res.data.data, ...prev]);
      showNotification(t("newAgentAdded"), "success");
    } catch {
      console.log("ne udalos dobawit");
    } finally {
      setLoading(false);
      setOpenAddModal(false);
      setNewAgent("");
      searchInputRef.current?.focus();
    }
  };

  // delete
  const handleDeleteAgent = async (id) => {
    setLoadingDelete(true);
    try {
      await myAxios.delete(`agents/${id}/`);
      setAgentList((prev) => {
        return prev.filter((agent) => agent.id !== id);
      });
      showNotification(t("agentDeleted"), "success");
    } catch (e) {
    } finally {
      setLoadingDelete(false);
      setOpenDeleteModal({ open: false, data: null, index: null });
      searchInputRef.current?.focus();
    }
  };

  // edit
  const handleEditAgent = async (id, newName) => {
    setLoadingEdit(true);
    if (!newName.trim()) {
      showNotification("ne mogu", "error");
    }
    try {
      const res = await myAxios.put(`agents/${id}/`, { name: newName });
      showNotification(t("agentEdited"), "success");
      setAgentList((prev) => {
        return prev.map((p) => (p.id === id ? res.data : p));
      });
    } catch (error) {
      showNotification(res.data.message, "error");
    } finally {
      setLoadingEdit(false);
      setOpenEditModal({ open: false, data: null, index: null });
    }
  };


  const prevHasMoreRef = useRef(true);

useEffect(() => {
  if (prevHasMoreRef.current && !hasMore) {
    // Кнопка исчезла → фокус на последний li
    const lastIndex = visibleItems.length - 1;
    listItemRefs.current[lastIndex]?.focus();
  }
  prevHasMoreRef.current = hasMore;
}, [hasMore, visibleItems.length]);
 

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

      {/* delete modal */}
      {openDeleteModal.open && (
        <AgentDeleteModal
          handleDeleteAgent={handleDeleteAgent}
          setLoadingDelete={setLoadingDelete}
          loadingDelete={loadingDelete}
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
          t={t}
        />
      )}

      {/* edit modal */}
      {openEditModal.open && (
        <AgentEditModal
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          loadingEdit={loadingEdit}
          setLoadingEdit={setLoadingEdit}
          handleEditAgent={handleEditAgent}
          t={t}
        />
      )}

      {/* add and search section */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md p-1 mb-2 flex items-center justify-between px-2 print:hidden">
        <div>
          <button
            ref={addIconRef}
            onMouseEnter={() => setAddIconHovered(true)}
            onMouseLeave={() => setAddIconHovered(false)}
            className="text-2xl text-green-500 hover:text-green-600 transition-colors"
            onClick={() => setOpenAddModal(true)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                searchInputRef.current.focus()
              }
            }}
          >
            <IoIosAddCircleOutline />
          </button>
          <Tooltip visible={addIconHovered} targetRef={addIconRef}>
            {t("addAgent")} (INSERT)
          </Tooltip>
        </div>

        <div className="text-gray-600 dark:text-gray-400 hidden lg:flex items-center gap-3">
          <div>
            {filteredList.length > 0 && (
              <div className="flex gap-3 items-center">
                <span>
                  {t("total")}: {filteredList.length}
                </span>
                <RiFileExcel2Fill
                  size={30}
                  className={`cursor-pointer rounded transition-transform duration-300 text-green-700 hover:text-green-600 ${
                    excelIconIsAnimating ? "scale-125" : "scale-100"
                  }`}
                  ref={excelIconRef}
                  onClick={handleDownloadExcel}
                  onMouseEnter={() => setExcelIconHovered(true)}
                  onMouseLeave={() => setExcelIconHovered(false)}
                />
              </div>
            )}
            <Tooltip visible={excelIconHovered} targetRef={excelIconRef}>
              {t("downloadExcel")} (CTRL+E)
            </Tooltip>
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-grow relative">
            <input
              ref={searchInputRef}
              className="w-full h-7 px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  addIconRef.current?.focus();
                } if (e.key === "ArrowDown" && filteredList.length > 0) {
                  e.preventDefault();
                  listItemRefs.current[0]?.focus();
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <MyLoading />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="border border-gray-300 dark:border-gray-600 rounded-sm overflow-hidden">
          <ul className="divide-y divide-gray-300 dark:divide-gray-600">
            {visibleItems.map((item, index) => (
              <li
                key={item.id}
                ref={(el) => (listItemRefs.current[index] = el)}
                tabIndex={0}
                onClick={() => setFocusedIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === "Delete") {
                    e.preventDefault();
                    setOpenDeleteModal({ open: true, data: item, index });
                  } else if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenEditModal({ open: true, data: item, index });
                  } else if (e.key === "ArrowDown" && index + 1 < visibleItems.length) {
                    e.preventDefault()
                    listItemRefs.current[index+1]?.focus();
                  } else if (e.key === "ArrowUp" && index !== 0) {
                    e.preventDefault()
                    listItemRefs.current[index-1]?.focus();
                  } else if (e.key === "ArrowUp" && index === 0) {
                    e.preventDefault()
                    searchInputRef.current?.focus();
                  } else if (e.key === "ArrowDown" && index + 1 === visibleItems.length) {
                    e.preventDefault()
                    loadMoreButtonRef.current?.focus();
                  }
                }}
                className={`grid grid-cols-[auto_1fr_auto] px-4 transition-colors cursor-pointer 
                      hover:bg-gray-300 dark:hover:bg-gray-700 
                      focus:outline-none focus:ring-2 focus:bg-blue-400 dark:focus:bg-blue-800`}
              >
                <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  {index + 1}.
                </div>
                <div className="font-medium text-gray-800 dark:text-gray-200 truncate">
                  {item.name}
                </div>
                <div className="flex gap-1 justify-end">
                  <button
                    className="p-1 text-gray-800 hover:text-green-700 hover:bg-green-200 dark:hover:bg-green-700 rounded transition-colors dark:text-green-500 print:hidden"
                    onClick={() =>
                      setOpenEditModal({ open: true, data: item, index })
                    }
                  >
                    <GrEdit size={14} />
                  </button>
                  <button
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-200 dark:hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors print:hidden"
                    onClick={() =>
                      setOpenDeleteModal({ open: true, data: item, index })
                    }
                  >
                    <RiDeleteBin2Fill size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {hasMore && (
          <div className="px-4 py-1 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-center">
            <button
              ref={loadMoreButtonRef}
              className="text-blue-500 hover:text-blue-700 hover:underline font-medium px-4 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setCurrentPage((prev) => prev + 1);
                  // Опционально: можно установить фокус на первый новый элемент
                  // listItemRefs.focus(visibleItems.length);
                } else if (e.key === "ArrowUp") {
                  listItemRefs.current[visibleItems.length - 1].focus();
                }
              }}
            >
              {t("loadMore")}
            </button>
          </div>
        )}
      </div>
      )}
      

    </div>
  );
};

export default Agent;
