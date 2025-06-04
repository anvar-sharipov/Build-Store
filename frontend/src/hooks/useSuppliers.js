import { useEffect, useMemo, useState } from "react";
import myAxios from "../Components/axios";
import Fuse from "fuse.js";

export default function useSuppliers(itemsPerPage = 10) {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    myAxios
      .get("suppliers/")
      .then((res) => setSuppliers(res.data))
      .catch((e) => console.error("Ошибка при загрузке:", e))
      .finally(() => setLoading(false));
  }, []);

  const addSupplier = () => {
    if (!newSupplier.trim()) return;
    myAxios
      .post("suppliers/", { name: newSupplier })
      .then((res) => {
        setSuppliers((prev) => [res.data, ...prev]);
        setNewSupplier("");
      })
      .catch((e) => console.error("Ошибка при добавлении:", e));
  };

  const fuse = useMemo(() => new Fuse(suppliers, {
    keys: ["name"],
    threshold: 0.3,
    ignoreLocation: true,
  }), [suppliers]);

  const filtered = search ? fuse.search(search).map(r => r.item) : suppliers;
  const paginated = filtered.slice(0, currentPage * itemsPerPage);

  return {
    suppliers: paginated,
    hasMore: filtered.length > paginated.length,
    loading,
    search,
    setSearch,
    newSupplier,
    setNewSupplier,
    addSupplier,
    setCurrentPage,
    currentPage
  };
}
