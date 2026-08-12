import Note from "../models/Note.js";
import Workspace from "../models/Workspace.js";

// Create Note
export const createNote = async (req, res) => {
    try {
        const { title, content, workspaceId } = req.body;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const note = new Note({
            title,
            content,
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

// 👉 NEW: Update Note
export const updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { title, content } = req.body;

        // 1. Find the note
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        // 2. Check if the logged-in user is the author of this note
        if (note.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this note" });
        }

        // 3. Update the fields if they were provided
        note.title = title || note.title;
        note.content = content !== undefined ? content : note.content;

        const updatedNote = await note.save();
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 👉 NEW: Delete Note
export const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;

        // 1. Find the note
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        // 2. Check if the logged-in user is the author
        if (note.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this note" });
        }

        // 3. Delete it
        await note.deleteOne();
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};