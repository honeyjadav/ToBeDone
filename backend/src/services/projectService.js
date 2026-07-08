import Project from '../models/Project.js';
import ActivityLog from '../models/ActivityLog.js';
import { generateSlug } from '../utils/helpers.js';
import { ACTIVITY_TYPES } from '../utils/constants.js';
import logger from '../utils/logger.js';

export const createProjectService = async (projectData, userId) => {
  try {
    const slug = generateSlug(projectData.name);

    const existingProject = await Project.findOne({ slug });
    if (existingProject) {
      throw new Error('Project with this name already exists');
    }

    const project = new Project({
      name: projectData.name,
      description: projectData.description || '',
      slug,
      owner: userId,
      managers: [userId],
      color: projectData.color || '#5B5FEF',
      icon: projectData.icon || '📋',
    });

    await project.save();
    await project.populate('owner', 'firstName lastName email avatar');

    await ActivityLog.create({
      type: ACTIVITY_TYPES.PROJECT_CREATED,
      user: userId,
      project: project._id,
      description: `Created project: ${project.name}`,
    });

    logger.info(`Project created: ${project.name} by ${userId}`);

    return project;
  } catch (error) {
    logger.error(`Create project error: ${error.message}`);
    throw error;
  }
};

export const getProjectsService = async (userId, filters = {}) => {
  try {
    const query = {
      $or: [
        { owner: userId },
        { members: userId },
        { managers: userId },
      ],
      archived: false,
    };

    if (filters.search) {
      query.$or.push({
        name: { $regex: filters.search, $options: 'i' },
      });
    }

    const projects = await Project.find(query)
      .populate('owner', 'firstName lastName email avatar')
      .populate('members', 'firstName lastName email avatar')
      .sort({ createdAt: -1 });

    return projects;
  } catch (error) {
    logger.error(`Get projects error: ${error.message}`);
    throw error;
  }
};

export const getProjectByIdService = async (projectId) => {
  try {
    const project = await Project.findById(projectId)
      .populate('owner', 'firstName lastName email avatar')
      .populate('members', 'firstName lastName email avatar')
      .populate('managers', 'firstName lastName email avatar');

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  } catch (error) {
    logger.error(`Get project error: ${error.message}`);
    throw error;
  }
};

export const updateProjectService = async (projectId, updateData, userId) => {
  try {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.owner.toString() !== userId && !project.managers.includes(userId)) {
      throw new Error('Unauthorized to update this project');
    }

    const changes = {};

    if (updateData.name && updateData.name !== project.name) {
      changes.name = { from: project.name, to: updateData.name };
      project.name = updateData.name;
      project.slug = generateSlug(updateData.name);
    }

    if (updateData.description !== undefined) {
      changes.description = { from: project.description, to: updateData.description };
      project.description = updateData.description;
    }

    if (updateData.color) {
      changes.color = { from: project.color, to: updateData.color };
      project.color = updateData.color;
    }

    await project.save();

    await ActivityLog.create({
      type: ACTIVITY_TYPES.PROJECT_UPDATED,
      user: userId,
      project: projectId,
      description: `Updated project: ${project.name}`,
      changes,
    });

    logger.info(`Project updated: ${project.name}`);

    return project;
  } catch (error) {
    logger.error(`Update project error: ${error.message}`);
    throw error;
  }
};

export const addProjectMemberService = async (projectId, memberId, userId) => {
  try {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.owner.toString() !== userId && !project.managers.includes(userId)) {
      throw new Error('Unauthorized to add members');
    }

    if (project.members.includes(memberId)) {
      throw new Error('User is already a member');
    }

    project.members.push(memberId);
    await project.save();

    await ActivityLog.create({
      type: ACTIVITY_TYPES.USER_ASSIGNED,
      user: userId,
      project: projectId,
      description: `Added member to project`,
    });

    logger.info(`Member added to project: ${projectId}`);

    return project.populate('members', 'firstName lastName email avatar');
  } catch (error) {
    logger.error(`Add project member error: ${error.message}`);
    throw error;
  }
};

export const deleteProjectService = async (projectId, userId) => {
  try {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.owner.toString() !== userId) {
      throw new Error('Only project owner can delete');
    }

    project.archived = true;
    await project.save();

    await ActivityLog.create({
      type: ACTIVITY_TYPES.PROJECT_UPDATED,
      user: userId,
      project: projectId,
      description: `Archived project: ${project.name}`,
    });

    logger.info(`Project archived: ${project.name}`);

    return { message: 'Project deleted successfully' };
  } catch (error) {
    logger.error(`Delete project error: ${error.message}`);
    throw error;
  }
};