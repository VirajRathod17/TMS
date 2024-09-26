import { useEffect } from 'react';
import { Navigate, Routes } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './core/Auth'; // Assuming you have a custom hook for authentication

export function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Retrieve the token from localStorage (or wherever you're storing it)
        const token = localStorage.getItem('jwt_token');

        if (token) {
          // Make a request to the Laravel backend to invalidate the token
          await axios.post(
            'http://127.0.0.1:8000/api/logout',
            {}, // No body needed
            {
              headers: {
                Authorization: `Bearer ${token}`, // Pass the token in the header
              },
            }
          );

          // Clear the token from localStorage
          localStorage.removeItem('jwt_token');

          // Perform any additional cleanup using the custom hook's logout function
          logout();
        }

        // Optionally, reload the page to clear any cached data or state
        document.location.reload();
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    performLogout();
  }, [logout]);

  return (
    <Routes>
      {/* After logging out, redirect the user to the login page */}
      <Navigate to='/auth/login' />
    </Routes>
  );
}
