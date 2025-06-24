import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState, useContext } from "react";
import myAxios from "../../axios";
import MyLoading from "../../UI/MyLoading";
import { myClass } from "../../tailwindClasses";
import MyButton from "../../UI/MyButton";
import ProductAddAndSearchSection from "./sections/ProductAddAndSearchSection";
import { useSearchParams } from "react-router-dom";
import Fuse from "fuse.js";
import { SearchContext } from "../../context/SearchContext";

const Harytlar = () => {
  const { searchQuery, setSearchQuery, searchParams, setSearchParams } = useContext(SearchContext);
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  // const [searchQuery, setSearchQuery] = useState("");
  const listItemRefs = useRef([]);
  // const [searchParams] = useSearchParams();
  // const [searchParams, setSearchParams] = useSearchParams();
  

  useEffect(() => {
    document.title = t("products");
  }, []);

  const fetchProducts = async (url = null) => {
    setLoading(true);

    // если url не передан — значит, это первая загрузка (с фильтрами)
    const query = searchParams.toString();
    const fullUrl = url || `products/?${query}`;
    console.log("fullUrl", fullUrl);

    try {
      const res = await myAxios.get(fullUrl);

      // если это первая страница — заменяем
      if (!url) {
        listItemRefs.current = []; // очищаем ссылки при смене фильтра
        setProducts(res.data.results);
      } else {
        // если это "Загрузить ещё" — добавляем к текущему + защита от дублей:
        setProducts((prev) => [...prev, ...res.data.results]);
        
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newItems = res.data.results.filter(
            (p) => !existingIds.has(p.id)
          );
          return [...prev, ...newItems];
        });
      }
      console.log("res.data.next", res.data.next);

      setNextPageUrl(res.data.next);
    } catch (e) {
      console.error("Ошибка при загрузке:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  useEffect(() => {
  const queryFromParams = searchParams.get("search") || "";
  setSearchQuery(queryFromParams);
}, []);

  return (
    <div>
      <ProductAddAndSearchSection
        t={t}
        products={products}
        // searchQuery={searchQuery}
        // setSearchQuery={setSearchQuery}
        listItemRefs={listItemRefs}
        // searchParams={searchParams}
        // setSearchParams={setSearchParams}
      />
      {loading ? (
        <MyLoading />
      ) : products.length > 0 ? (
        <div>
          <ul className={myClass.ul}>
            {products.map((p, index) => (
              <li
                key={p.id}
                className={myClass.li}
                ref={(el) => (listItemRefs.current[index] = el)}
                index={0}
              >
              {index + 1} {p.name}
              </li>
            ))}
          </ul>
          <button
            className={myClass.showMore}
            disabled={!nextPageUrl || loading}
            onClick={() => fetchProducts(nextPageUrl)}
          >
            {t("loadMore")}
          </button>
        </div>
      ) : (
        <div>net product</div>
      )}
    </div>
  );
};

export default Harytlar;
