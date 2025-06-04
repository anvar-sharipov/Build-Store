import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef, useMemo } from "react";
import myAxios from "../axios";
import MyInput from "../UI/MyInput";
import MyButton from "../UI/MyButton";
import MyList from "../UI/MyList";
import { CiSearch } from "react-icons/ci";
import { FcPlus } from "react-icons/fc";
import { div } from "framer-motion/client";
import Fuse from "fuse.js";

const Suppliers = () => {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const searchInputRef = useRef(null);
  const addInputRef = useRef(null);
  const LoadMoreButtonRef = useRef(null);
  // Массив refs для элементов списка
  const listItemRefs = useRef([]);

  useEffect(() => {
    myAxios
      .get("suppliers/")
      .then((response) => {
        setSuppliers(response.data);
      })
      .catch((error) => {
        console.log("Ошибка при загрузке поставщиков:", error);
      })
      .finally(() => {
        setLoading(false); // <- независимо от успеха/ошибки
      });
  }, []);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Insert") {
        e.preventDefault();
        addInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const addSupplier = () => {
    if (!newSupplier.trim()) return;

    myAxios
      .post("suppliers/", { name: newSupplier })
      .then((response) => {
        setSuppliers((prev) => [response.data, ...prev]);
        setNewSupplier("");
        searchInputRef.current?.focus();
      })
      .catch((error) => {
        console.error("Ошибка при добавлении поставщика:", error);
      });
  };

  const fuse = useMemo(() => {
    return new Fuse(suppliers, {
      keys: ["name"],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [suppliers]);

  const filteredSuppliers = search
    ? fuse.search(search).map((result) => result.item)
    : suppliers;

  const paginatedSuppliers = filteredSuppliers.slice(
    0,
    currentPage * itemsPerPage
  );

  // Обработчик навигации по списку (стрелки вверх/вниз)
  const handleListKeyDown = (e, index) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < paginatedSuppliers.length) {
        listItemRefs.current[nextIndex].focus();
      } else if (filteredSuppliers.length > paginatedSuppliers.length) {
        LoadMoreButtonRef.current.focus();
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = index - 1;
      if (prevIndex >= 0) {
        listItemRefs.current[prevIndex].focus();
      } else {
        // Если на первом элементе и нажата стрелка вверх, возвращаем фокус в input поиска
        searchInputRef.current.focus();
      }
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (listItemRefs.current[0]) {
        listItemRefs.current[0].focus();
      }
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      // Если фокус в поле поиска — переводим фокус на поле добавления
      if (document.activeElement === searchInputRef.current) {
        addInputRef.current?.focus();
      }
    }
  };

  return (
    <div className="p-4">
      <div className="mx-auto mt-10 flex items-end gap-2">
        <FcPlus className="text-4xl" />
        <MyInput
          ref={addInputRef}
          name="new_supplier"
          type="text"
          value={newSupplier}
          onChange={(e) => setNewSupplier(e.target.value)}
          placeholder={`${t("addNewSupplier")}...`}
          className="flex-grow"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addSupplier();
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              searchInputRef.current?.focus();
            }
          }}
        />
        <MyButton variant="green" onClick={addSupplier}>
          {t("add")}
        </MyButton>
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
          className="flex-grow"
          onKeyDown={handleSearchKeyDown}
        />
      </div>

      {loading ? (
        <div className="flex justify-center space-x-2 py-10">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:.15s]" />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:.3s]" />
        </div>
      ) : (
        <div className="mx-auto mt-6">
          {filteredSuppliers.length > 0 ? (
            <div>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                {paginatedSuppliers.map((s, index) => (
                  <li
                    key={s.id}
                    tabIndex={0} // Делает элемент фокусируемым
                    ref={(el) => (listItemRefs.current[index] = el)} // Записываем реф
                    onKeyDown={(e) => handleListKeyDown(e, index)} // Обработка стрелок
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{index + 1}.</span>
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
              {filteredSuppliers.length > paginatedSuppliers.length && (
                <div className="text-center mt-4">
                  <MyButton
                    ref={LoadMoreButtonRef}
                    onClick={() => {
                      setCurrentPage((p) => p + 1)
                      listItemRefs.current[listItemRefs.current.length - 1]?.focus();
                    }}
                    variant="blue"
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowUp') {
                        listItemRefs.current[listItemRefs.current.length - 1]?.focus();
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
      )}
    </div>
  );
};

export default Suppliers;
