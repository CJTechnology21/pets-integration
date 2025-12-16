import { executeMutation, executeQuery } from './apiService';
import {
  CREATE_USER_MUTATION,
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  GET_USER_PROFILE_QUERY,
  SEND_OTP_FOR_SIGNUP,
  VERIFY_OTP_FOR_SIGNUP,
  SEND_PASSWORD_RESET_EMAIL,
  SEND_PASSWORD_RESET_PHONE,
} from '../graphql/authQueries';

/**
 * User Service - Handles all user-related GraphQL operations
 */
class UserService {
  /**
   * Create a new user
   */
  static async createUser(userData) {
    try {
      // Convert dob format from DD/MM/YYYY to DD-MM-YYYY as required by the API
      const formattedUserData = {
        ...userData,
        dob: userData.dob.replace(/\//g, '-'),
      };

      const response = await executeMutation(
        CREATE_USER_MUTATION,
        formattedUserData,
        'createUser',
      );

      if (response.success) {
        console.log('[UserService] User created successfully:', response.data);
      } else {
        console.error('[UserService] Failed to create user:', response.error);
      }

      return response;
    } catch (error) {
      console.error('[UserService] Exception during user creation:', error);
      return {
        success: false,
        error: error.message || 'Failed to create user',
      };
    }
  }

  /**
   * Send OTP for signup
   */
  static async sendOtpForSignup(email) {
    try {
      console.log('[UserService] Sending OTP for signup to email:', email);

      const response = await executeMutation(
        SEND_OTP_FOR_SIGNUP,
        { email },
        'sendOtpForSignup',
      );

      if (response.success) {
        console.log('[UserService] OTP sent successfully:', response.data);
      } else {
        console.error('[UserService] Failed to send OTP:', response.error);
      }

      return response;
    } catch (error) {
      console.error('[UserService] Exception during OTP sending:', error);
      return {
        success: false,
        error: error.message || 'Failed to send OTP',
      };
    }
  }

  /**
   * Verify OTP for signup
   */
  static async verifyOtpForSignup(email, otp) {
    try {
      console.log(
        '[UserService] Verifying OTP for signup - Email:',
        email,
        'OTP:',
        otp,
      );

      const response = await executeMutation(
        VERIFY_OTP_FOR_SIGNUP,
        { email, otp },
        'verifyOtpForSignup',
      );

      if (response.success) {
        console.log('[UserService] OTP verified successfully:', response.data);
      } else {
        console.error('[UserService] Failed to verify OTP:', response.error);
      }

      return response;
    } catch (error) {
      console.error('[UserService] Exception during OTP verification:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify OTP',
      };
    }
  }

  /**
   * Login user
   */
  static async login(email, password) {
    try {
      console.log('[UserService] Logging in user:', email);

      const response = await executeMutation(
        LOGIN_MUTATION,
        { email, password },
        'login',
      );

      if (response.success) {
        console.log('[UserService] Login response received:', response.data);

        // Check the business logic status in the response
        const loginResponse = response.data.login;

        if (loginResponse.status === true) {
          // Successful login
          console.log('[UserService] Login successful:', loginResponse);
          return {
            success: true,
            data: response.data,
          };
        } else {
          // Business logic error (e.g., user not found, wrong credentials)
          console.log(
            '[UserService] Login failed with business error:',
            loginResponse,
          );
          return {
            success: false,
            error: {
              code: 'LOGIN_FAILED',
              message: loginResponse.message || 'Login failed',
            },
          };
        }
      } else {
        console.error(
          '[UserService] Login failed with network/graphql error:',
          response.error,
        );
        return response;
      }
    } catch (error) {
      console.error('[UserService] Exception during login:', error);
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  }

  /**
   * Register user
   */
  static async register(email, password, name) {
    try {
      console.log('[UserService] Registering user:', email);

      const response = await executeMutation(
        REGISTER_MUTATION,
        { email, password, name },
        'register',
      );

      if (response.success) {
        console.log('[UserService] Registration successful:', response.data);
      } else {
        console.error('[UserService] Registration failed:', response.error);
      }

      return response;
    } catch (error) {
      console.error('[UserService] Exception during registration:', error);
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  }

  /**
   * Get user profile
   */
  static async getUserProfile() {
    try {
      console.log('[UserService] Fetching user profile');

      const response = await executeQuery(
        GET_USER_PROFILE_QUERY,
        {},
        'getUserProfile',
      );

      if (response.success) {
        console.log(
          '[UserService] User profile fetched successfully:',
          response.data,
        );
      } else {
        console.error(
          '[UserService] Failed to fetch user profile:',
          response.error,
        );
      }

      return response;
    } catch (error) {
      console.error(
        '[UserService] Exception during user profile fetch:',
        error,
      );
      return {
        success: false,
        error: error.message || 'Failed to fetch user profile',
      };
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email) {
    try {
      console.log('[UserService] Sending password reset email to:', email);

      const response = await executeMutation(
        SEND_PASSWORD_RESET_EMAIL,
        { email },
        'sendPasswordResetEmail',
      );

      if (response.success) {
        console.log(
          '[UserService] Password reset email sent successfully:',
          response.data,
        );

        // Check the business logic status in the response
        const resetResponse = response.data.sendPasswordResetEmail;

        if (resetResponse.status === true) {
          // Successful reset email sent
          console.log(
            '[UserService] Password reset email sent successfully:',
            resetResponse,
          );
          return {
            success: true,
            data: response.data,
          };
        } else {
          // Business logic error
          console.log(
            '[UserService] Password reset failed with business error:',
            resetResponse,
          );
          return {
            success: false,
            error: {
              code: 'RESET_FAILED',
              message:
                resetResponse.message || 'Failed to send password reset email',
            },
          };
        }
      } else {
        console.error(
          '[UserService] Failed to send password reset email:',
          response.error,
        );
        return response;
      }
    } catch (error) {
      console.error(
        '[UserService] Exception during password reset email sending:',
        error,
      );
      return {
        success: false,
        error: error.message || 'Failed to send password reset email',
      };
    }
  }

  /**
   * Send password reset phone
   */
  static async sendPasswordResetPhone(phoneNumber) {
    try {
      console.log('[UserService] Sending password reset SMS to:', phoneNumber);

      const response = await executeMutation(
        SEND_PASSWORD_RESET_PHONE,
        { phoneNumber },
        'sendPasswordResetPhone',
      );

      if (response.success) {
        console.log(
          '[UserService] Password reset SMS sent successfully:',
          response.data,
        );

        // Check the business logic status in the response
        const resetResponse = response.data.sendPasswordResetPhone;

        if (resetResponse.status === true) {
          // Successful reset SMS sent
          console.log(
            '[UserService] Password reset SMS sent successfully:',
            resetResponse,
          );
          return {
            success: true,
            data: response.data,
          };
        } else {
          // Business logic error
          console.log(
            '[UserService] Password reset failed with business error:',
            resetResponse,
          );
          return {
            success: false,
            error: {
              code: 'RESET_FAILED',
              message:
                resetResponse.message || 'Failed to send password reset SMS',
            },
          };
        }
      } else {
        console.error(
          '[UserService] Failed to send password reset SMS:',
          response.error,
        );
        return response;
      }
    } catch (error) {
      console.error(
        '[UserService] Exception during password reset SMS sending:',
        error,
      );
      return {
        success: false,
        error: error.message || 'Failed to send password reset SMS',
      };
    }
  }
}

export default UserService;
