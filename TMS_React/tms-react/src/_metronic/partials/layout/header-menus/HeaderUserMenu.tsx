/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../app/modules/auth';
import { toAbsoluteUrl } from '../../../helpers';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const HeaderUserMenu: FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('jwt_token');

      if (token) {
        // Make API call to logout endpoint in Laravel
        await axios.post(
        `${API_BASE_URL}logout`,
          {}, // No body is needed
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the JWT token in the headers
            },
          }
        );

        // Remove token from localStorage
        localStorage.removeItem('jwt_token');

        // Call the logout function from your Auth hook
        logout();

        // Redirect to login page
        navigate('/login');
        window.location.reload();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            <img alt='Logo' src={toAbsoluteUrl('/media/avatars/300-1.jpg')} />
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {currentUser?.first_name} {currentUser?.last_name}
              <span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2'>Pro</span>
            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {currentUser?.email}
            </a>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>

      <div className='menu-item px-5'>
        <Link to={'/profile'} className='menu-link px-5'>
          User Profile
        </Link>
      </div>

      <div className='menu-item px-5 my-1'>
        <Link to='/crafted/account/settings' className='menu-link px-5'>
          Account Settings
        </Link>
      </div>

      <div className='menu-item px-5'>
        <a onClick={handleLogout} className='menu-link px-5'>
          Sign Out
        </a>
      </div>
    </div>
  );
};

export { HeaderUserMenu };
