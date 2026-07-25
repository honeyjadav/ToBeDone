import Joi from "joi";

export const sendInviteSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "A valid email is required",
    "string.empty": "Email is required",
  }),
  workspaceId: Joi.string().required().messages({
    "string.empty": "workspaceId is required",
  }),
  role: Joi.string().valid("Admin", "Manager", "Member").default("Member").messages({
    "any.only": "role must be Admin, Manager, or Member",
  }),
});