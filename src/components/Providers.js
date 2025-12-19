import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from '@apollo/client';
import Toast from 'react-native-toast-message';

// Import store and client
import { store, persistor } from '../store/store';
import client from '../services/apolloClient';

/**
 * Providers component to wrap the application with all necessary providers
 */
const Providers = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
          <Toast />
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
};

export default Providers;
