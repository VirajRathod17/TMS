// src/services/userProfileService.js

import axios from 'axios';

// Function to fetch user profile
export const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('jwt_token');
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}get-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user profile', error);
    throw error; // Re-throw the error to handle it in the component
  }
};
