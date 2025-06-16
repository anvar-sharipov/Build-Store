import SearchFuse from "../../../common/SearchFuse";
import { IoIosAddCircleOutline } from "react-icons/io";
import Tooltip from "../../../ToolTip";
import { useEffect, useRef, useState } from "react";
import { RiFileExcel2Fill } from "react-icons/ri";

const AgentSearchAndAddSection = ({
  data,
  searchKey,
  onFiltered,
  t,
  setOpenAddModal,
  openAddModal,
}) => {
  // add icon
  const addIconRef = useRef(null);
  const [addIconHovered, setAddIconHovered] = useState(false);

  // excel
  const excelIconRef = useRef(null);
  const [excelIconHovered, setExcelIconHovered] = useState(false);
  const [excelIconIsAnimating, setExcelIconIsAnimating] = useState(false);

  // search
  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, [t]);

  // excel
  const handleDownloadExcel = () => {
    setExcelIconIsAnimating(true);
  };
  useEffect(() => {
    if (excelIconIsAnimating) {
      const timer = setTimeout(() => setExcelIconIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [excelIconIsAnimating]);

  return (
    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md p-1 mb-2 flex items-center justify-between px-2 print:hidden">
      <div>
        <button
          ref={addIconRef}
          onMouseEnter={() => setAddIconHovered(true)}
          onMouseLeave={() => setAddIconHovered(false)}
          className="text-2xl text-green-500 hover:text-green-600 transition-colors"
          onClick={() => setOpenAddModal(true)}
        >
          <IoIosAddCircleOutline />
        </button>
        <Tooltip visible={addIconHovered} targetRef={addIconRef}>
          {t("addAgent")} (INSERT)
        </Tooltip>
      </div>

      <div className="text-gray-600 dark:text-gray-400 hidden lg:flex items-center gap-3">
        <div>
          {data.length > 0 && (
            <div className="flex gap-3 items-center">
              <span>Jemi: {data.length}</span>
              <RiFileExcel2Fill
                size={30}
                className={`cursor-pointer rounded transition-transform duration-300 text-green-700 hover:text-green-600 ${
                  excelIconIsAnimating ? "scale-125" : "scale-100"
                }`}
                ref={excelIconRef}
                onClick={handleDownloadExcel}
                onMouseEnter={() => setExcelIconHovered(true)}
                onMouseLeave={() => setExcelIconHovered(false)}
              />
            </div>
          )}
          <Tooltip visible={excelIconHovered} targetRef={excelIconRef}>
            {t("downloadExcel")} (CTRL+E)
          </Tooltip>
        </div>
      </div>

      <div className="flex items-end gap-3">
        <div className="flex-grow relative">
          <SearchFuse
            ref={searchInputRef}
            className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 dark:focus:bg-gray-700 h-7"
            data={data}
            searchKey={searchKey}
            onFiltered={onFiltered}
          />
        </div>
      </div>
    </div>
  );
};

export default AgentSearchAndAddSection;
