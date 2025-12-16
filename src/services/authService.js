import { store } from '../store/store';
import { loginSuccess, logout } from '../store/authSlice';
import {
  getAccessToken,
  getRefreshToken,
  getUserId,
  getEmail,
  clear,
} from '../lib/secureStore';
import { refreshToken as refreshAuthToken } from './apiService';
import { executeQuery } from './apiService';
import { VERIFY_TOKEN_QUERY } from '../graphql/authQueries';

/**
 * Check if user is authenticated by verifying tokens
 * @returns {Promise<boolean>} True if user is authenticated, false otherwise
 */
export const isAuthenticated = async () => {
  try {
    const idToken = await getAccessToken();

    // If no token, user is not authenticated
    if (!idToken) {
      return false;
    }

    // Verify the token using the verifyToken query
    const response = await executeQuery(
      VERIFY_TOKEN_QUERY,
      { idToken },
      'verifyToken',
    );

    // If verification is successful, user is authenticated
    if (response.success && response.data.verifyToken.status) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('[AuthService] Error checking authentication status:', error);
    return false;
  }
};

/**
 * Auto-login user by checking stored tokens
 * @returns {Promise<boolean>} True if auto-login successful, false otherwise
 */
export const autoLogin = async () => {
  try {
    console.log('[AuthService] Attempting auto-login');

    // Get tokens from secure storage
    const idToken = await getAccessToken();
    const refreshToken = await getRefreshToken();
    const userId = await getUserId();
    const email = await getEmail();

    // Log token information for debugging
    // console.log(
    //   'id ,,,,',
    //   idToken,
    //   '....',
    //   refreshToken,
    //   'userId',
    //   userId,
    //   'email',
    //   email,
    // );

    // Check if we have all required tokens
    if (!idToken || !refreshToken) {
      console.log('[AuthService] Missing required tokens for auto-login');
      return false;
    }

    // Try to refresh the token to verify it's still valid
    console.log('[AuthService] Attempting token refresh to verify validity');
    try {
      // Try to refresh the token
      const refreshedTokens = await refreshAuthToken();

      // Update Redux store with refreshed tokens
      store.dispatch(
        loginSuccess({
          idToken: refreshedTokens.idToken,
          refreshToken: refreshedTokens.refreshToken,
          userId,
          email,
        }),
      );

      console.log('[AuthService] Auto-login successful with token refresh');
      return true;
    } catch (refreshError) {
      console.error(
        '[AuthService] Token refresh failed during auto-login:',
        refreshError,
      );
      // Clear tokens and logout
      await clear();
      store.dispatch(logout());
      return false;
    }
  } catch (error) {
    console.error('[AuthService] Error during auto-login:', error);
    return false;
  }
};

/**
 * Logout user by clearing tokens and updating Redux store
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    console.log('[AuthService] Logging out user');

    // Clear tokens from secure storage
    await clear();

    // Dispatch logout action to update Redux store
    store.dispatch(logout());

    console.log('[AuthService] User logged out successfully');
  } catch (error) {
    console.error('[AuthService] Error during logout:', error);
  }
};

export default {
  isAuthenticated,
  autoLogin,
  logoutUser,
};
