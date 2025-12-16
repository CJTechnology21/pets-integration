import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native';
import ApiClient from '../api/client';

/**
 * Example component demonstrating usage of the API client
 */
const UserProfileExample = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUserProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ApiClient.user.getProfile();
      
      if (response.success) {
        setUserProfile(response.data.getUserProfile);
      } else {
        setError(response.error.message);
        Alert.alert('Error', response.error.message);
      }
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john.doe@yopmail.com',
      password: 'SecurePass123',
      dob: '01-01-1990',
      phoneNumber: '1234567890'
    };

    try {
      const response = await ApiClient.user.create(userData);
      
      if (response.success) {
        Alert.alert('Success', 'User created successfully!');
      } else {
        Alert.alert('Error', response.error.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to create user');
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        User Profile Example
      </Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={{ color: 'red', marginBottom: 20 }}>Error: {error}</Text>
      ) : userProfile ? (
        <View>
          <Text>Name: {userProfile.name}</Text>
          <Text>Email: {userProfile.email}</Text>
          <Text>Created At: {userProfile.createdAt}</Text>
        </View>
      ) : (
        <Text>No user profile data</Text>
      )}
      
      <View style={{ marginTop: 20 }}>
        <Button title="Load Profile" onPress={loadUserProfile} />
        <Button title="Create User" onPress={createUser} />
      </View>
    </View>
  );
};

export default UserProfileExample;