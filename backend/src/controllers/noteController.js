import Note from "../models/Note.js";
import Workspace from "../models/Workspace.js";

// Create Note
export const createNote = async (req, res) => {
    try {
        const { title, content, color, workspaceId } = req.body;

        if (!workspaceId) {
            return res.status(400).json({ message: "Workspace ID is required" });
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const note = new Note({
            title: typeof title === "string" ? title.trim() : "",
            content: typeof content === "string" ? content : "",
            color: color || "#fff9c4",
            workspace: workspaceId,
            author: req.user.id,
        });

        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Notes
export const getWorkspaceNotes = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const notes = await Note.find({ workspace: workspaceId })
            .populate("author", "name avatar")
            .sort({ createdAt: -1 });

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Note
export const updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { title, content, color, pinned } = req.body;

        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (note.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this note" });
        }

        if (title !== undefined) note.title = typeof title === "string" ? title.trim() : "";
        if (content !== undefined) note.content = typeof content === "string" ? content : "";
        if (color !== undefined) note.color = color;
        if (pinned !== undefined) note.pinned = pinned;

        const updatedNote = await note.save();
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Note
export const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;

        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (note.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this note" });
        }

        await note.deleteOne();
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};