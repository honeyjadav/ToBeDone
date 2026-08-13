import api from "./api";
import { APIs } from "../constants/APIConstants";

class APICallService {
  // Login - Step 1
  userLogin(formData) {
    return api.post(APIs.LOGIN, formData);
  }

  // Login - Step 2
  verifyLoginOtp(formData) {
    return api.post(APIs.LOGIN_VERIFY_OTP, formData);
  }

  // Resend login OTP
  resendLoginOtp(email) {
    return api.post(APIs.LOGIN_RESEND_OTP, {
      email,
    });
  }

  // Register
  register(formData) {
    return api.post(APIs.REGISTER, formData);
  }

  // Register OTP
  verifyOtp(formData) {
    return api.post(APIs.VERIFY_OTP, formData);
  }

  // Resend registration OTP
  resendOtp(email) {
    return api.post(APIs.RESEND_OTP, {
      email,
    });
  }

  // Forgot password
  forgotPassword(email) {
    return api.post(APIs.FORGOT_PASSWORD, {
      email,
    });
  }

  //Reset Paaword
  resetPassword(formData){
    return api.post(APIs.RESET_PASSWORD, formData);
  }

  // Change password (logged-in user)
  changePassword(formData) {
    return api.patch(APIs.CHANGE_PASSWORD, formData);
  }
  
  // Logout
  logout() {
    return api.post(APIs.LOGOUT);
  }

  // Get logged-in user's profile
  getMe() {
      return api.get(APIs.GET_ME);
  }

  updateProfile(name) {
    return api.patch(APIs.UPDATE_PROFILE, {
        name,
    });
}
   // ---- Workspaces ----

  // Create a workspace (creator becomes Admin)
  createWorkspace(formData) {
    return api.post(APIs.WORKSPACES, formData);
  }

  // Get all workspaces the logged-in user belongs to
  getMyWorkspaces() {
    return api.get(APIs.WORKSPACES);
  }

  // Update a workspace (Admin only)
  updateWorkspace(workspaceId, formData) {
    return api.patch(APIs.WORKSPACE_BY_ID(workspaceId), formData);
  }

  // Delete a workspace (Admin only)
  deleteWorkspace(workspaceId) {
    return api.delete(APIs.WORKSPACE_BY_ID(workspaceId));
  }

  // Get members of a workspace
  getWorkspaceMembers(workspaceId) {
    return api.get(APIs.WORKSPACE_MEMBERS(workspaceId));
  }

  // Update a member's role (Admin only)
  updateMemberRole(workspaceId, memberId, role) {
    return api.patch(APIs.WORKSPACE_MEMBER_ROLE(workspaceId, memberId), { role });
  }

  // Remove a member (Admin only)
  removeMember(workspaceId, memberId) {
    return api.delete(APIs.WORKSPACE_MEMBER_REMOVE(workspaceId, memberId));
  }

  // Send a workspace invite
  sendWorkspaceInvite(workspaceId, inviteData) {
    return api.post(APIs.INVITES(workspaceId), inviteData);
  }

  // Get pending invites for a workspace
  getWorkspaceInvites(workspaceId) {
    return api.get(APIs.INVITES(workspaceId));
  }

  // Accept an invite via token
  acceptInvite(token) {
    return api.post(APIs.INVITE_ACCEPT(token));
  }

   // Get a single workspace by id
  getWorkspaceById(workspaceId) {
    return api.get(APIs.WORKSPACE_BY_ID(workspaceId));
  }
}

export default new APICallService();