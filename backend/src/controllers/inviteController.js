import Invite from "../models/Invite.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import User from "../models/User.js";

// @desc    Admin sends an invite for an email to join a workspace with a specific role
// @route   POST /api/invites
// @access  Private (must be Admin of the workspace)
export const sendInvite = async (req, res, next) => {
  try {
    const { email, workspaceId, role } = req.body;
    const requesterId = req.user.id;

    // 1. Confirm requester is an Admin of this workspace
    const requesterMembership = await WorkspaceMember.findOne({
      userId: requesterId,
      workspaceId,
    });

    if (!requesterMembership || requesterMembership.role !== "Admin") {
      res.status(403);
      throw new Error("Only workspace Admins can send invites");
    }

    // 2. If invitee is already registered, check they aren't already a member
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const alreadyMember = await WorkspaceMember.findOne({
        userId: existingUser._id,
        workspaceId,
      });
      if (alreadyMember) {
        res.status(400);
        throw new Error("This user is already a member of the workspace");
      }
    }

    // 3. Prevent duplicate pending invites for the same email + workspace
    const existingInvite = await Invite.findOne({
      email,
      workspaceId,
      status: "pending",
    });
    if (existingInvite) {
      res.status(400);
      throw new Error("An active invite already exists for this email");
    }

    // 4. Create the invite with the role the Admin chose
    const invite = await Invite.create({
      email,
      workspaceId,
      role: role || "Member",
      invitedBy: requesterId,
    });

    const inviteLink = `${process.env.CLIENT_URL}/invite/${invite.token}`;

    res.status(201).json({
      success: true,
      message: "Invite created successfully",
      data: {
        token: invite.token,
        email: invite.email,
        workspaceId: invite.workspaceId,
        role: invite.role,
        status: invite.status,
        inviteLink,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending invites for a workspace (so Admin can see who's invited)
// @route   GET /api/invites/:workspaceId
// @access  Private (must be a member of the workspace)
export const getWorkspaceInvites = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const requesterId = req.user.id;

    const requesterMembership = await WorkspaceMember.findOne({
      userId: requesterId,
      workspaceId,
    });

    if (!requesterMembership) {
      res.status(403);
      throw new Error("You are not a member of this workspace");
    }

    const invites = await Invite.find({ workspaceId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: invites });
  } catch (error) {
    next(error);
  }
};