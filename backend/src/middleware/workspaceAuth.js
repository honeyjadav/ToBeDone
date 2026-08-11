import WorkspaceMember from "../models/WorkspaceMember.js";

/**
 * requireWorkspaceRole(...allowedRoles)
 *
 * Usage:
 *   router.post("/:workspaceId/tasks", protect, requireWorkspaceRole("Admin", "Manager"), createTask);
 *
 * Assumes:
 *   - `protect` has already run (req.user.id is set)
 *   - the route has a `:workspaceId` param
 *
 * On success, attaches `req.membership` (the WorkspaceMember doc) so downstream
 * controllers can read the caller's role without re-querying.
 */
export const requireWorkspaceRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { workspaceId } = req.params;

      if (!workspaceId) {
        res.status(400);
        return next(new Error("workspaceId param is required"));
      }

      const membership = await WorkspaceMember.findOne({
        userId: req.user.id,
        workspaceId,
      });

      if (!membership) {
        res.status(403);
        return next(new Error("You are not a member of this workspace"));
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role)) {
        res.status(403);
        return next(new Error("Insufficient permissions for this action"));
      }

      req.membership = membership;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * requireWorkspaceMember
 * Lighter check: just confirms the user belongs to the workspace,
 * regardless of role. Useful for read-only routes (e.g. viewing tasks/chat)
 * where any role (Admin/Manager/Member) should have access.
 */
export const requireWorkspaceMember = requireWorkspaceRole(); // no roles = any member passes