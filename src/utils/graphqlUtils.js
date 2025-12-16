import Toast from 'react-native-toast-message';

// Standardized error codes as per project requirements
export const ERROR_CODES = {
  INVALID_INPUT: 'INVALID_INPUT',
  WRONG_CREDENTIALS: 'WRONG_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  RATE_LIMIT: 'RATE_LIMIT',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_OFFLINE: 'NETWORK_OFFLINE',
};

// Map GraphQL errors to standardized error structure
export const normalizeGraphQLError = (error) => {
  console.log('[GraphQL] Normalizing error:', error);
  
  // Handle network errors
  if (error.networkError) {
    console.log('[GraphQL] Network error detected:', error.networkError);
    return {
      code: ERROR_CODES.NETWORK_OFFLINE,
      message: 'Network connection failed. Please check your internet connection.',
    };
  }

  // Handle GraphQL errors
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const gqlError = error.graphQLErrors[0];
    console.log('[GraphQL] GraphQL error detected:', gqlError);
    const errorCode = gqlError.extensions?.code;

    switch (errorCode) {
      case 'INVALID_INPUT':
        return {
          code: ERROR_CODES.INVALID_INPUT,
          message: gqlError.message || 'Invalid input provided.',
        };
      case 'WRONG_CREDENTIALS':
        return {
          code: ERROR_CODES.WRONG_CREDENTIALS,
          message: 'Incorrect email or password.',
        };
      case 'TOKEN_EXPIRED':
        return {
          code: ERROR_CODES.TOKEN_EXPIRED,
          message: 'Session expired. Please log in again.',
        };
      case 'USER_NOT_FOUND':
        return {
          code: ERROR_CODES.USER_NOT_FOUND,
          message: 'User not found.',
        };
      case 'RATE_LIMIT':
        return {
          code: ERROR_CODES.RATE_LIMIT,
          message: 'Too many requests. Please try again later.',
        };
      default:
        return {
          code: ERROR_CODES.SERVER_ERROR,
          message: 'Something went wrong. Please try again later.',
        };
    }
  }

  // Default error
  console.log('[GraphQL] Unknown error type:', error);
  return {
    code: ERROR_CODES.SERVER_ERROR,
    message: 'An unexpected error occurred.',
  };
};

// Display toast notification for API responses
export const showToast = (message, type = 'info') => {
  console.log(`[Toast] Showing ${type} message:`, message);
  
  Toast.show({
    type: type,
    text1: type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Information',
    text2: message,
    position: 'top',
    visibilityTime: 4000,
    autoHide: true,
  });
};

// Enhanced logging for API responses
export const logApiResponse = (operationName, response, isSuccess = true) => {
  if (isSuccess) {
    console.log(`[API Success] ${operationName}:`, response);
  } else {
    console.error(`[API Error] ${operationName}:`, response);
  }
};

// Wrap API calls with standardized error handling and logging
export const handleApiCall = async (apiCall, successMessage, operationName = 'API Call') => {
  try {
    console.log(`[API] Executing ${operationName}`);
    const response = await apiCall();
    
    if (response.success) {
      logApiResponse(operationName, response, true);
      if (successMessage) {
        showToast(successMessage, 'success');
      }
    } else {
      logApiResponse(operationName, response, false);
      // Check if this is a business logic error with a message
      if (response.error && response.error.message) {
        showToast(response.error.message, 'error');
      }
    }
    
    return response;
  } catch (error) {
    console.error(`[API Exception] ${operationName} failed:`, error);
    const normalizedError = normalizeGraphQLError(error);
    showToast(normalizedError.message, 'error');
    
    return {
      success: false,
      error: normalizedError,
    };
  }
};