 import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


 export const AgentDownloadExcel = (data, t) => {
    const worksheetData = data.map((emp, idx) => ({
      "№": idx + 1,
      [t('employee')]: emp.name,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10);

    saveAs(blob, `${t('employeers')}_${formattedDate}.xlsx`);
  };