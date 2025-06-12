import { useRef, useState, useEffect, useMemo, useContext } from "react";
import { AuthContext } from "../../../AuthContext";
import { useTranslation } from "react-i18next";
import { CiSearch } from "react-icons/ci";
import { FcPlus } from "react-icons/fc";
import Fuse from "fuse.js";
import myAxios from "../../axios";

import MyInput from "../../UI/MyInput";
import MyButton from "../../UI/MyButton";
import ThemeToggle from "../../ThemeToggle";
import MyModal from "../../UI/MyModal";
import Notification from "../../Notification";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import { IoIosAddCircleOutline } from "react-icons/io";
import MyLoading from "../../UI/MyLoading";
import { CiNoWaitingSign } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { FaPrint } from "react-icons/fa6";

const Employee = () => {
  const { t } = useTranslation();
  const [notification, setNotification] = useState({ message: "", type: "" });

  const { authUser, authGroup } = useContext(AuthContext);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const [employeesRaw, setEmployeesRaw] = useState([]);
  const [newEmployee, setNewEmployee] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModalAdd, setOpenModalAdd] = useState(false);

  const [selectedListItemRef, setSelectedListItemRef] = useState("");
  const addIconButtonRef = useRef(null);

  const itemsPerPage = 10;

  const addInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const listItemRefs = useRef([]);
  const loadMoreButtonRef = useRef(null);
  const editInputRef = useRef(null);

  // ref
  const refCancelUpdateButton = useRef(null);
  const refUpdateButton = useRef(null);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");

  // modal delete
  const deleteOKRef = useRef(null);
  const deleteCancelRef = useRef(null);
  const [openDeleteModal, setOpenDeleteModal] = useState({
    open: false,
    data: null,
    index: null,
  });

  useEffect(() => {
    document.title = t("employeers");
    searchInputRef.current?.focus();
  }, [t]);

  useEffect(() => {
    if (openModalAdd) {
      setTimeout(() => {
        addInputRef.current?.focus();
        addInputRef.current?.select(); // Select all text for easy editing
      }, 100);
    } else {
      searchInputRef.current?.focus();
    }
  }, [openModalAdd]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Insert") {
        e.preventDefault();

        setOpenModalAdd(true);
      }
      if (e.key === "Escape" && openModal) {
        setOpenModal(false);
        listItemRefs.current[selectedListItemRef]?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openModal, selectedListItemRef]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await myAxios.get("employeers/");
      setEmployeesRaw(res.data);
    } catch (e) {
      console.error("Ошибка при загрузке:", e);
      showNotification("employeeLoadError", "error");
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async () => {
    if (!newEmployee.trim()) {
      showNotification("employeeNameRequired", "error");
      return;
    }

    setLoadingAdd(true);
    try {
      const res = await myAxios.post("employeers/", { name: newEmployee });
      setEmployeesRaw((prev) => [res.data.employee || res.data, ...prev]);
      showNotification("newEmployeeAdded", "success");
      setNewEmployee("");
      setCurrentPage(1); // Reset to first page to show new employee
    } catch (e) {
      console.error("Ошибка при добавлении:", e);
      showNotification("newEmployeeAddedError", "error");
    } finally {
      setLoadingAdd(false);
      searchInputRef.current?.focus();
      setOpenModalAdd(false);
    }
  };

  const fuse = useMemo(
    () =>
      new Fuse(employeesRaw, {
        keys: ["name"],
        threshold: 0.3,
        ignoreLocation: true,
        includeScore: true,
      }),
    [employeesRaw]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return employeesRaw;
    return fuse.search(search).map((r) => r.item);
  }, [search, fuse, employeesRaw]);

  const employees = filtered.slice(0, currentPage * itemsPerPage);
  const hasMore = filtered.length > employees.length;

  const deleteEmployee = async (id, name) => {
    // if (!confirm(t("deleteEmployee", { name }))) return;
    setLoadingDeleteId(id);
    // searchInputRef.current?.focus();

    try {
      await myAxios.delete(`employeers/${id}/`);
      showNotification("employeeDeleted", "success");
      setEmployeesRaw((prev) => prev.filter((employee) => employee.id !== id));
      setCurrentPage(1); // Reset pagination after delete
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      showNotification("employeeNotDeleted", "error");
    } finally {
      setLoadingDeleteId(null);
      searchInputRef.current?.focus();
      setOpenDeleteModal({
        open: false,
        data: null,
        index: null,
      });
    }
  };

  const updateEmployee = async () => {
    if (!editName.trim()) {
      showNotification("employeeNameRequired", "error");
      return;
    }

    setLoadingEdit(true);
    try {
      const res = await myAxios.put(`employeers/${editId}/`, {
        name: editName,
      });
      showNotification("employeeUpdated", "success");
      setEmployeesRaw((prev) =>
        prev.map((s) => (s.id === editId ? res.data : s))
      );
      setOpenModal(false);
      listItemRefs.current[selectedListItemRef]?.focus();
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
      showNotification("employeeUpdateError", "error");
    } finally {
      setLoadingEdit(false);
    }
  };

  useEffect(() => {
    if (openModal) {
      setTimeout(() => {
        editInputRef.current?.focus();
        editInputRef.current?.select(); // Select all text for easy editing
      }, 100);
    }
  }, [openModal]);

  useEffect(() => {
    if (openDeleteModal.open) {
      setTimeout(() => {
        deleteOKRef.current?.focus();
      }, 50); // Небольшая задержка, чтобы дать модалке отрендериться
    }
  }, [openDeleteModal.open]);

  const handleListKeyDown = (e, i, s) => {
    if (e.key === "Delete") {
      e.preventDefault();
      setOpenDeleteModal({ open: true, data: s, index: i });
      console.log("yayayayaya", openDeleteModal);

      // if (!loadingDeleteId) deleteEmployee(s.id, s.name);
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedEmployee(s);
      setOpenModal(true);
      setSelectedListItemRef(i);
      setEditName(s.name);
      setEditId(s.id);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (i + 1 < employees.length) {
        listItemRefs.current[i + 1]?.focus();
      } else if (hasMore) {
        loadMoreButtonRef.current?.focus();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (i === 0) {
        searchInputRef.current?.focus();
      } else {
        listItemRefs.current[i - 1]?.focus();
      }
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (employees.length > 0) {
        listItemRefs.current[0]?.focus();
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      // addInputRef.current?.focus();

      addIconButtonRef.current?.focus();
    }
    if (e.key === "Escape" && search) {
      setSearch("");
    }
  };

  const handleAddKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmployee();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
    if (e.key === "Escape") {
      setNewEmployee("");
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateEmployee();
    }
    if (e.key === "Escape") {
      setOpenModal(false);
      listItemRefs.current[selectedListItemRef]?.focus();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      refCancelUpdateButton.current?.focus();
    }
  };

  const loadMore = () => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + 1;
      setTimeout(() => {
        const newItemIndex = (newPage - 1) * itemsPerPage;
        if (listItemRefs.current[newItemIndex]) {
          listItemRefs.current[newItemIndex].focus();
        }
      }, 100);
      return newPage;
    });
    // Focus on first new item after loading
  };

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
    searchInputRef.current?.focus();
  };

  return (
    <div className="p-2">
      {openModalAdd ? (
        <MyModal
          onClose={() => {
            setOpenModalAdd(false);
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
              {t("addNewEmployee")}
            </h2>
            <div className="flex items-end gap-3">
              <button
                onClick={addEmployee}
                disabled={loadingAdd}
                className="text-4xl text-green-500 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={t("addEmployee")}
              >
                {loadingAdd ? (
                  <CiNoWaitingSign className="animate-spin" />
                ) : (
                  <IoIosAddCircleOutline />
                )}
              </button>
              <MyInput
                ref={addInputRef}
                name="new_employee"
                type="text"
                value={newEmployee}
                onChange={(e) => setNewEmployee(e.target.value)}
                placeholder={`${t("addNewEmployee")}...`}
                className="flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 dark:focus:bg-gray-700"
                onKeyDown={handleAddKeyDown}
                disabled={loadingAdd}
              />
            </div>
          </div>
        </MyModal>
      ) : (
        <div></div>
      )}
      {openDeleteModal.open && (
        <MyModal
          onClose={() => {
            listItemRefs.current[openDeleteModal.index]?.focus();
            setOpenDeleteModal({
              open: false,
              data: null,
              index: null,
            });
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
              <span>{t("deleteEmployee")}</span>
            </h2>
            <div className="mb-4">{openDeleteModal.data.name}</div>
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
                  listItemRefs.current[openDeleteModal.index]?.focus();
                  setOpenDeleteModal({
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
                  deleteEmployee(
                    openDeleteModal.data.id,
                    openDeleteModal.data.name
                  )
                }
                // disabled={loadingEdit}
                className="min-w-[100px]"
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") {
                    deleteCancelRef.current?.focus();
                  }
                }}
              >
                {t("save")}
              </MyButton>
            </div>
          </div>
        </MyModal>
      )}

      <Notification
        message={t(notification.message)}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      <div className="lg:hidden text-center">
        <div className="flex justify-between">
          <span>{t("employeers")}</span>

          <div className="text-gray-600 dark:text-gray-400 flex items-center gap-3">
            {filtered.length > 0 && (
              <span>
                {search
                  ? `${t("found")}: ${filtered.length}`
                  : `${t("total")}: ${filtered.length}`}
              </span>
            )}
            <FaPrint className="text-blue-500 text-lg hover:text-xl hover:text-red-500 transition-all duration-100" />
          </div>
        </div>

        <hr className="m-1" />
      </div>

      {/* Add and search Employee Section */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md p-1 mb-2 flex items-center justify-between px-2">
        <button
          className="text-2xl text-green-500 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => setOpenModalAdd(true)}
          ref={addIconButtonRef}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              searchInputRef.current?.focus();
            }
          }}
        >
          <IoIosAddCircleOutline />
        </button>

        <div className="text-gray-600 dark:text-gray-400 hidden lg:flex items-center gap-3">
          <div>
            {filtered.length > 0 && (
              <span>
                {search
                  ? `${t("found")}: ${filtered.length}`
                  : `${t("total")}: ${filtered.length}`}
              </span>
            )}
          </div>
          <FaPrint className="text-blue-500 text-lg hover:text-xl hover:text-red-500 transition-all duration-100" />
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-grow relative">
            <MyInput
              ref={searchInputRef}
              name="search_employee"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search")}
              className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 dark:focus:bg-gray-700 h-7"
              onKeyDown={handleSearchKeyDown}
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl font-bold"
                title={t("clearSearch")}
              >
                ×
              </button>
            )}
          </div>
          <button
            onClick={() => searchInputRef.current?.focus()}
            className="text-2xl text-blue-500 hover:text-blue-600 transition-colors"
            title={t("search")}
          >
            <CiSearch />
          </button>
        </div>
      </div>

      {/* Results Section */}
      {employees.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="border border-gray-300 dark:border-gray-600 rounded-sm overflow-hidden">
            {/* Строки */}
            <ul className="divide-y divide-gray-300 dark:divide-gray-600">
              {employees.map((s, index) => (
                <li
                  key={s.id}
                  tabIndex={0}
                  ref={(el) => (listItemRefs.current[index] = el)}
                  onKeyDown={(e) => handleListKeyDown(e, index, s)}
                  className="grid grid-cols-[auto_1fr_auto] px-4 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:bg-blue-400 dark:focus:bg-blue-800 transition-colors cursor-pointer"
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {index + 1}.
                  </div>
                  <div className="font-medium text-gray-800 dark:text-gray-200 truncate">
                    {s.name}
                  </div>
                  <div className="flex gap-1 justify-end">
                    <button
                      className={`p-1 text-gray-800 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-700 rounded transition-colors dark:text-green-500 ${
                        loadingDeleteId === s.id && "opacity-0"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmployee(s);
                        setEditName(s.name);
                        setEditId(s.id);
                        setSelectedListItemRef(index);
                        setOpenModal(true);
                      }}
                      title={t("editEmployee")}
                    >
                      <GrEdit size={14} />
                    </button>
                    <button
                      disabled={loadingDeleteId === s.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDeleteModal({
                          open: true,
                          data: s,
                          index: index,
                        });
                      }}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                      title={
                        loadingDeleteId === s.id
                          ? t("deletingEmployee")
                          : t("deleteEmployee")
                      }
                      aria-busy={loadingDeleteId === s.id}
                    >
                      {loadingDeleteId === s.id ? (
                        <CiNoWaitingSign className="animate-spin" size={14} />
                      ) : (
                        <RiDeleteBin2Fill size={14} />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {hasMore && (
            <div className="px-4 py-1 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-center">
              <button
                className="text-blue-500 hover:text-blue-700 hover:underline font-medium px-4 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                ref={loadMoreButtonRef}
                tabIndex={0}
                onClick={loadMore}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    listItemRefs.current[employees.length - 1]?.focus();
                  } else if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    loadMore();
                  }
                }}
              >
                {t("loadMore")} ({filtered.length - employees.length})
              </button>
            </div>
          )}
        </div>
      ) : (
        !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {search ? t("noSearchResults") : t("empty")}
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {search ? t("tryDifferentSearch") : t("addFirstEmployee")}
            </p>
            {search && (
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                {t("clearSearch")}
              </button>
            )}
          </div>
        )
      )}

      {/* Edit Modal */}
      {openModal && selectedEmployee && (
        <MyModal
          onClose={() => {
            setOpenModal(false);
            listItemRefs.current[selectedListItemRef]?.focus();
          }}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              {t("editEmployee")}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("editEmployee")}
              </label>
              <MyInput
                ref={editInputRef}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder={t("addNewEmployee")}
                className="w-full focus:ring-2 focus:ring-blue-500"
                onKeyDown={handleEditKeyDown}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
              <MyButton
                ref={refCancelUpdateButton}
                variant="blue"
                onClick={() => {
                  setOpenModal(false);
                  listItemRefs.current[selectedListItemRef]?.focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    refUpdateButton.current?.focus();
                  }
                  if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    editInputRef.current?.focus();
                  }
                }}
              >
                {t("cancel")}
              </MyButton>
              <MyButton
                ref={refUpdateButton}
                variant="blue"
                onClick={updateEmployee}
                disabled={loadingEdit}
                className="min-w-[100px]"
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    refCancelUpdateButton.current?.focus();
                  }
                }}
              >
                {loadingEdit ? (
                  <span className="flex items-center gap-2">
                    <CiNoWaitingSign className="animate-spin" />
                    {t("saving")}
                  </span>
                ) : (
                  t("change")
                )}
              </MyButton>
            </div>
          </div>
        </MyModal>
      )}

      {loading && <MyLoading />}
    </div>
  );
};

export default Employee;
