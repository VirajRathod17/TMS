import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
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
    status: string;
    description?: string;
    image: File | null; 
    post: string;
    imageUrl: string;
  };
  submitUrl: string;
  redirectUrl: string;
  successMessage: string;
  pageTitle: string;
}

// The Form component with proper types
const Form: React.FC<FormProps> = ({ mode, initialValues, submitUrl, redirectUrl, successMessage, pageTitle }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialValues.imageUrl || null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true, // Ensures form is reinitialized with fetched data in edit mode
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      status: Yup.string().required('Status is required'),
      description: Yup.string()
        .max(500, 'Description must be 500 characters or less')
        .required('Description is required'),
      post: Yup.string().required('Post is required'),
      image: Yup.mixed()
      .test('required', 'Image is required', function (value) {
        // const { mode } = this.options.context; // Accessing the mode from context
        return mode === 'create' ? value != null : true; // Required if mode is 'create'
      })
        // .test('fileSize', 'File size must be 2MB or less', 
        //   value => (value && value.size <= 2 * 1024 * 1024)) // 2MB
        // .test('fileType', 'Unsupported file type, must be jpeg, jpg, gif, or png', 
        //   value => !value || (value && ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'].includes(value.type))),
    }),
    onSubmit: async (values) => {
      setLoading(true);
    
      try {
        const token = localStorage.getItem('jwt_token');
        let method: 'post' | 'put' = mode === 'edit' ? 'post' : 'post';
        let url = mode === 'edit' ? `${submitUrl}` : submitUrl;
  
        const formData = new FormData();
    
        formData.append('name', values.name);
        formData.append('status', values.status);
        formData.append('description', values.description || '');
        formData.append('post', values.post);
    
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
    setImagePreview(initialValues.imageUrl || null);
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
                  <form id="form-input" onSubmit={formik.handleSubmit}>
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
                      <div className="col-md-4 fv-row">
                        <label className="required form-label manager-code">Image</label>
                        <input
                          type="file"
                          name="image"
                          className="form-control mb-2"
                          onChange={(event) => {
                            if (event.target.files && event.target.files[0]) {
                              formik.setFieldValue('image', event.target.files[0]);
                              setImagePreview(URL.createObjectURL(event.target.files[0]));
                            }
                          }}
                          onBlur={formik.handleBlur}
                        />
                         {formik.touched.image && formik.errors.image ? (
                          <span className="text-danger">{formik.errors.image as string}</span>
                        ) : null}
                        {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />}
                      </div>
                      <div className="col-md-4 fv-row">
                        <label className="required form-label manager-code">Post</label>
                        <input
                          type="text"
                          name="post"
                          className="form-control mb-2"
                          placeholder="Enter Post"
                          value={formik.values.post}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                         {formik.touched.post && formik.errors.post ? (
                          <span className="text-danger">{formik.errors.post as string}</span>
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
                    <div className="d-flex justify-content-end">
                      <Link to={redirectUrl} className="btn btn-light me-3">
                        Cancel
                      </Link>
                      <button type="submit" className="btn btn-primary">
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
    </>
  );
};

export default Form;
