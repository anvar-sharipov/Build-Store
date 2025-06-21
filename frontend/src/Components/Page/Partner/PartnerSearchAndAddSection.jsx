import { IoIosAddCircleOutline } from "react-icons/io";
import MyInput from "../../UI/MyInput";
import { CiSearch } from "react-icons/ci";
import { PartnerDownloadExcel } from "./PartnerDownloadExcel";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useState, useEffect, useRef } from "react";
import Tooltip from "../../ToolTip";
import MySearchInput from "../../UI/MySearchInput";
import { myClass } from "../../tailwindClasses";

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
        ref={addIconButtonRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={myClass.addButton}
        onClick={() => setOpenModalAdd(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            searchInputRef.current?.focus();
          }
        }}
      >
        <IoIosAddCircleOutline size={20} />
      </button>

      <Tooltip targetRef={addIconButtonRef} visible={hovered}>
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
        <MySearchInput
          ref={searchInputRef}
          name="search_partner"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search")}
          onKeyDown={handleSearchKeyDown}
        />
      </div>
    </div>
  );
};

export default PartnerSearchAndAddSection;
