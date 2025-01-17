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
  const [isExporting, setIsExporting] = useState(false); // State สำหรับสถานะการ export

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
      openNotificationWithIcon("success", "Export Success", "Google Sheet has been created.");
    } catch (error) {
      console.error("Export failed", error);
      openNotificationWithIcon("error", "Export Failed", "Failed to create Google Sheet. Please try again.");
    } finally {
      setIsExporting(false); 
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredData = initialData.filter((row) =>
      row.some((cell) => cell.toString().toLowerCase().includes(query.toLowerCase()))
    );
    setSortedData(filteredData);
  };

  const handleSort = (columnIndex) => {
    let sorted = [...sortedData];
    let direction = sortConfig.direction === "asc" ? "desc" : "asc";

    sorted.sort((a, b) => {
      const valueA = a[columnIndex];
      const valueB = b[columnIndex];
      const regex = /^(\d+)?\s*(.*)$/;
      const [, numA, textA] = valueA.match(regex) || [];
      const [, numB, textB] = valueB.match(regex) || [];

      if (numA && numB) {
        const numberComparison = parseInt(numA) - parseInt(numB);
        if (numberComparison !== 0) return direction === "asc" ? numberComparison : -numberComparison;
      }

      if (textA < textB) return direction === "asc" ? -1 : 1;
      if (textA > textB) return direction === "asc" ? 1 : -1;

      return 0;
    });

    setSortedData([...sorted]);
    setSortConfig({ key: columnIndex, direction });
  };

  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <div style={{ maxWidth: "80%", margin: "20px auto", textAlign: "center" }}>
      <h1>Google Sheets Data Table</h1>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            padding: "8px",
            width: "200px",
            marginRight: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        {contextHolder}
      
        <Button
          onClick={handleExport}
          disabled={isExporting} 
          style={{
            padding: "8px 12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isExporting ? "not-allowed" : "pointer",
          }}
        >
          {isExporting ? "Exporting..." : "Export to Google Sheet"}
        </Button>
      </div>
      
      {isExporting && (
        <div style={{ margin: "10px 0" }}>
          <Spin size="small" /> <span>Creating Google Sheet...</span>
        </div>
      )}

      {!isExporting&&sheetUrl && (
        <p>
          Export successful! View your sheet{" "}
          <a href={sheetUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#007BFF" }}>
            here
          </a>.
        </p>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                style={{
                  border: "1px solid black",
                  padding: "10px",
                  backgroundColor: "#f4f4f4",
                  cursor: "pointer",
                }}
                onClick={() => handleSort(index)}
              >
                {header}{" "}
                <span style={{ fontSize: "12px", color: "#555" }}>
                  {sortConfig.key === index ? (sortConfig.direction === "asc" ? "↓" : "↑") : ""}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ backgroundColor: rowIndex % 2 === 0 ? "#f9f9f9" : "#fff" }}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
