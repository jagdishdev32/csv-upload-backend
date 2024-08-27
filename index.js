import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import { parseCSVFile } from "./helpers/fileHelper.js";
import Tables from "./models/tableData.model.js";

const upload = multer({ dest: "uploads/" });

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health-check", (req, res, next) => {
  return res.json({ status: "success", message: "Server Running" });
});

app.get("/table-data", async (req, res, next) => {
  try {
    const allTablesData = await Tables.find().lean();

    let allData = [];
    let headers = [];

    for (const fileData of allTablesData) {
      for (const rowsData of fileData?.tableRows) {
        let rowObj = {
          // name: value
        };
        for (const cellData of rowsData) {
          rowObj[cellData.name] = cellData.value;
        }
        allData.push(rowObj);
      }
    }
    return res.json({ status: "success", data: allData });
  } catch (error) {
    res.status(500).json({ status: "error", error, message: error?.message });
  }
});

app.post("/csv-upload", upload.single("csv-file"), async (req, res, next) => {
  const file = req.file;

  const filepath = file.path;
  const originalFileName = file.originalname;

  try {
    const csvData = await parseCSVFile(filepath);

    let tableRows =
      csvData?.map((rowDetails) => {
        const headers = Object.keys(rowDetails);

        return (
          headers.map((header) => {
            let name = header;
            let value = rowDetails[header];
            return { name, value };
          }) || []
        );
      }) || [];

    Tables.create({ filepath, originalFileName, tableRows: tableRows });

    return res.json({ status: "success", message: "csv data", csvData });
  } catch (error) {
    return res.json({ status: "failed", message: error.message });
  }
});

async function main() {
  const MONGO_URI = process.env.MONGO_URI;
  await mongoose.connect(MONGO_URI);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`App Running at PORT: ${PORT}`);
  });
}

main().catch((err) => console.log(err));
