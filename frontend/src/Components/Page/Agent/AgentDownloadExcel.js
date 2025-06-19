 import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


 export const AgentDownloadExcel = (agents, t) => {
    const worksheetData = agents.map((agent, idx) => ({
      "№": idx + 1,
      [t('agent')]: agent.name,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agents");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10);

    saveAs(blob, `${t('agents')}_${formattedDate}.xlsx`);
  };