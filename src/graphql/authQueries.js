import { gql } from '@apollo/client';

// Login mutation
export const LOGIN_MUTATION = gql`
  mutation CreateUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      status
      code
      message
      data {
        idToken
        refreshToken
        userId
        email
      }
    }
  }
`;

// Register mutation
export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $name: String!) {
    register(email: $email, password: $password, name: $name) {
      idToken
      refreshToken
      user {
        id
        email
        name
      }
    }
  }
`;

// Refresh token mutation
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      idToken
      refreshToken
      uid
      email
    }
  }
`;

// Verify token query
export const VERIFY_TOKEN_QUERY = gql`
  query VerifyToken($idToken: String) {
    verifyToken(idToken: $idToken) {
      status
      code
      message
      data {
        uid
        email
      }
    }
  }
`;

// Get user profile query
export const GET_USER_PROFILE_QUERY = gql`
  query GetUserProfile {
    getUserProfile {
      id
      email
      name
      createdAt
    }
  }
`;

// Create user mutation
export const CREATE_USER_MUTATION = gql`
  mutation CreateUser(
    $firstName: String!
    $lastName: String!
    $username: String!
    $email: String!
    $password: String!
    $dob: String!
    $phoneNumber: String!
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
      dob: $dob
      phoneNumber: $phoneNumber
    ) {
      status
      code
      message
    }
  }
`;

export const SEND_OTP_FOR_SIGNUP = gql`
  mutation SendOtpForSignup($email: String!) {
    SendOtpForSignup(email: $email) {
      status
      code
      message
    }
  }
`;

export const VERIFY_OTP_FOR_SIGNUP = gql`
  mutation VerifyOtpForSignup($email: String!, $otp: String!) {
    verifyOtpForSignup(email: $email, otp: $otp) {
      status
      code
      message
    }
  }
`;

// Send password reset email mutation
export const SEND_PASSWORD_RESET_EMAIL = gql`
  mutation SendPasswordResetEmail($email: String!) {
    sendPasswordResetEmail(email: $email) {
      status
      code
      message
    }
  }
`;

// Send password reset phone mutation
export const SEND_PASSWORD_RESET_PHONE = gql`
  mutation SendPasswordResetPhone($phoneNumber: String!) {
    sendPasswordResetPhone(phoneNumber: $phoneNumber) {
      status
      code
      message
    }
  }
`;
