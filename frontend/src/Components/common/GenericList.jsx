import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBin2Fill } from "react-icons/ri";
import MyLoading from "../UI/MyLoading";

const GenericList = ({
  openAddModal,
  setOpenAddModal,
  setOpenEditModal,
  openEditModal,
  searchInputRef,
  setOpenDeleteModal,
  openDeleteModal,
  data,
  t,
  emptyMessage = "Нет данных",
  loading,
  itemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const loadMoreButtonRef = useRef(null);

  // Фокусируемые элементы списка
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const listItemRefs = useRef([]);

  // Для дебаунса клавиш
  const debounceRef = useRef(null);

  const visibleItems = useMemo(() => {
    const start = 0;
    const end = currentPage * itemsPerPage;
    return data.slice(start, end);
  }, [data, currentPage, itemsPerPage]);

  useEffect(() => {
    setHasMore(visibleItems.length < data.length);
  }, [visibleItems, data]);

  // Фокус и скролл по изменению focusedIndex
  useEffect(() => {
    const el = listItemRefs.current[focusedIndex];
    if (el) {
      requestAnimationFrame(() => {
        el.focus();
        el.scrollIntoView({ behavior: "auto", block: "nearest" });
      });
    }
  }, [focusedIndex]);

  // Обработчик стрелок с дебаунсом
  const handleKeyDown = useCallback(
    (e) => {
      if (debounceRef.current) return; // игнорируем частые нажатия

      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
      }, 70);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (focusedIndex === visibleItems.length - 1) {
          loadMoreButtonRef.current?.focus();
          return;
        }
        setFocusedIndex((prev) => Math.min(prev + 1, visibleItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (focusedIndex === 0) {
          searchInputRef.current?.focus();
          return;
        }
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      }
    },
    [focusedIndex, visibleItems.length, searchInputRef]
  );

  // Навешиваем обработчик только если нет модалей
  useEffect(() => {
    if (openEditModal?.open || openDeleteModal?.open || openAddModal) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, openEditModal?.open, openDeleteModal?.open, openAddModal]);

  if (loading) return <MyLoading />;
  if (!Array.isArray(data) || data.length === 0) return <div>{emptyMessage}</div>;

  return (
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
                // setFocusedIndex(visibleItems.length); 
              }
            }}
          >
            {t("loadMore")}
          </button>
        </div>
      )}
    </div>
  );
};

export default GenericList;
