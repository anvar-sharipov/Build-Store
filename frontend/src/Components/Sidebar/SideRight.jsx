// Components/Sidebar/SidebarRight.jsx
import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// настройки для разных страниц
const FILTER_CONFIG = {
  "/partners": {
    type: [
      { key: "klient", labelKey: "klient" },
      { key: "supplier", labelKey: "supplier" },
      { key: "both", labelKey: "both" },
      { key: "all", labelKey: "all" },
    ],
  },
  "/agents": {
    sort: [
      { key: "asc", labelKey: "asc" }, // po wozrastaniyu
      { key: "desc", labelKey: "desc" },
    ],
  },
};

export default function SidebarRight() {
  // узнаём, на какой странице мы сейчас
  const location = useLocation();

  // чтобы читать и менять параметры в адресной строке  (http://site.com/partners?type=supplier)
  const [searchParams, setSearchParams] = useSearchParams();

  const { t } = useTranslation();

  const [offset, setOffset] = useState(0);
  const currentPath = location.pathname;
  const config = FILTER_CONFIG[currentPath];

  // слушаем прокрутку страницы
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      setOffset(scrollTop <= 160 ? scrollTop : 160);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  //   Если текущая страница не найдена в FILTER_CONFIG — не показываем сайдбар
  if (!config) return null;

  const typeOptions = config.type || [];
  const sortOptions = config.sort || [];

  //   Смотрим текущий фильтр из URL, Смотрим, какой фильтр сейчас выбран. Если ничего нет — значит "all".
  const selectedType = searchParams.get("type") || "all";
  const selectedSort = searchParams.get("sort") || "desc";

  //   const filter = searchParams.get("type") || "all";

  //   Когда пользователь кликает на фильтр, Мы добавляем (или убираем) ?type=something в адрес страницы.
  const handleChange = (paramName, value) => {
    if (value === "all" && paramName === "type") {
      searchParams.delete("type");
    } else {
      searchParams.set(paramName, value);
    }
    setSearchParams(searchParams);
  };

  return (
    <aside
      className="hidden lg:flex fixed top-16 right-0 h-[calc(100vh-4rem)] w-48 flex-col p-4 dark:bg-gray-900 shadow-lg overflow-y-auto z-20 mt-20"
      style={{ top: `${80 - offset}px` }}
    >
      <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300 border-b pb-2">
        {t("filter")}
      </h2>

      {/* Сортировка (для partners) */}
      {typeOptions.map((option) => {
        const isChecked = selectedType === option.key;
        return (
          <label
            key={option.key}
            className={`flex items-center py-1 cursor-pointer ${
              isChecked ? "text-blue-700 font-semibold" : "text-gray-700"
            }`}
          >
            <input
              type="radio"
              name="filter-type"
              checked={isChecked}
              onChange={() => handleChange("type", option.key)}
              className="mr-2 accent-blue-600"
            />
            {t(option.labelKey)}
          </label>
        );
      })}

      {/* Сортировка (для agents) */}
      {sortOptions.length > 0 && (
        <>
          <h3 className="font-semibold mb-2 mt-4 text-gray-400">{t("sort")}</h3>
          {sortOptions.map((option) => {
            const isChecked = selectedSort === option.key;
            return (
              <label
                key={option.key}
                className={`flex items-center py-1 cursor-pointer ${
                  isChecked ? "text-blue-700 font-semibold" : "text-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="filter-sort"
                  checked={selectedSort === option.key}
                  onChange={() => handleChange("sort", option.key)}
                  className="mr-2 accent-blue-600"
                />
                {t(option.labelKey)}
              </label>
            );
          })}
        </>
      )}
    </aside>
  );
}
