/**
 * requireResourceAccess(Model, options)
 *
 * Resource-level authorization layer, sits AFTER requireWorkspaceMember /
 * requireWorkspaceRole in the chain. Roles listed in `allowFullRoles`
 * (default Admin + Manager) bypass ownership checks entirely — they have
 * full (F) access per the RBAC matrix. Everyone else must be the
 * `ownerField` and/or `assigneeField` on the fetched document, or be
 * blocked with 403.
 *
 * Assumes:
 *   - `protect` and `requireWorkspaceRole`/`requireWorkspaceMember` already ran
 *   - req.membership.role is set
 *   - the route has an `:id` param identifying the resource (human-readable
 *     id like "tsk001", or override via idParam/idField)
 *
 * Attaches the fetched document to req.resource so the controller doesn't
 * have to re-fetch it.
 */
export const requireResourceAccess = (
  Model,
  {
    idParam = "id",
    idField = null, // e.g. "taskId" for human-readable ids; null = use _id
    workspaceField = "workspace",
    ownerField = "createdBy",
    assigneeField = null, // e.g. "assignedTo" (array or single ref); null = not applicable
    allowFullRoles = ["Admin", "Manager"],
  } = {}
) => {
  return async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
      const idValue = req.params[idParam];

      const query = idField ? { [idField]: idValue } : { _id: idValue };
      if (workspaceField) {
        query[workspaceField] = workspaceId;
      }

      const resource = await Model.findOne(query);
      if (!resource) {
        res.status(404);
        return next(new Error("Resource not found"));
      }

      req.resource = resource;

      if (allowFullRoles.includes(req.membership?.role)) {
        return next();
      }

      const userId = req.user.id;

      const isOwner =
        !!ownerField && resource[ownerField]?.toString() === userId;

      let isAssignee = false;
      if (assigneeField && resource[assigneeField] != null) {
        const val = resource[assigneeField];
        isAssignee = Array.isArray(val)
          ? val.some((v) => v?.toString() === userId)
          : val.toString() === userId;
      }

      if (isOwner || isAssignee) {
        return next();
      }

      res.status(403);
      return next(new Error("You do not have access to this resource"));
    } catch (error) {
      next(error);
    }
  };
};