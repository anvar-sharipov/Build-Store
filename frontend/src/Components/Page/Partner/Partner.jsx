import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState, useMemo } from "react";
import Fuse from "fuse.js";
import myAxios from "../../axios";
import MyLoading from "../../UI/MyLoading";
import MyInput from "../../UI/MyInput";
import MyButton from "../../UI/MyButton";
import MyModal from "../../UI/MyModal";
import Notification from "../../Notification";

import { IoIosAddCircleOutline } from "react-icons/io";
import { CiSearch, CiNoWaitingSign } from "react-icons/ci";
import { FaTruck, FaUser, FaExchangeAlt } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";

const TypeBadge = ({ type, text, typeText }) => {
  const styles = {
    supplier:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
    klient: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
    both: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  const icons = {
    supplier: <FaTruck className="inline mr-1" />,
    klient: <FaUser className="inline mr-1" />,
    both: <FaExchangeAlt className="inline mr-1" />,
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${styles[type]}`}
    >
      <div className="flex gap-2 items-center">
        <span>{typeText}</span>
        <span>{icons[type]}</span>
      </div>
    </span>
  );
};

const Partner = () => {
  const { t } = useTranslation();
  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const [partnersRaw, setPartnersRaw] = useState([]);
  const [newPartner, setNewPartner] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [partnerType, setPartnerType] = useState("supplier");
  const [selectedListItemRef, setSelectedListItemRef] = useState("");

  const itemsPerPage = 10;

  const [searchParams] = useSearchParams();
  const filterType = searchParams.get("type") || "all";

  // Refs
  const addInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const listItemRefs = useRef([]);
  const loadMoreButtonRef = useRef(null);
  const editInputRef = useRef(null);

  // Modal states
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("supplier");

  useEffect(() => {
    document.title = t("partners");
    searchInputRef.current?.focus();
  }, [t]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Insert") {
        e.preventDefault();
        addInputRef.current?.focus();
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
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await myAxios.get("partners/");
      setPartnersRaw(res.data);
    } catch (e) {
      console.error("Ошибка при загрузке:", e);
      showNotification("partnerLoadError", "error");
    } finally {
      setLoading(false);
    }
  };

  const addPartner = async () => {
    if (!newPartner.trim()) {
      showNotification("partnerNameRequired", "error");
      return;
    }

    setLoadingAdd(true);
    try {
      const res = await myAxios.post("partners/", {
        name: newPartner,
        type: partnerType,
      });
      setPartnersRaw((prev) => [res.data, ...prev]);
      showNotification("newPartnerAdded", "success");
      setNewPartner("");
      setPartnerType("supplier");
      setCurrentPage(1); // Reset to first page to show new partner
    } catch (e) {
      console.error("Ошибка при добавлении:", e);
      showNotification("newPartnerAddedError", "error");
    } finally {
      setLoadingAdd(false);
      searchInputRef.current?.focus();
    }
  };

  const deletePartner = async (id, name) => {
    if (!confirm(t("confirmDeletePartner", { name }))) return;

    setLoadingDeleteId(id);
    try {
      await myAxios.delete(`partners/${id}/`);
      showNotification(t("partnerDeleted"), "success");
      setPartnersRaw((prev) => prev.filter((partner) => partner.id !== id));
      setCurrentPage(1); // Reset pagination after delete
    } catch (error) {
      showNotification(t("partnerNotDeleted"), "error");
    } finally {
      setLoadingDeleteId(null);
      searchInputRef.current?.focus();
    }
  };

  const updatePartner = async () => {
    if (!editName.trim()) {
      showNotification("partnerNameRequired", "error");
      return;
    }

    setLoadingEdit(true);
    try {
      const res = await myAxios.put(`partners/${editId}/`, {
        name: editName,
        type: editType,
      });
      showNotification(t("partnerUpdated"), "success");
      setPartnersRaw((prev) =>
        prev.map((p) => (p.id === editId ? res.data : p))
      );
      setOpenModal(false);
      listItemRefs.current[selectedListItemRef]?.focus();
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
      showNotification("partnerUpdateError", "error");
    } finally {
      setLoadingEdit(false);
    }
  };

  // Fuse.js setup
  const fuse = useMemo(
    () =>
      new Fuse(partnersRaw, {
        keys: ["name"],
        threshold: 0.3,
        ignoreLocation: true,
        includeScore: true,
      }),
    [partnersRaw]
  );

  // Combined filtering
  const filteredPartners = useMemo(() => {
    let filtered = search
      ? fuse.search(search).map((r) => r.item)
      : partnersRaw;

    // Apply type filter from URL
    if (filterType !== "all") {
      filtered = filtered.filter((p) => p.type === filterType);
    }

    return filtered;
  }, [partnersRaw, filterType, search, fuse]);

  const partners = filteredPartners.slice(0, currentPage * itemsPerPage);
  const hasMore = filteredPartners.length > partners.length;

  useEffect(() => {
    if (openModal) {
      setTimeout(() => {
        editInputRef.current?.focus();
        editInputRef.current?.select();
      }, 100);
    }
  }, [openModal]);

  const handleListKeyDown = (e, i, p) => {
    if (e.key === "Delete") {
      e.preventDefault();
      if (!loadingDeleteId) deletePartner(p.id, p.name);
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedPartner(p);
      setOpenModal(true);
      setSelectedListItemRef(i);
      setEditName(p.name);
      setEditType(p.type);
      setEditId(p.id);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (i + 1 < partners.length) listItemRefs.current[i + 1]?.focus();
      else if (hasMore) loadMoreButtonRef.current?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (i === 0) searchInputRef.current?.focus();
      else listItemRefs.current[i - 1]?.focus();
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (partners.length > 0) {
        listItemRefs.current[0]?.focus();
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      addInputRef.current?.focus();
    }
    if (e.key === "Escape" && search) {
      setSearch("");
    }
  };

  const handleAddKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPartner();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
    if (e.key === "Escape") {
      setNewPartner("");
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updatePartner();
    }
    if (e.key === "Escape") {
      setOpenModal(false);
      listItemRefs.current[selectedListItemRef]?.focus();
    }
  };

  const loadMore = () => {
    setCurrentPage((p) => p + 1);
    // Focus on first new item after loading
    setTimeout(() => {
      const newItemIndex = currentPage * itemsPerPage;
      if (listItemRefs.current[newItemIndex]) {
        listItemRefs.current[newItemIndex].focus();
      }
    }, 100);
  };

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
    searchInputRef.current?.focus();
  };

  return (
    <div className="p-2">
      <Notification
        message={t(notification.message)}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          {t("partners")}
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredPartners.length > 0 && (
            <span>
              {search
                ? `${t("found")}: ${filteredPartners.length}`
                : `${t("total")}: ${filteredPartners.length}`}
            </span>
          )}
        </div>
      </div>

      {/* Add Partner Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
          {t("addNewPartner")}
        </h2>

        {/* Type selection for adding */}
        <div className="flex gap-4 mb-3">
          {["klient", "supplier", "both"].map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="radio"
                value={type}
                checked={partnerType === type}
                onChange={(e) => setPartnerType(e.target.value)}
                className="text-blue-500 focus:ring-blue-500"
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
            onKeyDown={handleAddKeyDown}
            disabled={loadingAdd}
          />
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
          {t("searchPartner")}
        </h2>
        <div className="flex items-end gap-3">
          <button
            onClick={() => searchInputRef.current?.focus()}
            className="text-4xl text-blue-500 hover:text-blue-600 transition-colors"
            title={t("search")}
          >
            <CiSearch />
          </button>
          <div className="flex-grow relative">
            <MyInput
              ref={searchInputRef}
              name="search_partner"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search")}
              className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 dark:focus:bg-gray-700"
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
        </div>
      </div>

      {/* Results Section */}
      {partners.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {search ? (
                t("searchResults")
              ) : (
                <div>
                  {t("all")} {t("partners")}
                </div>
              )}
            </h2>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-600">
            {partners.map((p, index) => (
              <li
                key={p.id}
                tabIndex={0}
                ref={(el) => (listItemRefs.current[index] = el)}
                onKeyDown={(e) => handleListKeyDown(e, index, p)}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 dark:focus:bg-blue-800 transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-mono w-8">
                      {(currentPage - 1) * itemsPerPage + index + 1}.
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {p.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <TypeBadge
                      typeText={t(p.type)}
                      text={p.type_display}
                      type={p.type}
                    />
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                      <button
                        className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900 rounded-md transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPartner(p);
                          setEditName(p.name);
                          setEditType(p.type);
                          setEditId(p.id);
                          setSelectedListItemRef(index);
                          setOpenModal(true);
                        }}
                        title={t("change")}
                      >
                        <GrEdit />
                      </button>
                      <button
                        disabled={loadingDeleteId === p.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePartner(p.id, p.name);
                        }}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                        title={
                          loadingDeleteId === p.id
                            ? t("deletingPartner")
                            : t("deletePartner")
                        }
                        aria-busy={loadingDeleteId === p.id}
                      >
                        {loadingDeleteId === p.id ? (
                          <CiNoWaitingSign className="animate-spin" />
                        ) : (
                          <RiDeleteBin2Fill />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {hasMore && (
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-center">
              <button
                className="text-blue-500 hover:text-blue-700 hover:underline font-medium px-4 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                ref={loadMoreButtonRef}
                tabIndex={0}
                onClick={loadMore}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    listItemRefs.current[partners.length - 1]?.focus();
                  } else if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    loadMore();
                  }
                }}
              >
                {t("loadMore")} ({filteredPartners.length - partners.length})
              </button>
            </div>
          )}
        </div>
      ) : (
        !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {search ? t("noSearchResults") : t("noPartners")}
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {search ? t("tryDifferentSearch") : t("addFirstPartner")}
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
      {openModal && selectedPartner && (
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
                      type="radio"
                      value={type}
                      checked={editType === type}
                      onChange={(e) => setEditType(e.target.value)}
                      className="text-blue-500 focus:ring-blue-500"
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
                variant="gray"
                onClick={() => {
                  setOpenModal(false);
                  listItemRefs.current[selectedListItemRef]?.focus();
                }}
              >
                {t("cancel")}
              </MyButton>
              <MyButton
                variant="blue"
                onClick={updatePartner}
                disabled={loadingEdit}
                className="min-w-[100px]"
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
      )}

      {loading && <MyLoading />}
    </div>
  );
};

export default Partner;
