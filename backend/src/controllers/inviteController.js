import Invite from "../models/Invite.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import User from "../models/User.js";

// @desc    Admin sends an invite for an email to join a workspace with a specific role
// @route   POST /api/invites
// @access  Private (must be Admin of the workspace)
export const sendInvite = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const { workspaceId } = req.params;
    const requesterId = req.user.id;

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

    const invites = await Invite.find({ workspaceId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: invites });
  } catch (error) {
    next(error);
  }
};

// @desc    Logged-in user accepts an invite, becoming a WorkspaceMember with the invited role
// @route   POST /api/invites/accept/:token
// @access  Private (must be logged in; invited email must match logged-in user's email)
export const acceptInvite = async (req, res, next) => {
  try {
    const { token } = req.params;
    const userId = req.user.id;

    const invite = await Invite.findOne({ token });

    if (!invite) {
      res.status(404);
      throw new Error("Invite not found");
    }

    if (invite.status !== "pending") {
      res.status(400);
      throw new Error(`This invite has already been ${invite.status}`);
    }

    if (invite.expiresAt < Date.now()) {
      invite.status = "expired";
      await invite.save();
      res.status(400);
      throw new Error("This invite has expired");
    }

    // Confirm the logged-in user's email matches the invited email.
    // Without this check, ANY logged-in user who obtains the token/link
    // could accept an invite meant for someone else.
    const user = await User.findById(userId);
    if (!user || user.email.toLowerCase() !== invite.email.toLowerCase()) {
      res.status(403);
      throw new Error("This invite was sent to a different email address");
    }

    // Guard against double-accepting / already a member
    const alreadyMember = await WorkspaceMember.findOne({
      userId,
      workspaceId: invite.workspaceId,
    });
    if (alreadyMember) {
      invite.status = "used";
      await invite.save();
      res.status(400);
      throw new Error("You are already a member of this workspace");
    }

    const membership = await WorkspaceMember.create({
      userId,
      workspaceId: invite.workspaceId,
      role: invite.role,
    });

    invite.status = "used";
    await invite.save();

    res.status(200).json({
      success: true,
      message: "Invite accepted successfully",
      data: {
        workspaceId: membership.workspaceId,
        role: membership.role,
      },
    });
  } catch (error) {
    next(error);
  }
};