 import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


 export const PartnerDownloadExcel = (data, t) => {
    const worksheetData = data.map((partner, idx) => ({
      "№": idx + 1,
      [t('partner')]: partner.name,
      [t('partnerType')]: partner.type_display
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Partners");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10);

    saveAs(blob, `${t('partners')}_${formattedDate}.xlsx`);
  };