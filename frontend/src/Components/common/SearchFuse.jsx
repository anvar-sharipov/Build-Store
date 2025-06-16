import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import MyInput from "../UI/MyInput";
import { CiSearch } from "react-icons/ci";

const SearchFuse = ({ data, searchKey, onFiltered, ref }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query) {
      if (data.length) onFiltered(data);
      return;
    }

    const fuse = new Fuse(data, {
      keys: searchKey,
      threshold: 0.3,
    });

    const result = fuse.search(query).map((r) => r.item);
    onFiltered(result); // передаём отфильтрованные данные наружу
  }, [query, data]);

  return (
    <div className="flex items-end gap-3">
      <MyInput
      ref={ref}
      className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 dark:focus:bg-gray-700 h-7"
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Поиск..."
    />
    <button
          // onClick={() => searchInputRef.current?.focus()}
          className="text-2xl text-blue-500 hover:text-blue-600 transition-colors"
          // title={t("search")}
        >
          <CiSearch />
        </button>
    </div>
    
  );
};

export default SearchFuse;
