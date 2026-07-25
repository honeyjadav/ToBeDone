import Joi from "joi";

export const createWorkspaceSchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    "string.empty": "Workspace name is required",
  }),
});