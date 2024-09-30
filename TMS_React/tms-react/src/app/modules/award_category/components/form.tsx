import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { env } from 'process';
import {Link, useNavigate } from 'react-router-dom';
function Form() {
  const formik = useFormik({
    initialValues: {
      name: '',
      award_id: '',
      main_sponsor_id: '',
      status: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      award_id: Yup.string().required('Year is required'),
      main_sponsor_id: Yup.string().required('Main Sponsor is required'),
      status: Yup.string().required('Status is required'),
      description: Yup.string().max(500, 'Description must be 500 characters or less'),
    }),
    onSubmit: async (values) => {
      try {
        // Get JWT token (assuming it's stored in localStorage or sessionStorage)
        const token = localStorage.getItem('jwt_token'); // or sessionStorage.getItem('jwtToken');

        // Send form data to the server via axios, passing JWT token in the Authorization header
        const response = await axios.post(
          process.env.REACT_APP_API_BASE_URL + 'award-category', 
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in Authorization header
            },
          }
        );

      } catch (error) {
        console.log('Error submitting form:', error);
      }
    },
  });

  return (
    <div>
      <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
        <div className="tab-content">
          <div className="tab-pane fade show active" id="kt_ecommerce_add_product_basic" role="tabpanel">
            <div className="d-flex flex-column">
              <div className="card card-flush">
                <div className="card-header">
                  <div className="card-title">
                    <h2>Add Award Category</h2>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <form id="form-input" encType="multipart/form-data" onSubmit={formik.handleSubmit}>
                    <div className="row">
                      <div className="col-md-4 fv-row">
                        <label className="required form-label manager-code">Name</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control mb-2"
                          placeholder="Enter Name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name ? (
                          <span className="text-danger">{formik.errors.name}</span>
                        ) : null}
                      </div>

                      <div className="col-md-4 fv-row">
                        <label className="required form-label manager-code">Year</label>
                        <select
                          name="award_id"
                          className="form-control mb-2"
                          value={formik.values.award_id}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          <option value="">Select Year</option>
                          <option value="2022">2022</option>
                          <option value="2021">2021</option>
                        </select>
                        {formik.touched.award_id && formik.errors.award_id ? (
                          <span className="text-danger">{formik.errors.award_id}</span>
                        ) : null}
                      </div>

                      <div className="col-md-4 fv-row">
                        <label className="required form-label manager-code">Main Sponsor</label>
                        <select
                          name="main_sponsor_id"
                          className="form-control mb-2"
                          value={formik.values.main_sponsor_id}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          <option value="">Select Main Sponsor</option>
                          <option value="0">TMS</option>
                          <option value="1">Test</option>
                        </select>
                        {formik.touched.main_sponsor_id && formik.errors.main_sponsor_id ? (
                          <span className="text-danger">{formik.errors.main_sponsor_id}</span>
                        ) : null}
                      </div>

                      <div className="col-md-4 fv-row">
                        <label className="required form-label manager-code">Status</label>
                        <select
                          name="status"
                          className="form-control mb-2"
                          value={formik.values.status}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          <option value="">Select Status</option>
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                        {formik.touched.status && formik.errors.status ? (
                          <div className="text-danger">{formik.errors.status}</div>
                        ) : null}
                      </div>

                      <div className="col-md-4 fv-row">
                        <label className="form-label manager-code">Description</label>
                        <textarea
                          name="description"
                          className="form-control mb-2"
                          placeholder="Enter your description"
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.description && formik.errors.description ? (
                          <div className="text-danger">{formik.errors.description}</div>
                        ) : null}
                      </div>
                    </div>

					<div className="d-flex justify-content-end py-4">
						<Link to="#" className="btn btn-sm btn-flex bg-body btn-color-primary-700 btn-active-color-primary fw-bold me-5" style={{ marginLeft: '10px' }}>Cancel</Link>
						<button type="submit" className="btn btn-primary">Submit</button>
					</div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;
