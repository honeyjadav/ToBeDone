import express from "express";
import {
    createNote,
    getWorkspaceNotes,
    updateNote,
    deleteNote
} from "../controllers/noteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", protect, createNote);
router.get("/get/:workspaceId", protect, getWorkspaceNotes);
router.put("/update/:noteId", protect, updateNote);
router.delete("/delete/:noteId", protect, deleteNote);

export default router;