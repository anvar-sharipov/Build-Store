import { FaClipboardList } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import { myFormatNumber } from "../../../UI/myFormatNumber";
import { MdInventory } from "react-icons/md"; // иконка для количества
import { FaDollarSign } from "react-icons/fa"; // иконка для цены

const ProductList = ({
  myClass,
  products,
  listItemRefs,
  nextPageUrl,
  loading,
  fetchProducts,
  t,
  searchInputRef,
  setClickedNextPageBtn,
  clickedNextPageBtn,
  productEditModal,
  productEditModal2,
  setProductEditModal2,
}) => {
  const loadMoreButtonRef = useRef(null);


  const openEditWindow = (productId) => {
  window.open(
    `/products/${productId}/edit`,
    "_blank", // открывает в новой вкладке/окне
    "width=900,height=700,scrollbars=yes,resizable=yes"
  );
};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="border border-gray-300 dark:border-gray-600 rounded-sm overflow-hidden">
        <ul className={myClass.ul}>
          {products.map((p, index) => (
            <li
              key={p.id}
              className={`${myClass.li} items-center`}
              ref={(el) => (listItemRefs.current[index] = el)}
              tabIndex={0}
              onClick={() => listItemRefs.current[index]?.focus()}
              onDoubleClick={() => {
                setProductEditModal2({ open: true, data: p, index });
              }}
              onKeyDown={(e) => {
                if (e.key === "Delete") {
                  e.preventDefault();
                  //   setOpenDeleteModal({ open: true, data: item, index });
                  // } else if (e.ctrlKey && e.key === "Enter") {
                  //   e.preventDefault();
                  //   setOpenPartnerListModal({
                  //     open: true,
                  //     data: item,
                  //     index,
                  //   });
                } else if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setProductEditModal2({ open: true, data: p, index });
                } else if (
                  e.key === "ArrowDown" &&
                  index + 1 < products.length
                ) {
                  e.preventDefault();
                  listItemRefs.current[index + 1]?.focus();
                } else if (e.key === "ArrowUp" && index !== 0) {
                  e.preventDefault();
                  listItemRefs.current[index - 1]?.focus();
                } else if (e.key === "ArrowUp" && index === 0) {
                  e.preventDefault();
                  searchInputRef.current?.focus();
                } else if (
                  e.key === "ArrowDown" &&
                  index + 1 === products.length
                ) {
                  e.preventDefault();
                  loadMoreButtonRef.current?.focus();
                }
              }}
            >
              <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {index + 1}.
              </div>
              <div className="font-medium text-gray-800 dark:text-gray-200 truncate">
                {p.name}
              </div>

              <div className="flex gap-1 justify-end items-center">
                <div className="flex flex-col items-end text-sm text-gray-700 dark:text-gray-200 gap-1">
                  <div className="flex items-center gap-1">
                    {/* <MdInventory className="text-yellow-500" /> */}
                    <span>
                      {myFormatNumber(p.quantity)} {p.base_unit_obj.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaDollarSign className="text-green-500" />
                    <span>{myFormatNumber(p.retail_price)}</span>
                  </div>
                </div>

                <div className="border-r-4"></div>
                {/* <button
                //   ref={(el) => (partnerListIconRefs.current[index] = el)}
                //   onMouseEnter={() => {
                //     hoverTimeoutRef.current = setTimeout(() => {
                //       setHoveredPartnerIndex(index);
                //     }, 500);
                //   }}
                //   onMouseLeave={() => {
                //     clearTimeout(hoverTimeoutRef.current);
                //     setHoveredPartnerIndex(null);
                //   }}
                //   className={`p-1 text-gray-500 hover:text-green-700 hover:bg-green-200 dark:hover:bg-green-700 rounded transition-colors dark:text-gray-200 print:hidden ${
                //     item.partners.length === 0 &&
                //     "text-red-300 dark:text-red-200"
                //   }`}
                //   onClick={() =>
                //     setOpenPartnerListModal({
                //       open: true,
                //       data: item,
                //       index,
                //     })
                //   }
                >
                  <div className="flex items-center">
                    <FaClipboardList size={14} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                    </span>
                  </div>
                </button> */}

             
                <button
                  //   ref={(el) => (editIconRefs.current[index] = el)}
                  //   onMouseEnter={() => {
                  //     hoverTimeoutRef.current = setTimeout(() => {
                  //       setHoveredEditIndex(index);
                  //     }, 500);
                  //   }}
                  //   onMouseLeave={() => {
                  //     clearTimeout(hoverTimeoutRef.current);
                  //     setHoveredEditIndex(null);
                  //   }}
                  className="p-1 text-gray-800 hover:text-green-700 hover:bg-green-200 dark:hover:bg-green-700 rounded transition-colors dark:text-green-500 print:hidden"
                  onClick={() =>
                    setProductEditModal2({ open: true, data: p, index })
                  }
                >
                  <GrEdit size={14} />
                </button>
                {/* <button
                  //   ref={(el) => (deleteIconRefs.current[index] = el)}
                  //   onMouseEnter={() => {
                  //     hoverTimeoutRef.current = setTimeout(() => {
                  //       setHoveredDeleteIndex(index);
                  //     }, 500);
                  //   }}
                  //   onMouseLeave={() => {
                  //     clearTimeout(hoverTimeoutRef.current);
                  //     setHoveredDeleteIndex(null);
                  //   }}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-200 dark:hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors print:hidden"
                  //   onClick={() =>
                  //     setOpenDeleteModal({ open: true, data: item, index })
                  //   }
                >
                  <RiDeleteBin2Fill size={14} />
                </button> */}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {nextPageUrl && (
        <div className="px-4 py-1 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-center">
          <button
            ref={loadMoreButtonRef}
            className={myClass.showMore}
            disabled={!nextPageUrl || loading}
            onClick={() => {
              setClickedNextPageBtn(true);
              fetchProducts(nextPageUrl);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                listItemRefs.current[products.length - 1].focus();
              } else if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setClickedNextPageBtn(true);
                fetchProducts(nextPageUrl);
                // fetchProducts(nextPageUrl).then(() => {
                //   setNextClicked(true);
                // });
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

export default ProductList;
