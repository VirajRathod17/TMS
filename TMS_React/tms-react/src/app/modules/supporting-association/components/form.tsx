import React, { useState, useEffect } from 'react';
import { useFormik, FormikErrors } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface FormProps {
  mode: 'create' | 'edit';
  initialValues: {
    name: string;
    website_link: string;
    image: File | null;
    status: string;
    description: string;
  };
  submitUrl: string;
  redirectUrl: string;
  successMessage: string;
  pageTitle: string;
}

const Form: React.FC<FormProps> = ({ mode, initialValues, submitUrl, redirectUrl, successMessage, pageTitle, }) => {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Minimum 2 characters')
        .max(100, 'Maximum 100 characters')
        .required('Award Name is required'),
      website_link: Yup.string()
        .url('Invalid URL format')
        .required('Website Link is required'),
      status: Yup.string().required('Status is required'),
      image: Yup.mixed()
        .required('Image is required')
        .test(
          'fileSize',
          'File too large',
          (value) => value && value.size <= 1024 * 1024 * 5
        )
        .test(
          'fileType',
          'Unsupported File Format',
          (value) => value && ['image/jpeg', 'image/png'].includes(value.type)
        ),
    }),

    onSubmit: async (values) => {
    //   setLoading(true);
      try {
        const token = localStorage.getItem('jwt_token');
        let method: 'post' | 'put' = mode === 'edit' ? 'put' : 'post';
        let url = mode === 'edit' ? `${submitUrl}` : submitUrl;

        const response = await axios({
            method: method,
            url: url,
            data: values,
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
                <form id="form-input" encType="multipart/form-data" onSubmit={formik.handleSubmit}>
                  <div className="row">
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control mb-2"
                        placeholder="Enter Award Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        minLength={2}
                        maxLength={100}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <span className="text-danger">{formik.errors.name as string}</span>
                      )}
                    </div>
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">Website Link</label>
                      <input
                        type="text"
                        name="website_link"
                        className="form-control mb-2"
                        placeholder="Enter Award Website"
                        value={formik.values.website_link}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.website_link && formik.errors.website_link && (
                        <span className="text-danger">{formik.errors.website_link as string}</span>
                      )}
                    </div>
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">Image</label>
                      <input
                        type="file"
                        name="image"
                        className="form-control mb-2"
                        onChange={(event) => {
                          if (event.target.files && event.target.files[0]) {
                            formik.setFieldValue('image', event.target.files[0]);
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.image && formik.errors.image && (
                        <span className="text-danger">{formik.errors.image as string}</span>
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
                        <span className="text-danger">{formik.errors.status as string}</span>
                      )}
                    </div>
                    <div className="col-md-8 fv-row">
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        placeholder="Enter a description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end py-4">
                    <Link to="/supporting-association" className="btn btn-sm btn-flex bg-body btn-color-primary-700 btn-active-color-primary fw-bold me-5">
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
