import mongoose from "mongoose";

const testItemSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const TestItem = mongoose.model("TestItem", testItemSchema);
export default TestItem;