import mongoose from "mongoose";

const tableSchema = mongoose.Schema(
  {
    originalFileName: String,
    filepath: String,
    // Headers and Values both could be dynamic
    tableRows: [[{ name: String, value: String }]],
  },
  { timestamps: true }
);

const Tables = mongoose.model("TableData", tableSchema);

export default Tables;
