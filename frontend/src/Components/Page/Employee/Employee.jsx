import { useRef, useState, useEffect, useMemo, useContext } from "react";
import { AuthContext } from "../../../AuthContext";
import { useTranslation } from "react-i18next";
import Fuse from "fuse.js";
import myAxios from "../../axios";
import Notification from "../../Notification";
import MyLoading from "../../UI/MyLoading";
import EmployeeDeleteModal from "./modals/EmployeeDeleteModal";
import EmployeeAddModal from "./modals/EmployeeAddModal";
import EmployeeEditModal from "./modals/EmployeeEditModal";
import EmployeeSearchAndAddSection from "./EmployeeSearchAndAddSection";
import EmployeeList from "./EmployeeList";
import { empDownloadExcel } from "./EmpDownloadExcel";
import { RiFileExcel2Fill } from "react-icons/ri";


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

  const [isAnimating, setIsAnimating] = useState(false);

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

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 300); // длина анимации 300мс
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <div className="p-2">
      {/* add Modal */}
      {openModalAdd && (
        <EmployeeAddModal
          setOpenModalAdd={setOpenModalAdd}
          addEmployee={addEmployee}
          loadingAdd={loadingAdd}
          addInputRef={addInputRef}
          newEmployee={newEmployee}
          setNewEmployee={setNewEmployee}
          handleAddKeyDown={handleAddKeyDown}
        />
      )}

      {/* delete Modal */}
      {openDeleteModal.open && (
        <EmployeeDeleteModal
          openDeleteModal={openDeleteModal}
          listItemRefs={listItemRefs}
          setOpenDeleteModal={setOpenDeleteModal}
          loadingDeleteId={loadingDeleteId}
          deleteCancelRef={deleteCancelRef}
          deleteOKRef={deleteOKRef}
          deleteEmployee={deleteEmployee}
        />
      )}

      {/* Edit Modal */}
      {openModal && selectedEmployee && (
        <EmployeeEditModal
          openModal={openModal}
          selectedEmployee={selectedEmployee}
          setOpenModal={setOpenModal}
          listItemRefs={listItemRefs}
          editInputRef={editInputRef}
          editName={editName}
          setEditName={setEditName}
          handleEditKeyDown={handleEditKeyDown}
          refCancelUpdateButton={refCancelUpdateButton}
          refUpdateButton={refUpdateButton}
          updateEmployee={updateEmployee}
          loadingEdit={loadingEdit}
        />
      )}

      <Notification
        message={t(notification.message)}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      <div className="lg:hidden text-center">
        <div className="flex justify-between items-center">
          <span className="print:block">{t("employeers")}</span>

          <div className="text-gray-600 dark:text-gray-400 flex items-center gap-3 print:hidden">
            {filtered.length > 0 && (
              <div className="flex gap-3 items-center">
                <span>
                  {search
                    ? `${t("found")}: ${filtered.length}`
                    : `${t("total")}: ${filtered.length}`}
                </span>

                <RiFileExcel2Fill
                  size={30}
                  className={`cursor-pointer rounded transition-transform duration-300 text-green-700 hover:text-green-600 ${
                    isAnimating ? "scale-125" : "scale-100"
                  }`}
                  onClick={() => {
                    empDownloadExcel(filtered, t);
                    setIsAnimating(true);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Download Excel"
                />
                
              </div>
            )}
            {/* <FaPrint className="text-blue-500 text-lg hover:text-xl hover:text-red-500 transition-all duration-100" /> */}
          </div>
        </div>

        <hr className="m-1" />
      </div>

      {/* Add and search Employee Section */}
      <EmployeeSearchAndAddSection
        filtered={filtered}
        search={search}
        setSearch={setSearch}
        clearSearch={clearSearch}
        handleSearchKeyDown={handleSearchKeyDown}
        setOpenModalAdd={setOpenModalAdd}
        addIconButtonRef={addIconButtonRef}
        searchInputRef={searchInputRef}
      />

      {/* Results Section employee List */}
      <EmployeeList
        employees={employees}
        loading={loading}
        filteredLength={filtered.length}
        loadMore={loadMore}
        hasMore={hasMore}
        t={t}
        search={search}
        clearSearch={clearSearch}
        listItemRefs={listItemRefs}
        handleListKeyDown={handleListKeyDown}
        selectedEmployeeState={[selectedEmployee, setSelectedEmployee]}
        setEditName={setEditName}
        setEditId={setEditId}
        setSelectedListItemRef={setSelectedListItemRef}
        setOpenModal={setOpenModal}
        loadingDeleteId={loadingDeleteId}
        setOpenDeleteModal={setOpenDeleteModal}
        loadMoreButtonRef={loadMoreButtonRef}
      />

      {loading && <MyLoading />}
    </div>
  );
};

export default Employee;
