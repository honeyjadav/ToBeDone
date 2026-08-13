import User from "../models/User.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import Workspace from "../models/Workspace.js";

// @desc    Get logged-in user's profile
// @route   GET /api/users/me
// @access  Private
export const getMyProfile = async (req, res, next) => {
    try {
        // 1. Get logged-in user
        const user = await User.findById(req.user.id).select(
            "-password"
        );

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        // 2. Get user's workspace membership
        const membership = await WorkspaceMember.findOne({
            userId: user._id,
        }).populate({
            path: "workspaceId",
            select: "name description slug ownerId isActive",
        });

        // 3. Return combined profile information
        res.status(200).json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar || "",
                    authProvider: user.authProvider,
                    isEmailVerified: user.isEmailVerified,
                    isActive: user.isActive,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt,
                },

                workspace: membership
                    ? {
                          _id: membership.workspaceId?._id,
                          name: membership.workspaceId?.name,
                          description:
                              membership.workspaceId?.description,
                          slug: membership.workspaceId?.slug,
                      }
                    : null,

                role: membership?.role || null,
            },
        });
    } catch (error) {
        next(error);
    }
};