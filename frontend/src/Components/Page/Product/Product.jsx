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
import ProductList from "./sections/ProductList";
import ProductEditModal2 from "./modals/ProductEditModal/ProductEditModal2";
import ProductAddModal from "./modals/ProductAddModal/ProductAddModal";
import {
  fetchUnits,
  fetchCategories,
  fetchBrands,
  fetchModels,
  fetchTags,
} from "../../fetchs/optionsFetchers";

const Harytlar = () => {
  const { searchQuery, setSearchQuery, searchParams, setSearchParams } =
    useContext(SearchContext);
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const listItemRefs = useRef([]);
  const [totalCount, setTotalCount] = useState(0);
  const searchInputRef = useRef(null);
  const [clickedNextPageBtn, setClickedNextPageBtn] = useState(false);

  const [productAddModalOpen, setProductAddModalOpen] = useState(false);

  // modals
  const [productEditModal2, setProductEditModal2] = useState({
    open: false,
    data: null,
    index: null,
  });

  const [options, setOptions] = useState({
    base_units: [],
    categories: [],
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [units, categories, brands, models, tags] = await Promise.all([
          fetchUnits(),
          fetchCategories(),
          fetchBrands(),
          fetchModels(),
          fetchTags(),
        ]);

        if (units) {
          const formattedUnits = units.map((unit) => ({
            value: String(unit.id),
            label: unit.name,
          }));
          setOptions((prev) => ({ ...prev, base_units: formattedUnits }));
        }

        if (categories) {
          const formattedCategories = categories.map((cat) => ({
            value: String(cat.id),
            label: cat.name,
          }));
          setOptions((prev) => ({ ...prev, categories: formattedCategories }));
        }
        if (brands) {
          const formattedBrands = brands.map((brand) => ({
            value: String(brand.id),
            label: brand.name,
          }));
          setOptions((prev) => ({ ...prev, brands: formattedBrands }));
        }
        if (models) {
          const formattedModels = models.map((model) => ({
            value: String(model.id),
            label: model.name,
          }));
          setOptions((prev) => ({ ...prev, models: formattedModels }));
        }
        if (tags) {
          const formattedTags = tags.map((tag) => ({
            value: String(tag.id),
            label: tag.name,
          }));
          setOptions((prev) => ({ ...prev, tags: formattedTags }));
        }
      } catch (e) {
        console.error("Ошибка загрузки данных:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // useEffect(() => {
  //   if (!productEditModal.open) {

  //   }
  // }, [productEditModal.open]);

  // useEffect(() => {
  //   const loadUnits = async () => {
  //     const units = await fetchUnits();
  //     console.log("units", units);
  //   };
  //   loadUnits();
  // }, []);

  useEffect(() => {
    if (clickedNextPageBtn && listItemRefs.current.length > 0) {
      const timeout = setTimeout(() => {
        const lastItem = listItemRefs.current[listItemRefs.current.length - 1];
        if (lastItem) {
          lastItem.focus();
        }
        setClickedNextPageBtn(false);
      }, 100); // чуть больше времени (100мс), чтобы refs успели обновиться
    }
  }, [clickedNextPageBtn]);

  useEffect(() => {
    document.title = t("products");
  }, []);

  const fetchProducts = async (url = null) => {
    setLoading(true);

    // если url не передан — значит, это первая загрузка (с фильтрами)
    const query = searchParams.toString();
    const fullUrl = url || `products/?${query}`;

    try {
      const res = await myAxios.get(fullUrl);

      // если это первая страница — заменяем
      if (!url) {
        listItemRefs.current = []; // очищаем ссылки при смене фильтра
        setProducts(res.data.results);
        setTotalCount(res.data.count);
        // console.log(res.data.results);
      } else {
        // если это "Загрузить ещё" — добавляем к текущему + защита от дублей:
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newItems = res.data.results.filter(
            (p) => !existingIds.has(p.id)
          );
          return [...prev, ...newItems];
        });
      }

      setNextPageUrl(res.data.next);
    } catch (e) {
      console.error("Ошибка при загрузке:", e);
    } finally {
      setLoading(false);

      // if (clickedNextPageBtn) {
      //   console.log('dadadadadadada2222222222', clickedNextPageBtn);
      //   console.log('listItemRefs', listItemRefs);
      //   setTimeout(() => {
      //     listItemRefs.current[listItemRefs.current.length-1]?.focus()
      //     setClickedNextPageBtn(false)
      //   }, 50);

      // }
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchProducts();
      searchInputRef.current?.focus();
    };
    load();
  }, [searchParams]);

  useEffect(() => {
    const queryFromParams = searchParams.get("search") || "";
    setSearchQuery(queryFromParams);
    searchInputRef.current?.focus();
  }, []);

  return (
    <div>
      <ProductAddAndSearchSection
        t={t}
        products={products}
        listItemRefs={listItemRefs}
        totalCount={totalCount}
        searchInputRef={searchInputRef}
        productAddModalOpen={productAddModalOpen}
        setProductAddModalOpen={setProductAddModalOpen}
      />
      {loading ? (
        <MyLoading />
      ) : products.length > 0 ? (
        <ProductList
          myClass={myClass}
          products={products}
          listItemRefs={listItemRefs}
          nextPageUrl={nextPageUrl}
          loading={loading}
          fetchProducts={fetchProducts}
          t={t}
          searchInputRef={searchInputRef}
          setClickedNextPageBtn={setClickedNextPageBtn}
          clickedNextPageBtn={clickedNextPageBtn}
          productEditModal2={productEditModal2}
          setProductEditModal2={setProductEditModal2}
        />
      ) : (
        <div>net product</div>
      )}

      {productEditModal2.open && (
        <ProductEditModal2
          setProducts={setProducts}
          setOptions={setOptions}
          options={options}
          productEditModal2={productEditModal2}
          setProductEditModal2={setProductEditModal2}
          t={t}
          isCreate={false}
        />
      )}

      {productAddModalOpen && (
        <ProductAddModal
          setProducts={setProducts}
          productAddModalOpen={productAddModalOpen}
          setProductAddModalOpen={setProductAddModalOpen}
          options={options}
          setOptions={setOptions}
          t={t}
        />
      )}
    </div>
  );
};

export default Harytlar;
