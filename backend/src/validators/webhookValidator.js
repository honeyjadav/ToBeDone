import Joi from "joi";

export const webhookHeaderSchema = Joi.object({
    key: Joi.string().trim().min(1).required().messages({
        "string.empty": "Header key is required",
    }),
    value: Joi.string().allow("").default(""),
});

export const createWebhookSchema = Joi.object({
    name: Joi.string().trim().min(1).required().messages({
        "string.empty": "Webhook name is required",
    }),
    url: Joi.string().trim().uri({ allowRelative: false }).required().messages({
        "string.empty": "Webhook URL is required",
        "string.uri": "Please enter a valid URL",
    }),
    event: Joi.string().trim().min(1).required().messages({
        "string.empty": "Webhook event is required",
    }),
    headers: Joi.array().items(webhookHeaderSchema).default([]),
    active: Joi.boolean().default(true),
});

export const updateWebhookSchema = createWebhookSchema.fork(
    ["name", "url", "event", "headers", "active"],
    (field) => field.optional()
);
