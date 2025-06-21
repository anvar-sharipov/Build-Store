import TypeBadge from "./TypeBadge";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { CiNoWaitingSign } from "react-icons/ci";
import { myClass } from "../../tailwindClasses";

const PartnerList = ({
  partners,
  listItemRefs,
  handleListKeyDown,
  loadingDeleteId,
  setSelectedPartner,
  setEditName,
  setEditType,
  setEditId,
  setSelectedListItemRef,
  setOpenModal,
  t,
  setDeleteModal,
  hasMore,
  loadMoreButtonRef,
  loadMore,
  filteredPartners,
  loading,
  search,
  clearSearch,
}) => {
  return (
    <div>
      {partners.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="border border-gray-300 dark:border-gray-600 rounded-sm overflow-hidden">
            <ul className={myClass.ul}>
              {partners.map((p, index) => (
                <li
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setSelectedPartner(p);
                    setEditName(p.name);
                    setEditType(p.type);
                    setEditId(p.id);
                    setSelectedListItemRef(index);
                    setOpenModal(true);
                  }}
                  key={p.id}
                  tabIndex={0}
                  ref={(el) => (listItemRefs.current[index] = el)}
                  onKeyDown={(e) => handleListKeyDown(e, index, p)}
                  className={myClass.li}
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
                      className={`p-1 text-gray-800 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-700 rounded transition-colors dark:text-green-500 ${
                        loadingDeleteId === p.id && "opacity-0"
                      }`}
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
                      <GrEdit size={14} />
                    </button>
                    <button
                      disabled={loadingDeleteId === p.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        // deletePartner(p.id, p.name);
                        setDeleteModal({ open: true, data: p, index: index });
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
          </div>

          {hasMore && (
            <div className="px-4 py-1 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-center">
              <button
                className={myClass.showMore}
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
              {search ? t("noSearchResults") : t("empty")}
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
    </div>
  );
};

export default PartnerList;
