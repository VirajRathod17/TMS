import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import clsx from 'clsx';

function Form() {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      year: '',
      award_date: '',
      start_date: '',
      end_date: '',
      location: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Minimum 2 characters')
        .max(100, 'Maximum 100 characters')
        .required('Award Name is required'),
      year: Yup.string()
        .length(4, 'Year must be 4 characters')
        .required('Award Year is required'),
      award_date: Yup.date().required('Award Date is required'),
      start_date: Yup.date().required('Award Start Date is required'),
      description: Yup.string().max(500, 'Description must be 500 characters or less'),
      location: Yup.string().required('Award Location is required'),
    }),

    onSubmit: async (values) => {
      setLoading(true); // Show loader
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.post(
          process.env.REACT_APP_API_BASE_URL + '/awards',
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === 'success') {
          Swal.fire({
            title: 'Success',
            text: 'Award Category has been created successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          formik.resetForm();
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
        setLoading(false); // Hide loader
      }
    },
  });

  return (
    <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
      <div className="tab-content">
        <div className="tab-pane fade show active" id="kt_ecommerce_add_product_basic" role="tabpanel">
          <div className="d-flex flex-column">
            <div className="card card-flush">
              <div className="card-header">
                <div className="card-title">
                  <h2>Award Form</h2>
                </div>
              </div>
              <div className="card-body pt-0">
			  <form id="form-input" encType="multipart/form-data" onSubmit={formik.handleSubmit}>
                  {formik.status && (
                    <div className="mb-lg-15 alert alert-danger">
                      <div className="alert-text font-weight-bold">{formik.status}</div>
                    </div>
                  )}

                  <div className="row">
                    {/* Name Field */}
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">Name</label>
                      <input
                        type="text"
                        {...formik.getFieldProps('name')}
                        className={clsx(
                          'form-control mb-2 form-control-lg form-control-solid',
                          { 'is-invalid': formik.touched.name && formik.errors.name },
                          { 'is-valid': formik.touched.name && !formik.errors.name }
                        )}
                        placeholder="Enter Name"
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className="invalid-feedback">{formik.errors.name}</div>
                      )}
                    </div>

                    {/* Year Field */}
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">Year</label>
                      <select
                        {...formik.getFieldProps('year')}
                        className={clsx('form-control mb-2', {
                          'is-invalid': formik.touched.year && formik.errors.year,
                          'is-valid': formik.touched.year && !formik.errors.year,
                        })}
                      >
                        <option value="">Select Year</option>
                        {Array.from({ length: 30 }, (_, i) => {
                          const year = 2024 - i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                      {formik.touched.year && formik.errors.year && (
                        <div className="invalid-feedback">{formik.errors.year}</div>
                      )}
                    </div>

                    {/* Award Date Field */}
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">Award Date</label>
                      <input
                        type="date"
                        {...formik.getFieldProps('award_date')}
                        className={clsx(
                          'form-control mb-2 form-control-lg form-control-solid',
                          { 'is-invalid': formik.touched.award_date && formik.errors.award_date },
                          { 'is-valid': formik.touched.award_date && !formik.errors.award_date }
                        )}
                      />
                      {formik.touched.award_date && formik.errors.award_date && (
                        <div className="invalid-feedback">{formik.errors.award_date}</div>
                      )}
                    </div>

                    {/* Start Date Field */}
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">Start Date</label>
                      <input
                        type="date"
                        {...formik.getFieldProps('start_date')}
                        className={clsx(
                          'form-control mb-2 form-control-lg form-control-solid',
                          { 'is-invalid': formik.touched.start_date && formik.errors.start_date },
                          { 'is-valid': formik.touched.start_date && !formik.errors.start_date }
                        )}
                      />
                      {formik.touched.start_date && formik.errors.start_date && (
                        <div className="invalid-feedback">{formik.errors.start_date}</div>
                      )}
                    </div>

                    {/* End Date Field */}
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">End Date</label>
                      <input
                        type="date"
                        {...formik.getFieldProps('end_date')}
                        className={clsx(
                          'form-control mb-2 form-control-lg form-control-solid',
                          { 'is-invalid': formik.touched.end_date && formik.errors.end_date },
                          { 'is-valid': formik.touched.end_date && !formik.errors.end_date }
                        )}
                      />
                      {formik.touched.end_date && formik.errors.end_date && (
                        <div className="invalid-feedback">{formik.errors.end_date}</div>
                      )}
                    </div>

                    {/* Location Field */}
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">Location</label>
                      <input
                        type="text"
                        {...formik.getFieldProps('location')}
                        className={clsx(
                          'form-control mb-2 form-control-lg form-control-solid',
                          { 'is-invalid': formik.touched.location && formik.errors.location },
                          { 'is-valid': formik.touched.location && !formik.errors.location }
                        )}
                        placeholder="Enter Location"
                      />
                      {formik.touched.location && formik.errors.location && (
                        <div className="invalid-feedback">{formik.errors.location}</div>
                      )}
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="d-flex justify-content-end py-4">
                    <Link
                      to="/awards"
                      className="btn btn-sm btn-flex bg-body btn-color-primary-700 btn-active-color-primary fw-bold me-5"
                    >
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting || loading}>
                      Submit
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
}

export default Form;
