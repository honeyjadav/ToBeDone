import Invite from "../models/Invite.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import Workspace from "../models/Workspace.js";
import User from "../models/User.js";
import { inviteEmailTemplate } from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import { logActivity } from "./activityLogController.js";

// @desc    Admin sends an invite for an email to join a workspace with a specific role
// @route   POST /api/invites/:workspaceId
// @access  Private (must be Admin of the workspace)
export const sendInvite = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const { workspaceId } = req.params;
    const requesterId = req.user.id;

    if (role === "Admin") {
      const adminCount = await WorkspaceMember.countDocuments({ workspaceId, role: "Admin" });
      if (adminCount >= 2) {
        res.status(400);
        throw new Error(
          "This workspace already has the maximum of 2 Admins"
        );
      }
    }

    // 2. Check if invitee is already registered
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      const alreadyMember = await WorkspaceMember.findOne({ userId: existingUser._id, workspaceId });
      if (alreadyMember) {
        res.status(400);
        throw new Error("Unable to send invite for this email");
      }
    }

    // 3. Prevent duplicate pending invites
    const existingInvite = await Invite.findOne({
      email: email.toLowerCase().trim(),
      workspaceId,
      status: "pending",
    });

    if (existingInvite) {
      res.status(400);
      throw new Error(
        "An active invite already exists for this email"
      );
    }

    // 4. Fetch workspace
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      res.status(404);
      throw new Error("Workspace not found");
    }

    // 5. Fetch inviter details
    const inviter = await User.findById(requesterId).select(
      "name email"
    );

    if (!inviter) {
      res.status(401);
      throw new Error("Inviter user not found");
    }

    // 6. Create invite
    const invite = await Invite.create({
      email: email.toLowerCase().trim(),
      workspaceId,
      role: role || "Member",
      invitedBy: requesterId,
    });

    logActivity({
      workspace: workspaceId,
      user: requesterId,
      action: "MEMBER_INVITED",
      targetType: "Membership",
      targetId: invite._id,
      metadata: { email: invite.email, role: invite.role },
    });

    logActivity({
      workspace: workspaceId,
      user: requesterId,
      action: "MEMBER_INVITED",
      targetType: "Membership",
      targetId: invite._id,
      metadata: { email: invite.email, role: invite.role },
    });

    // 7. Create invite link
    const inviteLink =
      `${process.env.CLIENT_URL}/invite/${invite.token}`;

    // 8. Create email HTML
    const emailHtml = inviteEmailTemplate({
      workspaceName: workspace.name,
      inviterName: inviter.name,
      token: invite.token,
      role: invite.role,
    });

    // 9. Send email
    await sendEmail({
      to: invite.email,
      subject: `You're invited to join ${workspace.name}`,
      html: emailHtml,
    });

    // 10. Response
    res.status(201).json({
      success: true,
      message: "Invite sent successfully",
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

// @desc    Get all pending invites for a workspace
// @route   GET /api/invites/:workspaceId
// @access  Private (must be a member of the workspace)
export const getWorkspaceInvites = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    const invites = await Invite.find({ workspaceId }).sort({ createdAt: -1 }).limit(200).select("-__v");

    res.status(200).json({ success: true, data: invites });
  } catch (error) {
    next(error);
  }
};

// @desc    Logged-in user accepts an invite, becoming a WorkspaceMember with the invited role
// @route   POST /api/invites/accept/:token
// @access  Private
export const acceptInvite = async (req, res, next) => {
  try {
    const { token } = req.params;
    const userId = req.user.id;

    if (!token || typeof token !== "string" || token.length > 128) {
      res.status(400);
      throw new Error("Invalid invite link");
    }

    const invite = await Invite.findOne({ token });
    if (!invite) {
      res.status(404);
      throw new Error("This invite link is invalid or no longer exists");
    }

    if (invite.expiresAt < Date.now()) {
      await Invite.deleteOne({ _id: invite._id });
      res.status(400);
      throw new Error("This invite has expired");
    }

    if (invite.status !== "pending") {
      res.status(400);
      throw new Error("This invite is no longer valid");
    }

    const user = await User.findById(userId);
    if (!user || user.email.toLowerCase() !== invite.email.toLowerCase()) {
      res.status(403);
      throw new Error("This invite is not valid for your account");
    }

    const alreadyMember = await WorkspaceMember.findOne({ userId, workspaceId: invite.workspaceId });
    if (alreadyMember) {
      await Invite.deleteOne({ _id: invite._id });
      res.status(400);
      throw new Error("You are already a member of this workspace");
    }

    if (invite.role === "Admin") {
      const adminCount = await WorkspaceMember.countDocuments({ workspaceId: invite.workspaceId, role: "Admin" });
      if (adminCount >= 2) {
        await Invite.deleteOne({ _id: invite._id });
        res.status(400);
        throw new Error("This workspace already has the maximum of 2 Admins — invite is no longer valid");
      }
    }

    const membership = await WorkspaceMember.create({
      userId,
      workspaceId: invite.workspaceId,
      role: invite.role,
    });

    await Invite.deleteOne({ _id: invite._id });

    logActivity({
      workspace: membership.workspaceId,
      user: userId,
      action: "MEMBER_JOINED",
      targetType: "Membership",
      targetId: membership._id,
      metadata: { role: membership.role },
    });

    res.status(200).json({
      success: true,
      message: "Invite accepted successfully",
      data: { workspaceId: membership.workspaceId, role: membership.role },
    });
  } catch (error) {
    next(error);
  }
};