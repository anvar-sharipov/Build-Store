import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const AgentDownloadExcel = (agents, t) => {
  const partnerTypeMap = { // Карта для перевода типа партнёра
    klient: t("klient"),
    supplier: t("supplier"),
    both: t("both"),
  };


  // Создание данных для Excel START
  const worksheetData = [];

  agents.forEach((agent, idx) => {
    const partners = agent.partners || [];

    if (partners.length === 0) {
      worksheetData.push({
        "№": worksheetData.length + 1,
        [t("agent")]: agent.name,
        [t("partner")]: "-",
        [t("partnerType")]: "-",
      });
    } else {
      partners.forEach((partner) => {
        worksheetData.push({
          "№": worksheetData.length + 1,
          [t("agent")]: agent.name,
          [t("partner")]: partner.name,
          [t("partnerType")]: partnerTypeMap[partner.type] || partner.type,
        });
      });
    }
  });
  // Создание данных для Excel END

  // Создание Excel-файла
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "AgentsWithPartners");

  // Скачивание файла
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10);

  saveAs(blob, `${t("agents")}_${formattedDate}.xlsx`);
};
