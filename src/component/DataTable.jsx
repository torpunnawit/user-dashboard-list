import React, { useState } from "react";
import axios from "axios";
import { Button, notification, Spin } from "antd";

const DataTable = ({ data }) => {
  const headers = data[0];
  const initialData = data.slice(1);
  const API_URL = process.env.REACT_APP_API_URL;

  const [searchQuery, setSearchQuery] = useState("");
  const [sortedData, setSortedData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [sheetUrl, setSheetUrl] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message,
      description,
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await axios.post(`${API_URL}`, {
        data: sortedData,
      });
      setSheetUrl(response.data.url);
      openNotificationWithIcon(
        "success",
        "Export Success",
        "Google Sheet has been created."
      );
    } catch (error) {
      console.error("Export failed", error);
      openNotificationWithIcon(
        "error",
        "Export Failed",
        "Failed to create Google Sheet. Please try again."
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredData = initialData.filter((row) =>
      row.some((cell) =>
        cell.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
    setSortedData(filteredData);
  };

  const handleSort = (columnIndex) => {
    let sorted = [...sortedData];
    let direction = "asc";
    // let direction = sortConfig.direction === "asc" ? "desc" : "asc";
    if (sortConfig.key === columnIndex && sortConfig.direction === "asc") {
      direction = "desc";
    }
    sorted.sort((a, b) => {
      const valueA = a[columnIndex];
      const valueB = b[columnIndex];
      const regex = /^(\d+)?\s*(.*)$/;
      const [, numA, textA] = valueA.match(regex) || [];
      const [, numB, textB] = valueB.match(regex) || [];

      if (numA && numB) {
        const numberComparison = parseInt(numA) - parseInt(numB);
        if (numberComparison !== 0)
          return direction === "asc" ? numberComparison : -numberComparison;
      }

      if (textA < textB) return direction === "asc" ? -1 : 1;
      if (textA > textB) return direction === "asc" ? 1 : -1;

      return 0;
    });

    setSortedData([...sorted]);
    setSortConfig({ key: columnIndex, direction });
  };

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  return (
    <div className="w-full p-6 bg-gray-50 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Google Sheets Data Table
      </h1>

      <div className="flex flex-col  items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm w-full md:w-auto mb-4 md:mb-0 md:mr-4"
        />
        {contextHolder}

        <Button
          onClick={handleExport}
          disabled={isExporting}
          className={`p-3 rounded-lg text-white shadow-md transition mt-4 ${isExporting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
            }`}
        >
          {isExporting ? (
            <>
              <Spin size="small" /> Exporting...
            </>
          ) : (
            "Export to Google Sheet"
          )}
        </Button>
      </div>

      {!isExporting && sheetUrl && (
        <p className="text-center text-green-600 font-medium">
          Export successful! View your sheet{" "}
          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            here
          </a>
          .
        </p>
      )}

      <div className="overflow-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm min-w-[600px]">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-300 p-4 text-center cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort(index)}
                >
                  {header}{" "}
                  {sortConfig.key === index &&
                    (sortConfig.direction === "asc" ? "↓" : "↑")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border border-gray-300 p-3 text-center"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
