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
    year: string;
    award_date: string;
    start_date: string;
    end_date: string;
    location: string;
  };
  submitUrl: string;
  redirectUrl: string;
  successMessage: string;
  pageTitle: string;

}

const Form: React.FC<FormProps> = ({ mode, initialValues, submitUrl, redirectUrl, successMessage, pageTitle }) => {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: initialValues,
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
      end_date: Yup.date()
        .min(Yup.ref('start_date'), 'End date cannot be before start date')
        .required('Award End Date is required'),
      location: Yup.string()
        .min(2, 'Minimum 2 characters')
        .max(100, 'Maximum 100 characters')
        .required('Award Location is required'),
    }),

    onSubmit: async (values) => {
      // setLoading(true); // Show loader
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
        <div className="tab-pane fade show active" id="kt_ecommerce_add_product_basic" role="tabpanel">
          <div className="d-flex flex-column">
            <div className="card card-flush">
              <div className="card-header">
                <div className="card-title">
                    <h2>{pageTitle ? pageTitle : ''}</h2>
                    {/* <h2>{mode === 'create' ? 'Add Award' : 'Edit Award'}</h2> */}
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
                        placeholder="Enter Award Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        minLength={2} 
                        maxLength={100}
                      />
                      {formik.touched.name && formik.errors.name ? (
                        <span className="text-danger">{formik.errors.name as string}</span>
                      ) : null}
                    </div>
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">Year</label>
                      <input
                        type="text"
                        name="year"
                        className="form-control mb-2"
                        placeholder="Enter Award Year"
                        value={formik.values.year}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        minLength={4}
                        maxLength={4}
                      />
                      {formik.touched.year && formik.errors.year ? (
                        <span className="text-danger">{formik.errors.year as string}</span>
                      ) : null}
                    </div>
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">Award Date</label>
                      <input
                        type="date"
                        name="award_date"
                        className="form-control mb-2"
                        value={formik.values.award_date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.award_date && formik.errors.award_date ? (
                        <span className="text-danger">{formik.errors.award_date as string}</span>
                      ) : null}
                    </div>
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">Start Date</label>
                      <input
                        type="date"
                        name="start_date"
                        className="form-control mb-2"
                        value={formik.values.start_date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.start_date && formik.errors.start_date ? (
                        <span className="text-danger">{formik.errors.start_date as string}</span>
                      ) : null}
                    </div>
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">End Date</label>
                      <input
                        type="date"
                        name="end_date"
                        className="form-control mb-2"
                        value={formik.values.end_date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.end_date && formik.errors.end_date ? (
                        <span className="text-danger">{formik.errors.end_date as string}</span>
                      ) : null}
                    </div>
                    <div className="col-md-4 fv-row">
                      <label className="required form-label">Location</label>
                      <input
                        type="text"
                        name="location"
                        className="form-control mb-2"
                        placeholder="Enter Award Location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        minLength={2} 
                        maxLength={100}
                      />
                      {formik.touched.location && formik.errors.location ? (
                        <span className="text-danger">{formik.errors.location as string}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="d-flex justify-content-end py-4">
                    <Link to="/awards" className="btn btn-sm btn-flex bg-body btn-color-primary-700 btn-active-color-primary fw-bold me-5" style={{ marginLeft: '10px' }}>Cancel</Link>
                    <button type="submit" className="btn btn-primary">Submit</button>
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
