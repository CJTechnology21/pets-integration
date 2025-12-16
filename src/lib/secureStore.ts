import AsyncStorage from '@react-native-async-storage/async-storage';

// Secure storage keys
const SECURE_STORAGE_KEYS = {
  ID_TOKEN: 'idToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_ID: 'userId',
  EMAIL: 'email',
};

/**
 * Get access token from secure storage
 * @returns {Promise<string|null>} Access token or null if not found
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(SECURE_STORAGE_KEYS.ID_TOKEN);
  } catch (error) {
    console.error('[SecureStore] Error getting access token:', error);
    return null;
  }
};

/**
 * Set access token in secure storage
 * @param {string} idToken - Access token to store
 * @returns {Promise<void>}
 */
export const setAccessToken = async (idToken: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(SECURE_STORAGE_KEYS.ID_TOKEN, idToken);
  } catch (error) {
    console.error('[SecureStore] Error setting access token:', error);
  }
};

/**
 * Get refresh token from secure storage
 * @returns {Promise<string|null>} Refresh token or null if not found
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(SECURE_STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('[SecureStore] Error getting refresh token:', error);
    return null;
  }
};

/**
 * Set refresh token in secure storage
 * @param {string} refreshToken - Refresh token to store
 * @returns {Promise<void>}
 */
export const setRefreshToken = async (refreshToken: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(SECURE_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  } catch (error) {
    console.error('[SecureStore] Error setting refresh token:', error);
  }
};

/**
 * Get user ID from secure storage
 * @returns {Promise<string|null>} User ID or null if not found
 */
export const getUserId = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(SECURE_STORAGE_KEYS.USER_ID);
  } catch (error) {
    console.error('[SecureStore] Error getting user ID:', error);
    return null;
  }
};

/**
 * Set user ID in secure storage
 * @param {string} userId - User ID to store
 * @returns {Promise<void>}
 */
export const setUserId = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(SECURE_STORAGE_KEYS.USER_ID, userId);
  } catch (error) {
    console.error('[SecureStore] Error setting user ID:', error);
  }
};

/**
 * Get email from secure storage
 * @returns {Promise<string|null>} Email or null if not found
 */
export const getEmail = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(SECURE_STORAGE_KEYS.EMAIL);
  } catch (error) {
    console.error('[SecureStore] Error getting email:', error);
    return null;
  }
};

/**
 * Set email in secure storage
 * @param {string} email - Email to store
 * @returns {Promise<void>}
 */
export const setEmail = async (email: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(SECURE_STORAGE_KEYS.EMAIL, email);
  } catch (error) {
    console.error('[SecureStore] Error setting email:', error);
  }
};

/**
 * Clear all authentication tokens from secure storage
 * @returns {Promise<void>}
 */
export const clear = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      SECURE_STORAGE_KEYS.ID_TOKEN,
      SECURE_STORAGE_KEYS.REFRESH_TOKEN,
      SECURE_STORAGE_KEYS.USER_ID,
      SECURE_STORAGE_KEYS.EMAIL,
    ]);
  } catch (error) {
    console.error('[SecureStore] Error clearing secure storage:', error);
  }
};

export default {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  getUserId,
  setUserId,
  getEmail,
  setEmail,
  clear,
};
