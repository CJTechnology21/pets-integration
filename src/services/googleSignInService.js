import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { saveTokens } from './apiService';
import { store } from '../store/store';
import { loginSuccess } from '../store/authSlice';

/**
 * Validate Google Sign-In configuration
 */
const validateGoogleSignInConfig = async () => {
  try {
    // Check if Google Sign-In has a previous sign-in (synchronous)
    // IMPORTANT: isSignedIn() has been REMOVED in the installed version of the library.
    // Using isSignedIn() WILL crash the app. Do not change this back.
    const hasPrevious = GoogleSignin.hasPreviousSignIn();
    
    console.log('[GoogleSignIn] Configuration check (hasPreviousSignIn):', hasPrevious);
    return true;
  } catch (error) {
    console.warn('[GoogleSignIn] Configuration validation warning:', error);
    return true;
  }
};

/**
 * Configure Google Sign-In
 */
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
    webClientId:
      '866670879122-039tdkivpv9ab3rs6bgtlmoeg6uf56no.apps.googleusercontent.com', // GET THIS FROM GOOGLE CLOUD CONSOLE -> APIs & Services -> Credentials
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below
  });
};

/**
 * Sign in with Google using Firebase Auth
 */
export const signInWithGoogle = async () => {
  try {
    // Check if play services are available
    console.log('[GoogleSignIn] Checking Play Services...');
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    } catch (playServicesError) {
      console.error('[GoogleSignIn] Play Services check failed:', playServicesError);
      if (playServicesError.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
         throw new Error('Google Play Services are not available or outdated');
      }
      // If "Activity is null" occurs here, it means the context is lost.
      // We re-throw properly to handle it.
      throw playServicesError;
    }

    // Sign in
    console.log('[GoogleSignIn] Attempting sign in...');
    const userInfo = await GoogleSignin.signIn();

    // Validate userInfo
    if (!userInfo || !userInfo.data) {
      throw new Error('Invalid user info received from Google Sign-In');
    }

    // Extract idToken and accessToken
    const { idToken, accessToken } = userInfo.data;

    // Validate tokens
    if (!idToken) {
      throw new Error('No ID token received from Google Sign-In');
    }

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(
      idToken,
      accessToken,
    );

    // Sign-in the user with the credential
    const userCredential = await auth().signInWithCredential(googleCredential);
    const firebaseUser = userCredential.user;

    // Get Firebase tokens
    const idTokenResult = await firebaseUser.getIdTokenResult();
    
    // Convert user to JSON to safely access properties like refreshToken if available,
    // or to debug what info we actually have (phone, email, etc.)
    const userJson = firebaseUser.toJSON();
    console.log('[GoogleSignIn] User data from Firebase:', JSON.stringify(userJson, null, 2));

    // Prepare tokens for storage
    // Note: refreshToken might not be available in all native SDK versions directly.
    // We try to get it from the JSON object.
    const firebaseTokens = {
      idToken: idTokenResult.token,
      refreshToken: userJson.refreshToken || '', 
      userId: firebaseUser.uid,
      email: firebaseUser.email,
      googleIdToken: idToken, 
    };
    
    // Check if we have phone number or other details
    if (firebaseUser.phoneNumber) {
        console.log('[GoogleSignIn] Phone number found:', firebaseUser.phoneNumber);
    } else {
        console.log('[GoogleSignIn] No phone number in Firebase user profile.');
    }

    // Save tokens to secure storage
    await saveTokens(firebaseTokens);

    // Dispatch login success action to update Redux state
    store.dispatch(loginSuccess(firebaseTokens));

    return {
      success: true,
      data: firebaseTokens,
    };
  } catch (error) {
    console.error('[GoogleSignIn] Error signing in:', error);

    // Handle specific Google Sign-In errors
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return {
        success: false,
        error: {
          code: 'SIGN_IN_CANCELLED',
          message: 'Sign in was cancelled',
        },
      };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      return {
        success: false,
        error: {
          code: 'IN_PROGRESS',
          message: 'Sign in is already in progress',
        },
      };
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return {
        success: false,
        error: {
          code: 'PLAY_SERVICES_NOT_AVAILABLE',
          message: 'Play services not available or outdated',
        },
      };
    } else if (error.code === '10') {
      // DEVELOPER_ERROR
      console.error(
        '[GoogleSignIn] DEVELOPER_ERROR (code 10) - Common causes and solutions:',
        {
          webClientId:
            '866670879122-039tdkivpv9ab3rs6bgtlmoeg6uf56no.apps.googleusercontent.com',
          packageName: 'com.petroast',
          commonCauses: [
            'Incorrect Web Client ID - must be Web application type, not Android/iOS',
            'Missing SHA-1 fingerprint in Firebase Console for this Android app',
            'Mismatched package name between app and Firebase config',
            'Google Sign-In not enabled in Firebase Authentication',
            'Incorrect google-services.json file',
          ],
          solutions: [
            'Verify Web Client ID is from Web application in Google Cloud Console',
            'Add SHA-1 fingerprint to Firebase project settings',
            'Ensure package name matches com.petroast',
            'Enable Google Sign-In in Firebase Authentication',
            'Download fresh google-services.json from Firebase Console',
          ],
        },
      );
      return {
        success: false,
        error: {
          code: 'DEVELOPER_ERROR',
          message:
            'Google Sign-In configuration error (code 10). Check console logs for detailed troubleshooting information.',
        },
      };
    } else {
      return {
        success: false,
        error: {
          code: 'GOOGLE_SIGN_IN_ERROR',
          message: error.message || 'An error occurred during Google sign in',
        },
      };
    }
  }
};

/**
 * Sign out from Google and Firebase
 */
export const signOutFromGoogle = async () => {
  try {
    // Sign out from Firebase
    try {
      await auth().signOut();
    } catch (firebaseError) {
      console.error(
        '[Firebase] Error signing out from Firebase:',
        firebaseError,
      );
    }

    await GoogleSignin.signOut();
  } catch (error) {
    console.error('[GoogleSignIn] Error signing out:', error);
  }
};
