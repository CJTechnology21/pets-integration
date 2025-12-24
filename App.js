import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Navigation from './src/navigation/Navigation';
import { TabBarProvider } from './src/context/TabBarContext';
import { ApolloProvider } from '@apollo/client/react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/store/store';
import client from './src/services/apolloClient';
import Toast from 'react-native-toast-message';
import { configureGoogleSignIn } from './src/services/googleSignInService';
// Firebase configuration
import { initializeFirebase, testGoogleSignInConfig } from './src/config/firebase';

const App = () => {
  useEffect(() => {
    // Initialize Firebase first
    const firebaseAuth = initializeFirebase();
    console.log('[App] Firebase Auth initialized:', firebaseAuth);
    
    // Configure Google Sign-In after Firebase initialization
    configureGoogleSignIn();
    console.log('[App] Google Sign-In configured');
    
    // Test Google Sign-In configuration
    testGoogleSignInConfig().then(isConfigured => {
      console.log('[App] Google Sign-In configuration test result:', isConfigured);
    }).catch(error => {
      console.error('[App] Google Sign-In configuration test error:', error);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <TabBarProvider>
        <ApolloProvider client={client}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <SafeAreaView style={{ flex: 1 }}>
                <Navigation />
                <Toast />
              </SafeAreaView>
            </PersistGate>
          </Provider>
        </ApolloProvider>
      </TabBarProvider>
    </SafeAreaProvider>
  );
};

export default App;