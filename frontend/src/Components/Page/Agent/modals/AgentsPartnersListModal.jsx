import React, { useState, useRef, useEffect } from "react";
import MyModal from "../../../UI/MyModal";
import TypeBadge from "../../Partner/TypeBadge";
import { CiNoWaitingSign } from "react-icons/ci";
import { RiDeleteBin2Fill } from "react-icons/ri";
import MySmallModal from "../../../UI/MySmallModal";
import MyButton from "../../../UI/MyButton";

const AgentsPartnersListModal = ({
  setOpenPartnerListModal,
  openPartnerListModal,
  t,
}) => {
  const partners = openPartnerListModal.data.partners;
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const listItemRefs = useRef([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletedPartner, setDeletedPartner] = useState(null);
  const [isActiveSmallModal, setIsActiveSmallModal] = useState(false);
  const [currendIndex, setCurrentIndex] = useState(null);
  const cancelBtnRef = useRef(null);
  const OKBtnRef = useRef(null);

  useEffect(() => {
    if (!openDeleteModal) {
      listItemRefs.current[currendIndex]?.focus();
      setIsActiveSmallModal(false)
    } else {
      cancelBtnRef.current?.focus();
    }
  }, [openDeleteModal]);

  useEffect(() => {
    listItemRefs.current[0]?.focus();
  }, []);
  return (
    <MyModal
      onClose={() =>
        setOpenPartnerListModal({ open: false, data: null, index: null })
      }
      isActiveSmallModal={isActiveSmallModal}
    >
      {openDeleteModal && (
        <MySmallModal
          onClose={() => setOpenDeleteModal(false)}
          loading={loading}
        >
          <div>
            {t("confirmUnlinkPartner")} {deletedPartner.name}
          </div>
          <MyButton
            variant="blue"
            onClick={() => setOpenDeleteModal(false)}
            ref={cancelBtnRef}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                OKBtnRef.current?.focus();
              }
            }}
          >
            {t("cancel")}
          </MyButton>
          <MyButton
            variant="red"
            ref={OKBtnRef}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                cancelBtnRef.current?.focus();
              }
            }}
          >
            {t("unlink")}
          </MyButton>
        </MySmallModal>
      )}

      <ul className="divide-y divide-gray-300 dark:divide-gray-600 mt-5">
        {partners.map((p, index) => (
          <li
            key={p.id}
            ref={(el) => (listItemRefs.current[index] = el)}
            tabIndex={0}
            className="grid grid-cols-[auto_1fr_auto] px-4 py-2 
        hover:bg-gray-300 dark:hover:bg-gray-700 
        focus:outline-none focus:ring-2 
        focus:bg-blue-400 dark:focus:bg-blue-800 
        transition-colors cursor-pointer"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" && index < partners.length - 1) {
                e.preventDefault();
                listItemRefs.current[index + 1]?.focus();
                setCurrentIndex(index);
              } else if (e.key === "ArrowUp" && index > 0) {
                e.preventDefault();
                listItemRefs.current[index - 1]?.focus();
                setCurrentIndex(index);
              } else if (e.key === "Delete") {
                e.preventDefault();
                setOpenDeleteModal(true);
                setDeletedPartner(p);
                setIsActiveSmallModal(true);
                setCurrentIndex(index);
              }
            }}
          >
            <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
              {index + 1}.
            </div>
            <div className="truncate font-medium text-gray-800 dark:text-gray-200">
              {p.name}
            </div>
            <div className="flex items-center gap-1 justify-end">
              <TypeBadge
                typeText={t(p.type)}
                text={p.type_display}
                type={p.type}
              />

              <button
                disabled={loadingDeleteId === p.id}
                onClick={() => {
                  setOpenDeleteModal(true);
                  setDeletedPartner(p);
                  setIsActiveSmallModal(true);
                }}
                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                title={
                  loadingDeleteId === p.id
                    ? t("deletingPartner")
                    : t("deletePartner")
                }
                aria-busy={loadingDeleteId === p.id}
              >
                {loadingDeleteId === p.id ? (
                  <CiNoWaitingSign className="animate-spin" size={14} />
                ) : (
                  <RiDeleteBin2Fill size={14} />
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </MyModal>
  );
};

export default AgentsPartnersListModal;
