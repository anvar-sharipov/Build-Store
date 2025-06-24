import React, { createContext, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  // Синхронизируем searchQuery с URL параметром search
  React.useEffect(() => {
    if (searchQuery) {
      searchParams.set("search", searchQuery);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchParams,
        setSearchParams,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
