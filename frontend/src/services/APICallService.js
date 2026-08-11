import api from "./api";
import { APIs } from "../constants/APIConstants";

class APICallService {
  // Step 1:
  // Email + password -> OTP sent
  userLogin(formData) {
    return api.post(APIs.LOGIN, formData);
  }

  // Step 2:
  // Email + OTP -> access token
  verifyLoginOtp(formData) {
    return api.post(APIs.LOGIN_VERIFY_OTP, formData);
  }

  // Resend login OTP
  resendLoginOtp(email) {
    return api.post(APIs.LOGIN_RESEND_OTP, {
      email,
    });
  }

  register(formData) {
    return api.post(APIs.REGISTER, formData);
  }

  verifyOtp(formData) {
    return api.post(APIs.VERIFY_OTP, formData);
  }

  resendOtp(email) {
    return api.post(APIs.RESEND_OTP, {
      email,
    });
  }

  logout() {
    return api.post(APIs.LOGOUT);
  }
}

export default new APICallService();

