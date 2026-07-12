import mongoose from "mongoose";

const fileUploadSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String, // mime type e.g. "image/png", "application/pdf"
    },
    fileSize: {
      type: Number, // bytes
    },
    url: {
      type: String, // Cloudinary secure_url
      required: true,
    },
    publicId: {
      type: String, // Cloudinary public_id, needed to delete file later
      required: true,
    },
    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  },
  { timestamps: true }
);

const FileUpload = mongoose.model("FileUpload", fileUploadSchema);
export default FileUpload;
