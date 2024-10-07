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
    main_sponsored_id: string;
    status: string;
    description?: string;
    questions: string[];
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
    initialValues: {
      ...initialValues,
      questions: initialValues.questions || [''], // Initialize questions directly from initialValues
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      main_sponsored_id: Yup.string().required('Main Sponsor is required'),
      status: Yup.string().required('Status is required'),
      description: Yup.string().max(500, 'Description must be 500 characters or less'),
      questions: Yup.array().of(Yup.string().required('Question is required')),
    }),
    onSubmit: async (values) => {
      setLoading(true); // Show loader
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

  const addQuestion = () => {
    formik.setFieldValue('questions', [...formik.values.questions, '']); 
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = formik.values.questions.filter((_, idx) => idx !== index); 
    formik.setFieldValue('questions', updatedQuestions); 
  };

  return (
    <>
      {loading && <Loader />}
      <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
        <div className="tab-content">
          <div className="tab-pane fade show active" id="kt_ecommerce_add_product_basic" role="tabpanel">
            <form id="form-input" encType="multipart/form-data" onSubmit={formik.handleSubmit}>
              <div className="d-flex flex-column">
                <div className="card card-flush">
                  <div className="card-header">
                    <div className="card-title">
                      <h2>{pageTitle}</h2>
                    </div>
                  </div>
                  <div className="card-body pt-0">
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
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column mt-5">
                <div className="card card-flush">
                  <div className="card-header">
                    <div className="card-title">
                      <h2>Award Categories Questions</h2>
                    </div>
                  </div>
                  <div className="card-body pt-0">
                    <div className="row">
                      <div id="kt_docs_repeater_nested">
                        <div className="form-group">
                          <div data-repeater-list="kt_docs_repeater_nested_outer">
                            <div className="col-md-12 mt-5">
                              {formik.values.questions.map((question, index) => (
                                <div key={index} className="form-group row mb-5">
                                  <div className="col-md-8">
                                    <label className="form-label">Question {index + 1}</label>
                                    <textarea
                                      name={`questions[${index}]`} // Directly set name as `questions[index]`
                                      className="form-control mb-2"
                                      placeholder="Enter your Question"
                                      value={question} // Set value directly from Formik's state
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                    />
                                     {formik.touched.questions && formik.errors.questions && formik.errors.questions[index] ? (
                                      <span className="text-danger">{formik.errors.questions[index]}</span>
                                    ) : null}
                                  </div>
                                  <div className="col-md-4">
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-light-danger mt-3"
                                      onClick={() => removeQuestion(index)}
                                    >
                                      Delete Question
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button type="button" className="btn btn-light-primary" onClick={addQuestion}>
                                Add Question
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                    <Link to={redirectUrl} className="btn btn-light me-3">
                        Cancel
                      </Link>
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                      &nbsp;
                      
                    </div>
                  </div>
                </div>
              </div>
             
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
