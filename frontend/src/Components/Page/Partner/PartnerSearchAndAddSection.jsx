import { IoIosAddCircleOutline } from "react-icons/io";
import MyInput from "../../UI/MyInput";
import { CiSearch } from "react-icons/ci";
import { PartnerDownloadExcel } from "./PartnerDownloadExcel";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useState, useEffect, useRef } from "react";
import Tooltip from "../../ToolTip";

const PartnerSearchAndAddSection = ({
  setOpenModalAdd,
  addIconButtonRef,
  searchInputRef,
  filteredPartners,
  search,
  setSearch,
  t,
  handleSearchKeyDown,
  clearSearch,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // for tooltip add
  const buttonRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // for tooltop download excel
  const downloadExcelButtonRef = useRef(null);
  const [downloadHovered, setDownloadHovered] = useState(false);

  const handleDownload = () => {
    setIsAnimating(true);
    PartnerDownloadExcel(filteredPartners, t);
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 300); // длина анимации 300мс
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        handleDownload();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredPartners]);

  return (
    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md p-1 mb-2 flex items-center justify-between px-2">
      <button
        ref={buttonRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="text-2xl text-green-500 hover:text-green-600 transition-colors"
        onClick={() => alert("Clicked!")}
      >
        <IoIosAddCircleOutline />
      </button>

      <Tooltip targetRef={buttonRef} visible={hovered}>
        {t("addPartner")} (INSERT)
      </Tooltip>

      <div className="text-gray-600 dark:text-gray-400 hidden lg:flex items-center gap-3">
        <div>
          {filteredPartners.length > 0 && (
            <span>
              {search
                ? `${t("found")}: ${filteredPartners.length}`
                : `${t("total")}: ${filteredPartners.length}`}
            </span>
          )}
        </div>

        <RiFileExcel2Fill
          ref={downloadExcelButtonRef}
          onMouseEnter={() => setDownloadHovered(true)}
          onMouseLeave={() => setDownloadHovered(false)}
          size={30}
          className={`cursor-pointer rounded transition-transform duration-300 text-green-700 hover:text-green-600 ${
            isAnimating ? "scale-125" : "scale-100"
          }`}
          onClick={handleDownload}
          role="button"
          tabIndex={0}
          aria-label="Download Excel"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleDownload();
            }
          }}
        />
        <Tooltip targetRef={downloadExcelButtonRef} visible={downloadHovered}>
          {t("downloadExcel")} (CTRL+E)
        </Tooltip>
      </div>

      <div className="flex items-end gap-3">
        <div className="flex-grow relative">
          <div className="flex-grow relative">
            <MyInput
              ref={searchInputRef}
              name="search_partner"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search")}
              className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 dark:focus:bg-gray-700 h-7"
              onKeyDown={handleSearchKeyDown}
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl font-bold"
                title={t("clearSearch")}
              >
                ×
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => searchInputRef.current?.focus()}
          className="text-2xl text-blue-500 hover:text-blue-600 transition-colors"
          title={t("search")}
        >
          <CiSearch />
        </button>
      </div>
    </div>
  );
};

export default PartnerSearchAndAddSection;
