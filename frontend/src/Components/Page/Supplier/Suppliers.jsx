import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { CiSearch } from "react-icons/ci";
import { FcPlus } from "react-icons/fc";

import MyInput from "../../UI/MyInput";
import MyButton from "../../UI/MyButton";
import SupplierList from "./SupplierList";
import useSuppliers from "../../../hooks/useSuppliers";
import useKeyboardFocus from "../../../hooks/useKeyboardFocus";
import ThemeToggle from "../../ThemeToggle";

const Suppliers = () => {
  const { t } = useTranslation();
  const {
    suppliers,
    loading,
    newSupplier,
    setNewSupplier,
    addSupplier,
    search,
    setSearch,
    hasMore,
    setCurrentPage,
  } = useSuppliers();

  const searchInputRef = useRef(null);
  const addInputRef = useRef(null);
  const listItemRefs = useRef([]);
  const loadMoreButtonRef = useRef(null);

  useKeyboardFocus(addInputRef, searchInputRef);

  const handleListKeyDown = (e, i) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (i + 1 < suppliers.length) listItemRefs.current[i + 1]?.focus();
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
      listItemRefs.current[0]?.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      addInputRef.current?.focus();
    }
  };

  return (
    <div className="p-4">
      <div className="mx-auto mt-10 flex items-end gap-2">
        <FcPlus className="text-4xl" onClick={addSupplier} />
        <MyInput
          ref={addInputRef}
          name="new_supplier"
          type="text"
          value={newSupplier}
          onChange={(e) => setNewSupplier(e.target.value)}
          placeholder={`${t("addNewSupplier")}...`}
          className="flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-100"
          onKeyDown={(e) => {
            if (e.key === "Enter") addSupplier();
            if (e.key === "ArrowDown") {
              e.preventDefault();
              searchInputRef.current?.focus();
            }
          }}
        />
      </div>

      <div className="mx-auto mt-10 flex items-end gap-2">
        <CiSearch className="text-4xl" />
        <MyInput
          ref={searchInputRef}
          name="search_supplier"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search")}
          className="flex-grow flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-100"
          onKeyDown={handleSearchKeyDown}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10 space-x-2">
          {[0, 0.15, 0.3].map((d, i) => (
            <div
              key={i}
              className={`w-3 h-3 bg-blue-500 rounded-full animate-bounce`}
              style={{ animationDelay: `${d}s` }}
            />
          ))}
        </div>
      ) : suppliers.length ? (
        <div className="mx-auto mt-6">
          <SupplierList
            suppliers={suppliers}
            listItemRefs={listItemRefs}
            onKeyDown={handleListKeyDown}
          />
          {hasMore && (
            <div className="text-center mt-4">
              <MyButton
                ref={loadMoreButtonRef}
                onClick={() => setCurrentPage((p) => p + 1)}
                variant="blue"
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    listItemRefs.current[
                      listItemRefs.current.length - 1
                    ]?.focus();
                  }
                }}
              >
                {t("loadMore")}
              </MyButton>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-red-500 italic py-6 text-6xl">
          {t("noData")}
        </div>
      )}
    </div>
  );
};

export default Suppliers;
