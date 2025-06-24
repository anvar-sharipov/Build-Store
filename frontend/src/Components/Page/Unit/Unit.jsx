import { div } from "framer-motion/client";
import myAxios from "../../axios";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { myClass } from "../../tailwindClasses";
import { IoIosAddCircleOutline } from "react-icons/io";
import Tooltip from "../../ToolTip";
import MyModal from "../../UI/MyModal";
import UnitAddModal from "./modals/UnitAddModal";
import Notification from "../../Notification";
import UnitDeleteModal from "./modals/UnitDeleteModal";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBin2Fill } from "react-icons/ri";
import UnitEditModal from "./modals/unitEditModal";

const Unit = () => {
  const [units, setUnits] = useState([]);
  const { t } = useTranslation();
  const addIconRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const [addIconHovered, setAddIconHovered] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState({
    open: false,
    data: null,
  });
  const listItemRefs = useRef([]);
  const [newUnit, setNewUnit] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const editIconRefs = useRef([]);
  const [hoveredEditIndex, setHoveredEditIndex] = useState(null);
  const addIconHoverTimeout = useRef(null);
  const editIconHoverTimeout = useRef(null);
  const deleteIconHoverTimeout = useRef(null);
  const [openEditModal, setOpenEditModal] = useState({
    open: false,
    data: null,
    index: null,
  });
  const deleteIconRefs = useRef([]);
  const [hoveredDeleteIndex, setHoveredDeleteIndex] = useState(null);

  useEffect(() => {
    document.title = t("unit");
  }, []);

  useEffect(() => {
    if (!openDeleteModal.open && !openAddModal && !openEditModal.open) {
      addIconRef.current?.focus();
    }
  }, [openDeleteModal, openAddModal, openEditModal]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await myAxios.get("units/");
        setUnits(res.data);
      } catch (e) {
        console.log("errorr", e);
      } finally {
        addIconRef.current?.focus();
      }
    };
    fetchUnits();
  }, []); // Добавь [] чтобы useEffect выполнился только один раз при монтировании

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
      } else if (e.ctrlKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        // handleDownloadExcel();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleAddUnit = async (data) => {
    setLoading(true);
    try {
      const res = await myAxios.post("units/", { name: data });
      setUnits((prev) => [res.data, ...prev]);
      showNotification(t("newUnitAdded"), "success");
      setNewUnit("");
      setOpenAddModal(false);
    } catch (e) {
      showNotification(`error ${e}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUnit = async (id) => {
    setLoading(true);
    try {
      const res = await myAxios.delete(`units/${id}/`);
      setUnits((prev) => {
        return prev.filter((unit) => unit.id !== id);
      });
      showNotification(t("unitDeleted"), "success");
      setOpenDeleteModal({ open: false, data: null });
    } catch (e) {
      showNotification(t(`error ${e}`, "error"));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUnit = async (updatedUnit, id) => {
    if (!updatedUnit.trim()) {
      showNotification(t("inputCantBeEmpty"), "error");
      return;
    }
    setLoading(true);
    try {
      const res = await myAxios.put(`units/${id}/`, { name: updatedUnit });
      showNotification(t("unitEdited"), "success");
      setUnits((prev) => {
        return prev.map((p) => (p.id === id ? res.data : p));
      });
    } catch (e) {
      showNotification("editLoadError", "error");
    } finally {
      setLoading(false);
      setOpenEditModal({ open: false, data: null, index: null });
    }
  };

  return (
    <div>
      <Notification
        message={t(notification.message)}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      <div className="lg:hidden text-center">
        <div className="flex justify-between items-center">
          <span className="print:block">{t("unit")}</span>
          <div className="text-gray-600 dark:text-gray-400 flex items-center gap-3 print:hidden">
            {units.length > 0 && (
              <div className="flex gap-3 items-center">
                <span>
                  {t("total")} {units.length}
                </span>
              </div>
            )}
            {/* <FaPrint className="text-blue-500 text-lg hover:text-xl hover:text-red-500 transition-all duration-100" /> */}
          </div>
          <div>
            <button
              ref={addIconRef}
              onMouseEnter={() => {
                hoverTimeoutRef.current = setTimeout(() => {
                  setAddIconHovered(true);
                }, 500);
              }}
              onMouseLeave={() => {
                clearTimeout(hoverTimeoutRef.current);
                setAddIconHovered(false);
              }}
              className={myClass.addButton}
              onClick={() => setOpenAddModal(true)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (listItemRefs.current[0]) {
                    setTimeout(() => {
                      listItemRefs.current[0]?.focus();
                    }, 50);
                  }
                }
              }}
            >
              <IoIosAddCircleOutline size={20} />
            </button>
            <Tooltip visible={addIconHovered} targetRef={addIconRef}>
              {t("addUnit")} (INSERT)
            </Tooltip>
          </div>
        </div>

        <hr className="m-1" />
      </div>

      {openDeleteModal.open && (
        <UnitDeleteModal
          setOpenDeleteModal={setOpenDeleteModal}
          openDeleteModal={openDeleteModal}
          t={t}
          handleDeleteUnit={handleDeleteUnit}
          loading={loading}
        />
      )}
      {openAddModal && (
        <UnitAddModal
          loading={loading}
          newUnit={newUnit}
          setNewUnit={setNewUnit}
          handleAddUnit={handleAddUnit}
          setOpenAddModal={setOpenAddModal}
          openAddModal={openAddModal}
          units={units}
          t={t}
        />
      )}
      {openEditModal.open && (
        <UnitEditModal
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          t={t}
          handleUpdateUnit={handleUpdateUnit}
          loading={loading}
          units={units}
        />
      )}
      <div className="hidden lg:block">
        <div className="flex justify-between">
          <button
            ref={addIconRef}
            onMouseEnter={() => {
              hoverTimeoutRef.current = setTimeout(() => {
                setAddIconHovered(true);
              }, 500);
            }}
            onMouseLeave={() => {
              clearTimeout(hoverTimeoutRef.current);
              setAddIconHovered(false);
            }}
            className={myClass.addButton}
            onClick={() => setOpenAddModal(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                if (listItemRefs.current[0]) {
                  setTimeout(() => {
                    listItemRefs.current[0]?.focus();
                  }, 50);
                }
              }
            }}
          >
            <IoIosAddCircleOutline size={20} />
          </button>
          <span>
            {t("total")} {units.length}
          </span>
        </div>

        <Tooltip visible={addIconHovered} targetRef={addIconRef}>
          {t("addUnit")} (INSERT)
        </Tooltip>
      </div>

      {units.length > 0 ? (
        <ul className={myClass.ul}>
          {units.map((unit, index) => (
            <li
              key={unit.id}
              className={myClass.li}
              ref={(el) => (listItemRefs.current[index] = el)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" && index < units.length - 1) {
                  e.preventDefault();
                  listItemRefs.current[index + 1]?.focus();
                } else if (e.key === "ArrowUp" && index > 0) {
                  e.preventDefault();
                  listItemRefs.current[index - 1]?.focus();
                } else if (e.key === "ArrowUp" && index === 0) {
                  e.preventDefault();
                  addIconRef.current?.focus();
                } else if (e.key === "Delete") {
                  e.preventDefault();
                  setOpenDeleteModal({ open: true, data: unit });
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  setOpenEditModal({ open: true, data: unit, index: index });
                }
              }}
            >
              {index + 1}. {unit.name}
              <div className="flex gap-1 justify-end">
                <button
                  ref={(el) => (editIconRefs.current[index] = el)}
                  onMouseEnter={() => {
                    hoverTimeoutRef.current = setTimeout(() => {
                      setHoveredEditIndex(index);
                    }, 500);
                  }}
                  onMouseLeave={() => {
                    clearTimeout(hoverTimeoutRef.current);
                    setHoveredEditIndex(null);
                  }}
                  className="p-1 text-gray-800 hover:text-green-700 hover:bg-green-200 dark:hover:bg-green-700 rounded transition-colors dark:text-green-500 print:hidden"
                  onClick={() =>
                    setOpenEditModal({ open: true, data: unit, index })
                  }
                >
                  <GrEdit size={14} />
                </button>
                <button
                  ref={(el) => (deleteIconRefs.current[index] = el)}
                  onMouseEnter={() => {
                    hoverTimeoutRef.current = setTimeout(() => {
                      setHoveredDeleteIndex(index);
                    }, 500);
                  }}
                  onMouseLeave={() => {
                    clearTimeout(hoverTimeoutRef.current);
                    setHoveredDeleteIndex(null);
                  }}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-200 dark:hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors print:hidden"
                  onClick={() =>
                    setOpenDeleteModal({ open: true, data: unit, index })
                  }
                >
                  <RiDeleteBin2Fill size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            {t("empty")}
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            {t("addFirstUnit")}
          </p>
        </div>
      )}
      <Tooltip
        visible={hoveredEditIndex !== null}
        targetRef={{
          current: editIconRefs.current[hoveredEditIndex],
        }}
      >
        {t("edit")} (ENTER)
      </Tooltip>
      <Tooltip
        visible={hoveredDeleteIndex !== null}
        targetRef={{
          current: deleteIconRefs.current[hoveredDeleteIndex],
        }}
      >
        {t("delete")} (DELETE)
      </Tooltip>
    </div>
  );
};

export default Unit;
