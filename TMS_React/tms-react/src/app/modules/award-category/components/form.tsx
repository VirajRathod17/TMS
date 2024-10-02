import React, { useState, useEffect } from 'react';
import { useFormik, FormikErrors } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../include/loader.css';
import Loader from '../../include/loader';

// Define the types for the props
interface FormProps {
  mode: 'create' | 'edit';
  initialValues: {
    name: string;
    award_id: string;
    main_sponsored_id: string;
    status: string;
    description?: string;
  };
  submitUrl: string;
  redirectUrl: string;
  successMessage: string;
  pageTitle: string;
}

// The Form component with proper types
const Form: React.FC<FormProps> = ({ mode, initialValues, submitUrl, redirectUrl, successMessage, pageTitle }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      award_id: Yup.string().required('Year is required'),
      main_sponsored_id: Yup.string().required('Main Sponsor is required'),
      status: Yup.string().required('Status is required'),
      description: Yup.string().max(500, 'Description must be 500 characters or less'),
    }),
    onSubmit: async (values) => {
      setLoading(true); // Show loader
      try {
        const token = localStorage.getItem('jwt_token');

           // Explicitly type the method as 'post' | 'put'
           let method: 'post' | 'put' = mode === 'edit' ? 'put' : 'post';
        
           // Only include `id` in the URL if it's available (in edit mode)
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
        setLoading(false); // Hide loader
      }
    },
  });

  useEffect(() => {
    formik.setValues(initialValues);
  }, [initialValues]);

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
                        <label className="required form-label manager-code">Name</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control mb-2"
                          placeholder="Enter Name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          minLength={3} 
                          maxLength={30}
                        />
                        {formik.touched.name && formik.errors.name ? (
                          <span className="text-danger">{formik.errors.name as string}</span>
                        ) : null}
                      </div>

                      {/* Similar code for other fields like Year, Main Sponsor, Status, Description */}
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
                          <span className="text-danger">{formik.errors.award_id as string}</span>
                        ) : null}
                      </div>

                      <div className="col-md-4 fv-row">
                        <label className="required form-label manager-code">Main Sponsor</label>
                        <select
                          name="main_sponsored_id"
                          className="form-control mb-2"
                          value={formik.values.main_sponsored_id}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          <option value="">Select Main Sponsor</option>
                          <option value="0">Sponsor 1</option>
                          <option value="1">Sponsor 2</option>
                        </select>
                        {formik.touched.main_sponsored_id && formik.errors.main_sponsored_id ? (
                          <span className="text-danger">{formik.errors.main_sponsored_id as string}</span>
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
                          <span className="text-danger">{formik.errors.status as string}</span>
                        ) : null}
                      </div>
                        
                      <div className="col-md-8 fv-row">
                        <label className="required form-label manager-code">Description</label>
                        <textarea
                          name="description"
                          className="form-control mb-2"
                          placeholder="Enter Description"
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.description && formik.errors.description ? (
                          <span className="text-danger">{formik.errors.description as string}</span>
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
    </>
  );
}

export default Form;
