import express from "express";
import {
    createNote,
    getWorkspaceNotes,
    updateNote,
    deleteNote
} from "../controllers/noteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Route: POST /api/notes/create
router.post("/create", protect, createNote);

// Route: GET /api/notes/workspace/:workspaceId
router.get("/get/:workspaceId", protect, getWorkspaceNotes);

// 👉 NEW Route: PUT /api/notes/:noteId
router.put("/update/:noteId", protect, updateNote);

// 👉 NEW Route: DELETE /api/notes/:noteId
router.delete("/delete/:noteId", protect, deleteNote);

export default router;