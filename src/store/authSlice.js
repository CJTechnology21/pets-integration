import { createSlice } from '@reduxjs/toolkit';

// Initial state for authentication
const initialState = {
  idToken: null,
  refreshToken: null,
  userId: null,
  email: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Create auth slice
const authSlice = createSlice({
  name: '@@app/auth',
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { idToken, refreshToken, userId, email } = action.payload;
      state.idToken = idToken;
      state.refreshToken = refreshToken;
      state.userId = userId;
      state.email = email;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    
    // Token refresh actions
    refreshStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    refreshSuccess: (state, action) => {
      const { idToken, refreshToken } = action.payload;
      state.idToken = idToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    refreshFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      // On refresh failure, clear auth state
      state.idToken = null;
      state.refreshToken = null;
      state.userId = null;
      state.email = null;
      state.isAuthenticated = false;
    },
    
    // Logout action
    logout: (state) => {
      // Clear all auth state
      state.idToken = null;
      state.refreshToken = null;
      state.userId = null;
      state.email = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    
    // Set user info (e.g., after registration)
    setUser: (state, action) => {
      const { userId, email } = action.payload;
      state.userId = userId;
      state.email = email;
    },
  },
});

// Export actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  refreshStart,
  refreshSuccess,
  refreshFailure,
  logout,
  setUser,
} = authSlice.actions;

// Export selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.idToken;
export const selectRefreshToken = (state) => state.auth.refreshToken;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserId = (state) => state.auth.userId;
export const selectUserEmail = (state) => state.auth.email;

// Export reducer
export default authSlice.reducer;