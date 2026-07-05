import TestItem from "../models/TestItem.js";

export const createTestItem = async (req, res) => {
  try {
    const item = await TestItem.create({ message: req.body.message || "Hello from CloudCollab!" });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTestItems = async (req, res) => {
  try {
    const items = await TestItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};