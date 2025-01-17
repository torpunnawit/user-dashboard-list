import axios from "axios";

export const fetchGoogleSheetsData = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/read-sheet");
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};
