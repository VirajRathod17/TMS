import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from '../include/loader';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import ReactQuill from 'react-quill'; // Import ReactQuill
import '../../include/loader.css';

interface FormProps {
  mode: 'create' | 'edit';
  initialValues: FormValues;
  submitUrl: string;
  redirectUrl: string;
  successMessage: string;
  pageTitle: string;
  oldImageUrl?: string; // Prop to hold the old image URL
}

type FormValues = {
  name: string;
  image: File | null;
  award_id: string;
  website_link: string;
  description?: string; // This will hold HTML content
  status: string;
};

const Form: React.FC<FormProps> = ({
  mode,
  initialValues,
  submitUrl,
  redirectUrl,
  successMessage,
  pageTitle,
  oldImageUrl, // Receive the old image URL
}) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const formik = useFormik<FormValues>({
    initialValues: initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      image: Yup.mixed().required('Image is required'),
      award_id: Yup.string().required('Year is required'),
      website_link: Yup.string().url('Invalid URL format').required('Website link is required'),
      description: Yup.string().max(500, 'Description must be 500 characters or less'), // Validate HTML length if needed
      status: Yup.string().required('Status is required'),
    }),

    onSubmit: async (values) => {
      setLoading(true);
    
      try {
        const token = localStorage.getItem('jwt_token');
        const method = mode === 'edit' ? 'post' : 'post'; // Always use 'post' for this structure
        const url = mode === 'edit' ? `${submitUrl}` : submitUrl;

        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('website_link', values.website_link);
        formData.append('award_id', values.award_id);
        formData.append('status', values.status);
        formData.append('description', values.description || '');

        if (mode === 'edit') {
          formData.append('_method', 'PUT'); // Add _method for PUT
        }

        if (values.image) { // Check if an image file is provided
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
    formik.setFieldValue('image', file);

    // If an image is selected, create a preview
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImagePreview(fileURL);
    } else {
      setImagePreview(oldImageUrl || null); // Reset to old image if no file is selected
    }
  };

  useEffect(() => {
    formik.setValues(initialValues);
    
    // Set the image preview based on the mode
    if (mode === 'edit' && oldImageUrl) {
      setImagePreview(oldImageUrl);
    }
  }, [initialValues, oldImageUrl, mode]);

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
                          aria-label="Name"
                        />
                        {formik.touched.name && formik.errors.name && (
                          <span className="text-danger">{formik.errors.name}</span>
                        )}
                      </div>

                      <div className="col-md-4 fv-row">
                        <label className="required form-label manager-code">Image</label>
                        <input
                          type="file"
                          name="image"
                          className="form-control mb-2"
                          accept="image/*"
                          onChange={handleFileChange}
                          onBlur={formik.handleBlur}
                          aria-label="Image"
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
                        <label className="required form-label manager-code">Year</label>
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
                        <label className="required form-label manager-code">Website Link</label>
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
                        <label className="required form-label manager-code">Status</label>
                        <select
                          name="status"
                          className="form-control mb-2"
                          value={formik.values.status}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          aria-label="Status"
                        >
                          <option value="">Select Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                        {formik.touched.status && formik.errors.status && (
                          <span className="text-danger">{formik.errors.status}</span>
                        )}
                      </div>

                      <div className="col-md-8 fv-row">
                        <label className="form-label manager-code">Description</label>
                        <ReactQuill
                          theme="snow"
                          value={formik.values.description}
                          onChange={(content) => formik.setFieldValue('description', content)}
                          onBlur={formik.handleBlur}
                          modules={{
                            toolbar: [
                              [{ header: [1, 4, false] }],
                              ['bold', 'italic', 'underline'],
                              ['link', 'image'],
                              ['clean'], // remove formatting button
                            ],
                          }}
                          placeholder="Enter Description"
                        />
                        {formik.touched.description && formik.errors.description && (
                          <span className="text-danger">{formik.errors.description}</span>
                        )}
                      </div>

                    </div>

                    <div className="d-flex justify-content-end">
                      <Link to={redirectUrl} className="btn btn-light btn-active-light-primary me-3">
                        Cancel
                      </Link>
                      <button type="submit" className="btn btn-sm btn-flex btn-primary">
                        Save
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
