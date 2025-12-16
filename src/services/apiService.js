import { gql } from '@apollo/client';
import { store } from '../store/store';
import {
  logout,
  refreshStart,
  refreshSuccess,
  refreshFailure,
} from '../store/authSlice';
import { ERROR_CODES } from '../utils/graphqlUtils';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  setUserId,
  setEmail,
  clear,
} from '../lib/secureStore';
import client from './apolloClient';

// List of public operations that don't require authentication
const PUBLIC_OPERATIONS = [
  'createUser',
  'login',
  'register',
  'sendOtpForSignup',
  'verifyOtpForSignup',
];

/**
 * Save tokens to secure storage
 */
export const saveTokens = async tokens => {
  try {
    const { idToken, refreshToken, userId, email } = tokens;

    console.log('[Auth] Saving tokens to storage');
    if (idToken) await setAccessToken(idToken);
    if (refreshToken) await setRefreshToken(refreshToken);
    if (userId) await setUserId(userId);
    if (email) await setEmail(email);
    console.log('[Auth] Tokens saved successfully');
  } catch (error) {
    console.error('[Auth] Error saving tokens to storage:', error);
  }
};

/**
 * Clear tokens from secure storage
 */
export const clearTokens = async () => {
  try {
    console.log('[Auth] Clearing tokens from storage');
    await clear();
    console.log('[Auth] Tokens cleared successfully');
  } catch (error) {
    console.error('[Auth] Error clearing tokens from storage:', error);
  }
};

/**
 * Refresh auth token
 */
export const refreshToken = async () => {
  try {
    console.log('[Auth] Attempting token refresh');

    // Get refresh token from storage
    const refreshTokenValue = await getRefreshToken();

    if (!refreshTokenValue) {
      console.warn('[Auth] No refresh token available');
      throw new Error('No refresh token available');
    }

    // Dispatch refresh start action
    store.dispatch(refreshStart());
    console.log('[Auth] Dispatched refresh start');

    // Make refresh token request
    const REFRESH_MUTATION = gql`
      mutation RefreshToken($refreshToken: String!) {
        refreshToken(refreshToken: $refreshToken) {
          idToken
          refreshToken
          uid
          email
        }
      }
    `;

    console.log('[Auth] Executing refresh token mutation');
    const response = await client.mutate({
      mutation: REFRESH_MUTATION,
      variables: { refreshToken: refreshTokenValue },
    });

    console.log('[Auth] Refresh token response:', response.data);
    const {
      idToken,
      refreshToken: newRefreshToken,
      uid,
      email,
    } = response.data.refreshToken;

    // Save new tokens
    await saveTokens({ idToken, refreshToken: newRefreshToken });

    // Dispatch refresh success action
    store.dispatch(refreshSuccess({ idToken, refreshToken: newRefreshToken }));
    console.log('[Auth] Dispatched refresh success');

    return { idToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error('[Auth] Token refresh failed:', error);

    // Clear tokens and dispatch failure action
    await clearTokens();
    store.dispatch(refreshFailure(error.message));
    store.dispatch(logout());

    throw error;
  }
};

/**
 * Check if operation requires authentication
 */
const requiresAuth = operationName => {
  const needsAuth = !PUBLIC_OPERATIONS.includes(operationName);
  console.log(
    `[Auth] Operation "${operationName}" requires authentication: ${needsAuth}`,
  );
  return needsAuth;
};

/**
 * Execute GraphQL query with automatic token refresh on 401
 */
export const executeQuery = async (
  query,
  variables = {},
  operationName = 'Query',
) => {
  try {
    console.log(`[GraphQL Query] Executing ${operationName}`, { variables });

    // Only check token for authenticated operations
    if (requiresAuth(operationName)) {
      // For now, we'll rely on 401 error handling to trigger token refresh
      // In the future, we could add proactive token validation here
      console.log(
        `[GraphQL Query] Operation ${operationName} requires authentication`,
      );
    }

    // Execute query
    const response = await client.query({
      query,
      variables,
    });

    console.log(`[GraphQL Query] Success ${operationName}`, response.data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`[GraphQL Query] Error ${operationName}`, error);

    // Only attempt token refresh for authenticated operations
    if (
      requiresAuth(operationName) &&
      (error.networkError?.statusCode === 401 ||
        error.graphQLErrors?.some(
          err => err.extensions?.code === ERROR_CODES.TOKEN_EXPIRED,
        ))
    ) {
      try {
        console.log(
          `[GraphQL Query] Token refresh attempt for ${operationName}`,
        );
        // Try to refresh token and retry
        await refreshToken();

        // Retry the original query
        console.log(
          `[GraphQL Query] Retrying ${operationName} after token refresh`,
        );
        const response = await client.query({
          query,
          variables,
        });

        console.log(
          `[GraphQL Query] Retry success ${operationName}`,
          response.data,
        );
        return {
          success: true,
          data: response.data,
        };
      } catch (refreshError) {
        console.error(
          `[GraphQL Query] Token refresh failed for ${operationName}`,
          refreshError,
        );
        // If refresh fails, logout user
        store.dispatch(logout());
        await clearTokens();

        return {
          success: false,
          error: {
            code: ERROR_CODES.TOKEN_EXPIRED,
            message: 'Session expired. Please log in again.',
          },
        };
      }
    }

    // Handle other errors
    return {
      success: false,
      error: {
        code: ERROR_CODES.SERVER_ERROR,
        message: error.message || 'An unexpected error occurred.',
      },
    };
  }
};

/**
 * Execute GraphQL mutation with automatic token refresh on 401
 */
export const executeMutation = async (
  mutation,
  variables = {},
  operationName = 'Mutation',
) => {
  try {
    console.log(`[GraphQL Mutation] Executing ${operationName}`, { variables });

    // Only check token for authenticated operations
    if (requiresAuth(operationName)) {
      // For now, we'll rely on 401 error handling to trigger token refresh
      // In the future, we could add proactive token validation here
      console.log(
        `[GraphQL Mutation] Operation ${operationName} requires authentication`,
      );
    }

    // Execute mutation
    const response = await client.mutate({
      mutation,
      variables,
    });

    console.log(`[GraphQL Mutation] Success ${operationName}`, response.data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`[GraphQL Mutation] Error ${operationName}`, error);

    // Only attempt token refresh for authenticated operations
    if (
      requiresAuth(operationName) &&
      (error.networkError?.statusCode === 401 ||
        error.graphQLErrors?.some(
          err => err.extensions?.code === ERROR_CODES.TOKEN_EXPIRED,
        ))
    ) {
      try {
        console.log(
          `[GraphQL Mutation] Token refresh attempt for ${operationName}`,
        );
        // Try to refresh token and retry
        await refreshToken();

        // Retry the original mutation
        console.log(
          `[GraphQL Mutation] Retrying ${operationName} after token refresh`,
        );
        const response = await client.mutate({
          mutation,
          variables,
        });

        console.log(
          `[GraphQL Mutation] Retry success ${operationName}`,
          response.data,
        );
        return {
          success: true,
          data: response.data,
        };
      } catch (refreshError) {
        console.error(
          `[GraphQL Mutation] Token refresh failed for ${operationName}`,
          refreshError,
        );
        // If refresh fails, logout user
        store.dispatch(logout());
        await clearTokens();

        return {
          success: false,
          error: {
            code: ERROR_CODES.TOKEN_EXPIRED,
            message: 'Session expired. Please log in again.',
          },
        };
      }
    }

    // Handle other errors
    return {
      success: false,
      error: {
        code: ERROR_CODES.SERVER_ERROR,
        message: error.message || 'An unexpected error occurred.',
      },
    };
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  console.log('[Auth] Logging out user');
  // Clear tokens from storage
  await clearTokens();

  // Dispatch logout action
  store.dispatch(logout());
  console.log('[Auth] Logout completed');
};
