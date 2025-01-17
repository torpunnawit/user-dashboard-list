import React, { useEffect, useState } from "react";
import { fetchGoogleSheetsData } from "../utils/fetchGoogleSheetsData.js"
import DataTable from "./DataTable.jsx";
import { Spin } from "antd"

const Data = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const sheetsData = await fetchGoogleSheetsData();
      console.log(sheetsData);
      setData(sheetsData);
    };
    fetchData();
  }, []);

  return (
    <div>
      {data.length > 0 ? <DataTable data={data} /> : <p><Spin size="default" />Loading...</p>}
    </div>
  );
};

export default Data;
