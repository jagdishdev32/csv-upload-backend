import csv from "csv-parser";
import fs from "fs";

export const parseCSVFile = async (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        // [
        //   { NAME: 'Daffy Duck', AGE: '24' },
        //   { NAME: 'Bugs Bunny', AGE: '22' }
        // ]
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};
