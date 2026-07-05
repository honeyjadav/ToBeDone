import express from "express";
import { createTestItem, getTestItems } from "../controllers/testController.js";

const router = express.Router();

router.post("/", createTestItem);
router.get("/", getTestItems);

export default router;