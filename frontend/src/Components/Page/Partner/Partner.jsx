import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState, useMemo } from "react";
import Fuse from "fuse.js";
import myAxios from "../../axios";
import MyLoading from "../../UI/MyLoading";
import Notification from "../../Notification";
import PartnerDeleteModal from "./modals/PartnerDeleteModal";
import PartnerAddModal from "./modals/PartnerAddModal";
import PartnerUpdateModal from "./modals/PartnerUpdateModal";
import PartnerSearchAndAddSection from "./PartnerSearchAndAddSection";
import PartnerList from "./PartnerList";
import { PartnerDownloadExcel } from "./PartnerDownloadExcel";
import { RiFileExcel2Fill } from "react-icons/ri";


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

  const [openModalAdd, setOpenModalAdd] = useState(false);

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
  const addIconButtonRef = useRef(null);
  const radioRefs = useRef({});
  const deleteCancelRef = useRef(null);
  const deleteOKRef = useRef(null);
  const refUpdateCancelButton = useRef(null);
  const refUpdateSaveButton = useRef(null);
  const refUpdateRadioInput = useRef({});

  // Modal states
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("supplier");
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    data: null,
    index: null,
  });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (openModalAdd) {
      addInputRef.current?.focus();
    } else {
      searchInputRef.current?.focus();
    }
  }, [openModalAdd]);

  useEffect(() => {
    if (deleteModal.open) {
      deleteOKRef.current?.focus();
    }
  });

  useEffect(() => {
    document.title = t("partners");
    searchInputRef.current?.focus();
  }, [t]);

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
      setOpenModalAdd(false);
    }
  };

  const deletePartner = async (id, name) => {
    // if (!confirm(t("confirmDeletePartner", { name }))) return;

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
      setDeleteModal({ open: false, data: null, index: null });
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
      // if (!loadingDeleteId) deletePartner(p.id, p.name);
      setDeleteModal({ open: true, data: p, index: i });
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
      addIconButtonRef.current?.focus();
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
    if (e.key === "ArrowUp") {
      e.preventDefault();
      radioRefs.current[partnerType]?.focus();
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
    if (e.key === "ArrowDown") {
      e.preventDefault();
      refUpdateRadioInput.current["supplier"]?.focus(); // наведём фокус
    }
  };

  const loadMore = () => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + 1;

      // Переносим фокус после обновления DOM
      setTimeout(() => {
        const newItemIndex = (newPage - 1) * itemsPerPage; // Фокус на первом новом элементе
        if (listItemRefs.current[newItemIndex]) {
          listItemRefs.current[newItemIndex].focus();
        }
      }, 100);

      return newPage;
    });
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
      {/* delete modal */}
      {deleteModal.open && (
        <PartnerDeleteModal
          setDeleteModal={setDeleteModal}
          listItemRefs={listItemRefs}
          loadingDeleteId={loadingDeleteId}
          t={t}
          deleteModal={deleteModal}
          deleteCancelRef={deleteCancelRef}
          deleteOKRef={deleteOKRef}
          deletePartner={deletePartner}
        />
      )}

      {/* add Modal */}
      {openModalAdd && (
        <PartnerAddModal
          openModalAdd={openModalAdd}
          setOpenModalAdd={setOpenModalAdd}
          t={t}
          radioRefs={radioRefs}
          partnerType={partnerType}
          setPartnerType={setPartnerType}
          addInputRef={addInputRef}
          addPartner={addPartner}
          loadingAdd={loadingAdd}
          newPartner={newPartner}
          setNewPartner={setNewPartner}
          handleAddKeyDown={handleAddKeyDown}
        />
      )}

      {/* Edit Modal */}
      {openModal && selectedPartner && (
        <PartnerUpdateModal
          setOpenModal={setOpenModal}
          listItemRefs={listItemRefs}
          setselectedListItemRefOpenModal={selectedListItemRef}
          t={t}
          editInputRef={editInputRef}
          editName={editName}
          setEditName={setEditName}
          handleEditKeyDown={handleEditKeyDown}
          refUpdateRadioInput={refUpdateRadioInput}
          editType={editType}
          setEditType={setEditType}
          refUpdateCancelButton={refUpdateCancelButton}
          updatePartner={updatePartner}
          refUpdateSaveButton={refUpdateSaveButton}
          loadingEdit={loadingEdit}
        />
      )}

      <Notification
        message={t(notification.message)}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      {/* for modile */}
      <div className="lg:hidden text-center">
        <div className="flex justify-between">
          <span>{t("partners")}</span>

          <div className="text-gray-600 dark:text-gray-400 flex items-center gap-3">
            {filteredPartners.length > 0 && (
              <div className="flex gap-3 items-center">
                <span>
                  {search
                    ? `${t("found")}: ${filteredPartners.length}`
                    : `${t("total")}: ${filteredPartners.length}`}
                </span>
                <RiFileExcel2Fill
                  size={30}
                  className={`cursor-pointer rounded transition-transform duration-300 text-green-700 hover:text-green-600 ${
                    isAnimating ? "scale-125" : "scale-100"
                  }`}
                  onClick={() => {
                    PartnerDownloadExcel(filteredPartners, t);
                    setIsAnimating(true);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Download Excel"
                />
              </div>
            )}
          </div>
        </div>
        <hr className="m-1" />
      </div>

      {/* Add and search Partner Section */}
      <PartnerSearchAndAddSection
        setOpenModalAdd={setOpenModalAdd}
        addIconButtonRef={addIconButtonRef}
        searchInputRef={searchInputRef}
        filteredPartners={filteredPartners}
        search={search}
        setSearch={setSearch}
        t={t}
        handleSearchKeyDown={handleSearchKeyDown}
        clearSearch={clearSearch}
      />

      {/* Results Section */}
      <PartnerList
        partners={partners}
        listItemRefs={listItemRefs}
        handleListKeyDown={handleListKeyDown}
        loadingDeleteId={loadingDeleteId}
        setSelectedPartner={setSelectedPartner}
        setEditName={setEditName}
        setEditType={setEditType}
        setEditId={setEditId}
        setSelectedListItemRef={setSelectedListItemRef}
        setOpenModal={setOpenModal}
        t={t}
        setDeleteModal={setDeleteModal}
        hasMore={hasMore}
        loadMoreButtonRef={loadMoreButtonRef}
        loadMore={loadMore}
        filteredPartners={filteredPartners}
        loading={loading}
        search={search}
        clearSearch={clearSearch}
      />

      {loading && <MyLoading />}
    </div>
  );
};

export default Partner;
