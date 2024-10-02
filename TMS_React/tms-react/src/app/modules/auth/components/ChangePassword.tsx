import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false,
  });

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Formik form handling
  const formik = useFormik({
    initialValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
    validationSchema: Yup.object({
      current_password: Yup.string().required('Current password is required'),
      new_password: Yup.string()
        .min(8, 'New password must be at least 8 characters')
        .required('New password is required'),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      try {
        // Call the change password API
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}change-password`,
          {
            current_password: values.current_password,
            new_password: values.new_password,
            new_password_confirmation: values.confirm_password,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
            },
          }
        );

        // Handle success response
        if (response.data.status === 'success') {
          Swal.fire('Success', response.data.message, 'success');
        } else {
          Swal.fire('Error', response.data.message, 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong, please try again.', 'error');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <div className='card mb-5 mb-xl-10'>
        <div className='card-header border-0 cursor-pointer' role='button'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Profile Details</h3>
          </div>
        </div>

        <div id='kt_account_profile_details' className='collapse show'>
          <form noValidate className='form' onSubmit={formik.handleSubmit}>
            <div className='card-body border-top p-9'>
              {/* Current Password */}
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                  Current Password
                </label>
                <div className='col-lg-8 fv-row position-relative'>
                  <input
                    type={showPassword.current_password ? 'text' : 'password'}
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Current password'
                    {...formik.getFieldProps('current_password')}
                  />
                  <span
                    className='position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer'
                    onClick={() => togglePasswordVisibility('current_password')}
                  >
                    <FontAwesomeIcon icon={showPassword.current_password ? faEyeSlash : faEye} />
                  </span>
                  {formik.touched.current_password && formik.errors.current_password ? (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.current_password}</div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* New Password */}
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                  New Password
                </label>
                <div className='col-lg-8 fv-row position-relative'>
                  <input
                    type={showPassword.new_password ? 'text' : 'password'}
                    className='form-control form-control-lg form-control-solid'
                    placeholder='New password'
                    {...formik.getFieldProps('new_password')}
                  />
                  <span
                    className='position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer'
                    onClick={() => togglePasswordVisibility('new_password')}
                  >
                    <FontAwesomeIcon icon={showPassword.new_password ? faEyeSlash : faEye} />
                  </span>
                  {formik.touched.new_password && formik.errors.new_password ? (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.new_password}</div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Confirm Password */}
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                  Confirm password
                </label>
                <div className='col-lg-8 fv-row position-relative'>
                  <input
                    type={showPassword.confirm_password ? 'text' : 'password'}
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Confirm password'
                    {...formik.getFieldProps('confirm_password')}
                  />
                  <span
                    className='position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer'
                    onClick={() => togglePasswordVisibility('confirm_password')}
                  >
                    <FontAwesomeIcon icon={showPassword.confirm_password ? faEyeSlash : faEye} />
                  </span>
                  {formik.touched.confirm_password && formik.errors.confirm_password ? (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.confirm_password}</div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-primary' disabled={loading}>
                {!loading ? 'Change password' : 'Please wait...'}
                {loading && (
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
