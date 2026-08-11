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
  // Logout
  logout() {
    return api.post(APIs.LOGOUT);
  }
}

export default new APICallService();