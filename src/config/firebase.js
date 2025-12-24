/**
 * Firebase Configuration
 *
 * This file contains the configuration for Firebase services.
 *
 * To use Firebase in your project, you need to:
 * 1. Create a Firebase project at https://console.firebase.google.com/
 * 2. Copy your project's configuration from Project Settings > General
 * 3. Replace the placeholder values below with your actual Firebase config
 */

// Firebase imports
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Firebase configuration - REPLACE WITH YOUR ACTUAL CONFIG
export const firebaseConfig = {
  apiKey: 'AIzaSyDCsJFhj1l8BcP2_40BrTiNuXvPIEytBBE',
  authDomain: 'petapp-11fa3.firebaseapp.com',
  projectId: 'petapp-11fa3',
  storageBucket: 'petapp-11fa3.firebasestorage.app',
  messagingSenderId: '866670879122',
  appId: '1:866670879122:web:de60e2c781e336caf9214b',
  measurementId: 'G-MVDSGW4XE0',
};

/**
 * Firebase Service Initialization
 */
export const initializeFirebase = () => {
  try {
    // Validate Firebase config
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY') {
      console.warn(
        '[Firebase] Firebase config contains placeholder values. Please update with actual values from Firebase Console.',
      );
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Initialize Firebase Auth
    const firebaseAuth = firebase.auth();
    console.log('[Firebase] Firebase Auth initialized');
    return firebaseAuth;
  } catch (error) {
    console.error('[Firebase] Error initializing Firebase:', error);
    return null;
  }
};

/**
 * Test Google Sign-In Configuration
 */
export const testGoogleSignInConfig = async () => {
  try {
    // IMPORTANT: isSignedIn() is deprecated/removed. Using hasPreviousSignIn() instead.
    const isConfigured = GoogleSignin.hasPreviousSignIn();
    console.log('[Firebase] Google Sign-In configuration test (hasPreviousSignIn):', {
      isConfigured,
    });
    return isConfigured;
  } catch (error) {
    console.error(
      '[Firebase] Google Sign-In configuration test failed:',
      error,
    );
    return false;
  }
};

/**
 * Firebase Google Sign-In Implementation
 */
export const firebaseGoogleSignIn = async () => {
  try {
    // Check if play services are available
    await GoogleSignin.hasPlayServices();

    // Sign in with Google
    const { idToken } = await GoogleSignin.signIn();

    // Validate token
    if (!idToken) {
      throw new Error('No ID token received from Google Sign-In');
    }

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const userCredential = await auth().signInWithCredential(googleCredential);

    // User is signed in
    console.log('[Firebase] User signed in:', userCredential.user);
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error) {
    console.error('[Firebase] Google Sign-In error:', error);

    // Handle specific errors
    if (error.code === '10') {
      // DEVELOPER_ERROR
      console.error(
        '[Firebase] Google Sign-In DEVELOPER_ERROR (code 10). Check Google Sign-In configuration.',
      );
    }

    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Firebase Sign-Out Implementation
 */
export const firebaseSignOut = async () => {
  try {
    await auth().signOut();
    console.log('[Firebase] User signed out');
    return {
      success: true,
    };
  } catch (error) {
    console.error('[Firebase] Sign-out error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  firebaseConfig,
  initializeFirebase,
  firebaseGoogleSignIn,
  firebaseSignOut,
  testGoogleSignInConfig,
};
