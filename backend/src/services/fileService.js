import Attachment from '../models/Attachment.js';
import Task from '../models/Task.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { MAX_FILE_SIZE } from '../utils/constants.js';
import logger from '../utils/logger.js';

export const uploadFileService = async (file, metadata, userId) => {
  try {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds maximum limit');
    }

    const uploadResult = await uploadToCloudinary(file.path, 'tobedone/uploads');

    const attachment = new Attachment({
      filename: file.originalname,
      fileUrl: uploadResult.url,
      fileType: file.mimetype,
      fileSize: file.size,
      cloudinaryId: uploadResult.publicId,
      uploadedBy: userId,
      project: metadata.projectId || null,
      task: metadata.taskId || null,
    });

    await attachment.save();

    if (metadata.taskId) {
      const task = await Task.findById(metadata.taskId);
      if (task) {
        task.attachments.push(attachment._id);
        await task.save();
      }
    }

    logger.info(`File uploaded: ${file.originalname}`);

    return attachment;
  } catch (error) {
    logger.error(`File upload error: ${error.message}`);
    throw error;
  }
};

export const getProjectFilesService = async (projectId) => {
  try {
    const files = await Attachment.find({ project: projectId })
      .populate('uploadedBy', 'firstName lastName email avatar')
      .sort({ createdAt: -1 });

    return files;
  } catch (error) {
    logger.error(`Get files error: ${error.message}`);
    throw error;
  }
};

export const deleteFileService = async (fileId, userId) => {
  try {
    const attachment = await Attachment.findById(fileId);

    if (!attachment) {
      throw new Error('File not found');
    }

    if (attachment.uploadedBy.toString() !== userId) {
      throw new Error('Unauthorized to delete this file');
    }

    if (attachment.cloudinaryId) {
      await deleteFromCloudinary(attachment.cloudinaryId);
    }

    await Attachment.findByIdAndDelete(fileId);

    logger.info(`File deleted: ${attachment.filename}`);

    return { message: 'File deleted successfully' };
  } catch (error) {
    logger.error(`Delete file error: ${error.message}`);
    throw error;
  }
};