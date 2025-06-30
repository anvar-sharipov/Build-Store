import React, { useState } from "react";
import myAxios from "../../../axios";
import { useTranslation } from "react-i18next";

const PriceChangeReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await myAxios.get("/price-change-report/", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      setReport(response.data);
    } catch (error) {
      console.error(t("load_error"), error);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    const url = `/api/price-change-report/excel/?start_date=${startDate}&end_date=${endDate}`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 dark:text-white min-h-screen print:min-h-0">
      <button
        onClick={downloadExcel}
        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 mb-4 print:hidden"
      >
        {t("download_excel")}
      </button>
      <h2 className="text-xl font-bold mb-4 print:text-center print:text-black">
        {t("report_title")}
      </h2>
      <div className="mb-4 flex gap-2 print:flex print:justify-center print:items-center">
        <input
          type="date"
          className="border px-2 py-1 bg-white dark:bg-gray-700 dark:text-white print:text-black"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="border px-2 py-1 bg-white dark:bg-gray-700 dark:text-white print:text-black"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          onClick={fetchReport}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 print:hidden"
        >
          {t("show")}
        </button>
      </div>

      {loading && <p>{t("loading")}</p>}

      {report.length > 0 && (
        <table className="w-full border border-gray-400 text-sm text-center print:border print:border-gray-700 print:border-collapse print:table-fixed">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 print:bg-white print:text-black print:font-bold">
              <th className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                #
              </th>
              <th className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                {t("product")}
              </th>
              <th className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                {t("unit")}
              </th>
              <th className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                {t("old_price")}
              </th>
              <th className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                {t("quantity")}
              </th>
              <th className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                {t("old_sum")}
              </th>
              <th className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                {t("new_price")}
              </th>
              <th className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                {t("quantity")}
              </th>
              <th className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                {t("new_sum")}
              </th>
              <th className="border border-gray-400 px-2 py-1 text-red-600 dark:text-red-400 print:text-black print:border print:border-gray-700">
                {t("loss")}
              </th>
              <th className="border border-gray-400 px-2 py-1 text-green-600 dark:text-green-400 print:text-black print:border print:border-gray-700">
                {t("profit")}
              </th>
            </tr>
          </thead>
          <tbody>
            {report.map((row, i) => {
              const oldTotal =
                parseFloat(row.old_price) * parseFloat(row.quantity_at_change);
              const newTotal =
                parseFloat(row.new_price) * parseFloat(row.quantity_at_change);
              const diff = parseFloat(row.difference);
              return (
                <tr
                  key={i}
                  className="border border-gray-400 print:border print:border-gray-700 print:text-black"
                >
                  <td className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                    {i + 1}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                    {row.product_name}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                    {row.product_unit}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                    {row.old_price}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                    {row.quantity_at_change}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                    {oldTotal.toFixed(2)}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                    {row.new_price}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                    {row.quantity_at_change}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 print:border print:border-gray-700">
                    {newTotal.toFixed(2)}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 text-red-600 dark:text-red-400 print:text-black print:border print:border-gray-700">
                    {diff < 0 ? diff.toFixed(2) : "-"}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 text-green-600 dark:text-green-400 print:text-black print:border print:border-gray-700">
                    {diff > 0 ? diff.toFixed(2) : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PriceChangeReport;
