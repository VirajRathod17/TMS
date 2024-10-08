import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/userProfileService'; 
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { toAbsoluteUrl } from '../../../../_metronic/helpers';

const UpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  // const [loadingProfile, setLoadingProfile] = useState(true); // Loading state for profile data
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    image: null,
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await fetchUserProfile(); // Use the service to fetch profile data

        setInitialValues({
          name: data.name,
          email: data.email,
          image: data.image,
        });

        const fullImageUrl = data.image;
        setProfileImage(fullImageUrl || toAbsoluteUrl('/media/avatars/blank.png'));
        // setLoadingProfile(false); // Stop the loading state once data is fetched
      } catch (error) {
        console.error('Error fetching user profile', error);
        // setLoadingProfile(false);
      }
    };

    getProfile();
  }, []);

  // Formik setup
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true, // Allow reinitializing the form when the initialValues change
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      if (values.image) {
        formData.append('image', values.image);
      }

      try {
        const token = localStorage.getItem('jwt_token');
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}update-profile`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        Swal.fire({
          icon: 'success',
          title: 'Profile updated successfully',
          confirmButtonText: 'OK'
        });
      } catch (error) {
        console.error('Error updating profile', error);
        Swal.fire({
          icon: 'error',
          title: 'Error updating profile',
          text: 'There was a problem updating your profile. Please try again.',
          confirmButtonText: 'OK'
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      formik.setFieldValue('image', file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  

  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-header border-0 cursor-pointer' role='button'>
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Profile Details</h3>
        </div>
      </div>

      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body border-top p-9'>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Profile Image</label>
              <div className='col-lg-8'>
                <div className='image-input image-input-outline' data-kt-image-input='true'>
                  <img
                    src={profileImage || toAbsoluteUrl('/media/avatars/blank.png')}
                    alt='Profile'
                    style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      border: '1px solid #e3e6f0',
                    }}
                  />

                  <input
                    type='file'
                    className='form-control'
                    accept='image/*'
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id='profileImageInput'
                  />
                  <label htmlFor='profileImageInput' className='image-input-label'>
                    Change Image
                  </label>
                </div>
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Name</label>
              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Name'
                  {...formik.getFieldProps('name')}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.name}</div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Email</label>
              <div className='col-lg-8 fv-row'>
                <input
                  type='email'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Email'
                  readOnly
                  {...formik.getFieldProps('email')}
                />
              </div>
            </div>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='submit' className='btn btn-primary' disabled={loading}>
              {!loading ? 'Save Changes' : 'Please wait...'}
              {loading && (
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
