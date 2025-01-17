const express = require("express");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const fs = require("fs");
const cors = require("cors");


dotenv.config({ path: "../config/config.env" });
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
const credentials = JSON.parse(
    fs.readFileSync(process.env.GOOGLE_SERVICE_ACCOUNT, "utf-8")
);

const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ["https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets"]
);



const sheets = google.sheets({ version: "v4", auth });
const drive = google.drive({ version: "v3", auth });

app.get("/api/read-sheet", async (req, res) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: "user_mock_data!A:M",
        });
        res.json(response.data.values);
    } catch (error) {
        console.error("Error reading sheet:", error);
        res.status(500).send("Error reading sheet");
    }
});

app.post("/export", async (req, res) => {
    const { data } = req.body;
    try {
        const createResponse = await sheets.spreadsheets.create({
            resource: {
                properties: {
                    title: "Exported Data",
                },
            },
        });

        const spreadsheetId = createResponse.data.spreadsheetId;

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: "Sheet1!A1",
            valueInputOption: "RAW",
            resource: {
                values: data,
            },
        });

        await drive.permissions.create({
            fileId: spreadsheetId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
        res.json({ success: true, url: sheetUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: "Failed to export data" });
    }
});

app.all("*", (req, res) => {
    res.status(404).json({ status: "fail", data: `Path ${req.originalUrl} is not found in the server` });
})
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
