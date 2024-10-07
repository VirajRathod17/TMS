// src/components/Form.tsx
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from '../../include/loader';
import '../../include/loader.css';

interface FormProps {
  mode: 'create' | 'edit';
  initialValues: FormValues;
  submitUrl: string;
  redirectUrl: string;
  successMessage: string;
  pageTitle: string;
  oldImageUrl?: string; // Optional prop to hold the old image URL
}

type FormValues = {
  name: string;
  image: File | null;
  award_id: string;
  website_link: string;
  description?: string;
  status: string;
};

const Form: React.FC<FormProps> = ({
  mode,
  initialValues,
  submitUrl,
  redirectUrl,
  successMessage,
  pageTitle,
  oldImageUrl,
}) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(oldImageUrl || null);
  const navigate = useNavigate();

  const formik = useFormik<FormValues>({
    initialValues: initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      image: Yup.mixed().nullable(), // Make image nullable
      award_id: Yup.string().required('Year is required'),
      website_link: Yup.string().url('Invalid URL format').required('Website link is required'),
      description: Yup.string().max(500, 'Description must be 500 characters or less'),
      status: Yup.string().required('Status is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwt_token');
        const formData = new FormData();

        Object.keys(values).forEach((key) => {
          if (key === 'image' && !values.image) {
            return; // Skip appending image if it's not provided
          }
          formData.append(key, values[key as keyof FormValues] as any);
        });

        const method: 'post' | 'put' = mode === 'edit' ? 'put' : 'post';

        const response = await axios({
          method: method,
          url: submitUrl,
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.status === 'success') {
          Swal.fire({
            title: 'Success',
            text: successMessage,
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate(redirectUrl);
            formik.resetForm();
            setImagePreview(null);
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        if (axios.isAxiosError(error)) {
          if (error.response) {
            const errorMessage = error.response.data.message || 'An unknown error occurred';
            Swal.fire({
              title: 'Error',
              text: errorMessage,
              icon: 'error',
              confirmButtonText: 'OK',
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'No response received from the server. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        } else {
          Swal.fire({
            title: 'Error',
            text: 'An unexpected error occurred. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
    formik.setFieldValue('image', file);

    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImagePreview(fileURL);
    } else {
      setImagePreview(oldImageUrl || null);
    }
  };

  useEffect(() => {
    formik.setValues(initialValues);
    if (oldImageUrl) {
      setImagePreview(oldImageUrl);
    }
  }, [initialValues, oldImageUrl]);

  return (
    <>
      {loading && <Loader />}
      <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
        <div className="tab-content">
          <div className="tab-pane fade show active" id="kt_ecommerce_add_product_basic" role="tabpanel">
            <div className="d-flex flex-column">
              <div className="card card-flush">
                <div className="card-header">
                  <div className="card-title">
                    <h2>{pageTitle}</h2>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <form id="form-input" encType="multipart/form-data" onSubmit={formik.handleSubmit}>
                    <div className="row">
                      <div className="col-md-4 fv-row">
                        <label className="required form-label">Name</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control mb-2"
                          placeholder="Enter Name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          aria-label="Name"
                        />
                        {formik.touched.name && formik.errors.name && (
                          <span className="text-danger">{formik.errors.name}</span>
                        )}
                      </div>

                      <div className="col-md-4 fv-row">
                        <label className="required form-label">Image</label>
                        <input
                          type="file"
                          name="image"
                          className="form-control mb-2"
                          onChange={handleFileChange}
                          onBlur={formik.handleBlur}
                          aria-label="Image"
                        />
                        {formik.touched.image && formik.errors.image && (
                          <span className="text-danger">{formik.errors.image}</span>
                        )}
                        {imagePreview && (
                          <div className="mt-2">
                            <img src={imagePreview} alt="Preview" style={{ width: '100%', height: 'auto' }} />
                          </div>
                        )}
                      </div>

                      <div className="col-md-4 fv-row">
                        <label className="required form-label">Year</label>
                        <select
                          name="award_id"
                          className="form-control mb-2"
                          value={formik.values.award_id}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          aria-label="Year"
                        >
                          <option value="">Select Year</option>
                          <option value="2022">2022</option>
                          <option value="2021">2021</option>
                        </select>
                        {formik.touched.award_id && formik.errors.award_id && (
                          <span className="text-danger">{formik.errors.award_id}</span>
                        )}
                      </div>

                      <div className="col-md-4 fv-row">
                        <label className="required form-label">Website Link</label>
                        <input
                          type="url"
                          name="website_link"
                          className="form-control mb-2"
                          placeholder="Enter Website URL"
                          value={formik.values.website_link}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          aria-label="Website Link"
                        />
                        {formik.touched.website_link && formik.errors.website_link && (
                          <span className="text-danger">{formik.errors.website_link}</span>
                        )}
                      </div>

                      <div className="col-md-4 fv-row">
                        <label className="required form-label">Status</label>
                        <select
                          name="status"
                          className="form-control mb-2"
                          value={formik.values.status}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          aria-label="Status"
                        >
                          <option value="">Select Status</option>
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                        {formik.touched.status && formik.errors.status && (
                          <span className="text-danger">{formik.errors.status}</span>
                        )}
                      </div>

                      <div className="col-md-8 fv-row">
                        <label className="form-label">Description</label>
                        <textarea
                          name="description"
                          className="form-control mb-2"
                          placeholder="Enter Description"
                          value={formik.values.description || ''}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          aria-label="Description"
                        />
                        {formik.touched.description && formik.errors.description && (
                          <span className="text-danger">{formik.errors.description}</span>
                        )}
                      </div>

                      <div className="col-md-4 d-flex align-items-center">
                        <button type="submit" className="btn btn-primary me-2" id="submit-button">
                          {mode === 'edit' ? 'Update' : 'Create'}
                        </button>
                        <Link to={redirectUrl} className="btn btn-light">
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
