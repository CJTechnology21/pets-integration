import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import AsyncStorage from '@react-native-async-storage/async-storage';

// GraphQL API base URL from project configuration
const GRAPHQL_ENDPOINT =
  'https://petsnapchat-be-production-70d9.up.railway.app/graphql';

// Secure storage keys
const SECURE_STORAGE_KEYS = {
  ID_TOKEN: 'idToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_ID: 'userId',
  EMAIL: 'email',
};

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// HTTP link for GraphQL requests
const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'include', // Include cookies/session tokens
});

// Auth middleware link to add authorization header
const authLink = new ApolloLink((operation, forward) => {
  // Get token from secure storage
  const token = getToken();

  // Add the authorization header to the request
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });

  return forward(operation);
});

// Function to get token from secure storage
const getToken = () => {
  // In a real implementation, this would retrieve the token from secure storage
  try {
    // This is a placeholder - in reality, you'd get this from your secure storage
    return null;
  } catch (error) {
    console.error('[ApolloClient] Error getting token:', error);
    return null;
  }
};

// Create Apollo Client instance
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default client;
