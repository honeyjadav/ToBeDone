import Webhook from "../models/Webhook.js";

const buildDigestWebhookPayload = ({ event, period, summary, digest }) => {
    const safeSummary = summary || "No summary content available.";
    const groups = Array.isArray(digest?.groups) ? digest.groups : [];

    const text = `*AI Digest (${period || "Last 24h"})*\n${safeSummary}`;
    const fields = groups
        .slice(0, 5)
        .map((group) => ({
            title: group?.title || "Update",
            value: Array.isArray(group?.items) ? group.items.join("\n") : "No details available.",
            short: false,
        }));

    return {
        event: event || "digest.summary",
        type: "digest.summary",
        period: period || "Last 24h",
        summary: safeSummary,
        text,
        digest: digest || null,
        attachments: [
            {
                color: "#7c3aed",
                title: `AI Digest • ${period || "Last 24h"}`,
                text: safeSummary,
                fields,
            },
        ],
    };
};

// @desc    Get all webhooks for a workspace
// @route   GET /api/workspaces/:workspaceId/webhooks
// @access  Private (workspace member)
export const getWebhooks = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;

        const webhooks = await Webhook.find({ workspace: workspaceId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: webhooks,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single webhook by id
// @route   GET /api/workspaces/:workspaceId/webhooks/:id
// @access  Private (workspace member)
export const getWebhookById = async (req, res, next) => {
    try {
        const { workspaceId, id } = req.params;

        const webhook = await Webhook.findOne({ workspace: workspaceId, webhookId: id });

        if (!webhook) {
            res.status(404);
            throw new Error("Webhook not found");
        }

        res.status(200).json({
            success: true,
            data: webhook,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a webhook
// @route   POST /api/workspaces/:workspaceId/webhooks
// @access  Private (Admins/Managers or any workspace member, depending on policy)
export const createWebhook = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;
        const { name, url, event, headers = [], active = true } = req.body;

        if (!name || !url || !event) {
            res.status(400);
            throw new Error("Webhook name, URL and event are required");
        }

        const webhook = await Webhook.create({
            workspace: workspaceId,
            createdBy: req.user.id,
            name,
            url,
            event,
            headers: Array.isArray(headers) ? headers : [],
            active,
        });

        res.status(201).json({
            success: true,
            message: "Webhook created successfully",
            data: webhook,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a webhook
// @route   PATCH /api/workspaces/:workspaceId/webhooks/:id
// @access  Private (workspace member with resource access or admin/manager)
export const updateWebhook = async (req, res, next) => {
    try {
        const { workspaceId, id } = req.params;
        const webhook = await Webhook.findOne({ workspace: workspaceId, webhookId: id });

        if (!webhook) {
            res.status(404);
            throw new Error("Webhook not found");
        }

        const allowedFields = ["name", "url", "event", "headers", "active"];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                webhook[field] = req.body[field];
            }
        });

        await webhook.save();

        res.status(200).json({
            success: true,
            message: "Webhook updated successfully",
            data: webhook,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a webhook
// @route   DELETE /api/workspaces/:workspaceId/webhooks/:id
// @access  Private (workspace member with resource access or admin/manager)
export const deleteWebhook = async (req, res, next) => {
    try {
        const { workspaceId, id } = req.params;

        const webhook = await Webhook.findOneAndDelete({ workspace: workspaceId, webhookId: id });

        if (!webhook) {
            res.status(404);
            throw new Error("Webhook not found");
        }

        res.status(200).json({
            success: true,
            message: "Webhook deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send a digest summary to a selected webhook URL
// @route   POST /api/workspaces/:workspaceId/webhooks/:id/send
export const sendDigestToWebhook = async (req, res, next) => {
    try {
        const { workspaceId, id } = req.params;
        const { period, summary, digest } = req.body || {};

        const webhook = await Webhook.findOne({ workspace: workspaceId, webhookId: id });

        if (!webhook) {
            res.status(404);
            throw new Error("Webhook not found");
        }

        if (!webhook.active) {
            res.status(400);
            throw new Error("Webhook is inactive");
        }

        const headers = {};
        for (const header of webhook.headers || []) {
            if (header && header.key) {
                headers[header.key] = header.value || "";
            }
        }
        headers["Content-Type"] = headers["Content-Type"] || "application/json";

        const payload = buildDigestWebhookPayload({
            event: webhook.event,
            period,
            summary,
            digest,
        });

        const response = await fetch(webhook.url, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        const responseText = await response.text();

        if (!response.ok) {
            const serverMessage = responseText ? responseText.slice(0, 250) : "Webhook request failed";
            res.status(502);
            throw new Error(`Webhook delivery failed: ${serverMessage}`);
        }

        res.status(200).json({
            success: true,
            message: "Digest sent to webhook successfully",
            data: {
                webhookId: webhook.webhookId,
                name: webhook.name,
                event: webhook.event,
                status: response.status,
                response: responseText || null,
            },
        });
    } catch (error) {
        next(error);
    }
};
