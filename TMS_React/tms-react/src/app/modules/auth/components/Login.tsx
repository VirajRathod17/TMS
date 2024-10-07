import { useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Minimum 8 characters')
    .max(50, 'Maximum 10 characters')
    .required('Password is required'),
});

const initialValues = {
  email: '',
  password: '',
};

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setStatus(null);

      try {
        const response = await axios.post(`${API_BASE_URL}admin-login`, {
          email: values.email,
          password: values.password,
        });

        const { status, token, message } = response.data;

        if (status === 'success') {
          // Save the token and its expiration time to localStorage
          const expirationTime = new Date().getTime() + 5 * 60 * 60 * 1000; 
          localStorage.setItem('jwt_token', token);
          localStorage.setItem('jwt_expiration', expirationTime.toString());
          navigate("/");
          window.location.reload();
        } else {
          setStatus(message || 'Invalid email or password');
          setSubmitting(false);
          setLoading(false);
        }
      } catch (error) {
        const axiosError = error as AxiosError; 

        if (axiosError.response && axiosError.response.data) {
          const { message } = axiosError.response.data;
          setStatus(message || 'Something went wrong. Please try again');
        } else {
          setStatus('Network error. Please check your connection.');
        }
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <form className='form w-100' onSubmit={formik.handleSubmit} noValidate id='kt_login_signin_form'>
    {/* Heading */}
    <div className='text-center mb-10'>
      <h1 className='text-dark mb-3'>Sign In</h1>
    </div>

    {formik.status ? (
      <div className='mb-lg-15 alert alert-danger'>
        <div className='alert-text font-weight-bold'>{formik.status}</div>
      </div>
    ) : (
      <div className='mb-10 bg-light-info p-8 rounded'>
        <div className='text-info'>Add login details.</div>
      </div>
    )}

    {/* Email Input */}
    <div className='fv-row mb-10'>
      <label className='form-label fs-6 fw-bolder text-dark'>Email</label>
      <input
        placeholder='Email'
        {...formik.getFieldProps('email')}
        className={clsx(
          'form-control form-control-lg form-control-solid',
          { 'is-invalid': formik.touched.email && formik.errors.email },
          { 'is-valid': formik.touched.email && !formik.errors.email }
        )}
        type='email'
        name='email'
        autoComplete='off'
      />
      {formik.touched.email && formik.errors.email && (
        <div className='fv-plugins-message-container'>
          <div className='fv-help-block'>
            <span role='alert'>{formik.errors.email}</span>
          </div>
        </div>
      )}
    </div>

    {/* Password Input */}
    <div className='fv-row mb-10'>
      <label className='form-label fw-bolder text-dark fs-6'>Password</label>
      <input
        placeholder='Password'
        type='password'
        autoComplete='off'
        {...formik.getFieldProps('password')}
        className={clsx(
          'form-control form-control-lg form-control-solid',
          { 'is-invalid': formik.touched.password && formik.errors.password },
          { 'is-valid': formik.touched.password && !formik.errors.password }
        )}
      />
      {formik.touched.password && formik.errors.password && (
        <div className='fv-plugins-message-container'>
          <div className='fv-help-block'>
            <span role='alert'>{formik.errors.password}</span>
          </div>
        </div>
      )}
    </div>

    {/* Submit Button */}
    <div className='text-center'>
      <button
        type='submit'
        id='kt_sign_in_submit'
        className='btn btn-lg btn-primary w-100 mb-5'
        disabled={formik.isSubmitting || !formik.isValid}
      >
        {!loading && <span className='indicator-label'>Continue</span>}
        {loading && (
          <span className='indicator-progress' style={{ display: 'block' }}>
            Please wait...
            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
          </span>
        )}
      </button>
    </div>
  </form>
  );
}
