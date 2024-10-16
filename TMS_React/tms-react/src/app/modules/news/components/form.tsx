import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quillEditor.css';

interface FormProps {
  mode: 'create' | 'edit';
  initialValues: {
    title: string;
    description: string;
    location: string;
    date: string;
    image: File | null;
    status: string;
    image_path: string;
  };
  submitUrl: string;
  redirectUrl: string;
  successMessage: string;
  pageTitle: string;
}

const Form: React.FC<FormProps> = ({ mode, initialValues, submitUrl, redirectUrl, successMessage, pageTitle }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialValues.image_path || null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      title: Yup.string()
        .min(2, 'Minimum 2 characters')
        .max(100, 'Maximum 100 characters')
        .required('Title is required'),
      location: Yup.string()
        .min(2, 'Minimum 2 characters')
        .required('Location is required'),
      date: Yup.date().required('Date is required'),
      status: Yup.string().required('Status is required'),
      image: Yup.mixed()
        .test('fileType', 'Unsupported File Format', (value) => {
          if (value && value.type) return ['image/jpeg', 'image/png'].includes(value.type);
          return true;
        })
        .test('fileSize', 'File too large', (value) => {
          if (value && value.size) return value.size <= 1024 * 1024 * 5;
          return true;
        }),
    }),

    onSubmit: async (values) => {
      setLoading(true);
    
      try {
        const token = localStorage.getItem('jwt_token');
        let method: 'post' | 'put' = mode === 'edit' ? 'post' : 'post';
        let url = mode === 'edit' ? `${submitUrl}` : submitUrl;
  
        const formData = new FormData();
    
        formData.append('title', values.title);
        formData.append('location', values.location);
        formData.append('date', values.date);
        formData.append('status', values.status);
        formData.append('description', values.description);
    
        if (mode === 'edit') {
          formData.append('_method', 'PUT');
        }
  
        if (values.image instanceof File) {
          formData.append('image', values.image);
        }
    
        const response = await axios({
          method: method,
          url: url,
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
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
        console.log('Error submitting form:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    formik.setValues(initialValues);
    setImagePreview(initialValues.image_path || null);
  }, [initialValues]);

  return (
    <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
      <div className="tab-content">
        <div className="tab-pane fade show active">
          <div className="d-flex flex-column">
            <div className="card card-flush">
              <div className="card-header">
                <div className="card-title">
                  <h2>{pageTitle || ''}</h2>
                </div>
              </div>
              <div className="card-body pt-0">
                <form id="form-input" onSubmit={formik.handleSubmit}>
                  <div className="row">
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">Title</label>
                      <input
                        type="text"
                        name="title"
                        className="form-control mb-2"
                        placeholder="Enter Title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        minLength={2}
                        maxLength={100}
                      />
                      {formik.touched.title && formik.errors.title && (
                        <span className="text-danger">{formik.errors.title}</span>
                      )}
                    </div>
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">Location</label>
                      <input
                        type="text"
                        name="location"
                        className="form-control mb-2"
                        placeholder="Enter Location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.location && formik.errors.location && (
                        <span className="text-danger">{formik.errors.location}</span>
                      )}
                    </div>
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">Date</label>
                      <input
                        type="date"
                        name="date"
                        className="form-control mb-2"
                        value={formik.values.date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.date && formik.errors.date && (
                        <span className="text-danger">{formik.errors.date}</span>
                      )}
                    </div>
                    <div className="col-md-4 fv-row">
                      <label className="form-label">Image</label>
                      <input
                        type="file"
                        name="image"
                        className="form-control mb-2"
                        accept="image/*"
                        onChange={(event) => {
                          if (event.target.files && event.target.files[0]) {
                            formik.setFieldValue('image', event.target.files[0]);
                            setImagePreview(URL.createObjectURL(event.target.files[0]));
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.image && formik.errors.image && (
                        <span className="text-danger">{formik.errors.image}</span>
                      )}
                      {imagePreview && ( 
                        <div className="mt-3">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            width="100"
                            height="100"
                            style={{ objectFit: 'cover', borderRadius: '5px' }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">Status</label>
                      <select
                        id="award_category_status"
                        className="form-control form-select"
                        name="status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">-Choose Status-</option>
                        <option value="0">Inactive</option>
                        <option value="1">Active</option>
                      </select>
                      {formik.touched.status && formik.errors.status && (
                        <span className="text-danger">{formik.errors.status}</span>
                      )}
                    </div>
                    <div className="col-md-12 fv-row mt-2">
                      <label htmlFor="description" className="form-label">Description</label>
                      <ReactQuill
                        value={formik.values.description}
                        onChange={(value) => formik.setFieldValue('description', value)}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.description && formik.errors.description && (
                        <span className="text-danger">{formik.errors.description}</span>
                      )}
                    </div>
                  </div>
                  <div className="d-flex justify-content-end py-4">
                    <Link to="/news" className="btn btn-sm btn-flex bg-body btn-color-primary-700 btn-active-color-primary fw-bold me-5">
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
