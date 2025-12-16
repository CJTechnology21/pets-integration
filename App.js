import React from 'react';
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

const App = () => {
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
