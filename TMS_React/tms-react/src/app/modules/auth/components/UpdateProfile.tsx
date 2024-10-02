import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toAbsoluteUrl } from '../../../../_metronic/helpers';

const UpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    image: null,
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}get-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Set the initial values with fetched user data
        setInitialValues({
          name: response.data.data.name,
          email: response.data.data.email,
          image: response.data.data.image,
        });

        // Set the image preview URL if an image exists
        if (response.data.data.image) {
          setProfileImage(`${process.env.REACT_APP_API_BASE_URL}admin/profile/${response.data.data.id}/${response.data.data.image}`);
        } else {
          setProfileImage(null); // No image found
        }
        console.log(response.data.data.image);
      } catch (error) {
        console.error('Error fetching user profile', error);
      }
    };

    fetchUserProfile();
  }, []);

  // Formik setup for form handling and validation
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true, // Allows Formik to update the form when initialValues change
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      // Create form data for the API request
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      if (values.image) {
        formData.append('image', values.image);
      }

      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}update-profile`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log('Profile updated successfully', response.data);
      } catch (error) {
        console.error('Error updating profile', error);
      } finally {
        setLoading(false);
      }
    },
  });

  // Handle file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      formik.setFieldValue('image', file);
      setProfileImage(URL.createObjectURL(file)); // Preview image
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
                <div
                  className='image-input image-input-outline'
                  style={{
                    backgroundImage: `url(${profileImage || toAbsoluteUrl('/media/avatars/blank.png')})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  data-kt-image-input='true'
                >
                  <input
                    type='file'
                    className='form-control'
                    accept='image/*'
                    onChange={handleImageChange}
                    style={{ display: 'none' }} // Hide the default file input
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
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Email</label>
              <div className='col-lg-8 fv-row'>
                <input
                  type='email'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Email'
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.email}</div>
                  </div>
                ) : null}
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
