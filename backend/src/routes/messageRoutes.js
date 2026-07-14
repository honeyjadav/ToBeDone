import express from "express";
import { getMessages, deleteMessage } from "../controllers/messageController.js";

const router = express.Router();

// TODO: add auth middleware once ready, e.g. router.use(protect)
router.get("/:workspaceId", getMessages);
router.delete("/:id", deleteMessage);

export default router;