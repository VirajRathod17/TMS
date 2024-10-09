import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from '../../include/loader';
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
  title: string;
  image: File | null;
  location: string;
  date: string;
  description?: string; // This will hold HTML content
  status: string;
  image_path: string;
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
  const [imagePreview, setImagePreview] = useState<string | null>(initialValues.image_path || null);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const formik = useFormik<FormValues>({
    initialValues: initialValues,
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      // image: Yup.mixed().required('Image is required'),
      location: Yup.string().required('Location is required'),
      date: Yup.date().required('Date is required').nullable(), // Change to Yup.date()
      description: Yup.string().max(500, 'Description must be 500 characters or less'),
      status: Yup.string().required('Status is required'),
      image: Yup.mixed()
      .test('fileType', 'Unsupported File Format', (value) => {
        if (value && value.type) return ['image/jpeg', 'image/png'].includes(value.type);
        return true;
      })
      .test('fileSize', 'File too large', (value) => {
        if (value && value.size) return value.size <= 1024 * 1024 * 5; // 5MB limit
        return true;
      }),
    }),

    onSubmit: async (values) => {
      setLoading(true);

      try {
        const token = localStorage.getItem('jwt_token');
        const method = mode === 'edit' ? 'post' : 'post'; // Always use 'post' for this structure
        const url = mode === 'edit' ? submitUrl : submitUrl;

        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('location', values.location);
        formData.append('date', values.date);
        formData.append('status', values.status);
        formData.append('description', values.description || '');

        if (mode === 'edit') {
          formData.append('_method', 'PUT'); // Add _method for PUT
        }

        if (values.image) {
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
        console.error('Error submitting form:', error);
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while saving the data.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
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
      setImagePreview(oldImageUrl || null);
    }
  };

  // useEffect(() => {
  //   formik.setValues(initialValues);

  //   if (mode === 'edit' && oldImageUrl) {
  //     setImagePreview(oldImageUrl);
  //   }
  // }, [initialValues, oldImageUrl, mode]);

  useEffect(() => {
    formik.setValues(initialValues);
    setImagePreview(initialValues.image_path || null); // Ensure the preview is set properly
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
                        <label className="required form-label manager-code">Title</label>
                        <input
                          type="text"
                          name="title"
                          className="form-control mb-2"
                          placeholder="Enter Title"
                          value={formik.values.title}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          aria-label="Title"
                        />
                        {formik.touched.title && formik.errors.title && (
                          <span className="text-danger">{formik.errors.title}</span>
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
                            setImagePreview(URL.createObjectURL(event.target.files[0])); // Show preview of the new image
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
                        <label className="required form-label manager-code">Location</label>
                        <input
                          type="text"
                          name="location"
                          className="form-control mb-2"
                          placeholder="Enter Location"
                          value={formik.values.location}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          aria-label="Location"
                        />
                        {formik.touched.location && formik.errors.location && (
                          <span className="text-danger">{formik.errors.location}</span>
                        )}
                      </div>

                      <div className="col-md-4 fv-row">
                        <label className="required form-label manager-code">Date</label>
                        <input
                          type="date"
                          name="date"
                          className="form-control mb-2"
                          value={formik.values.date}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          aria-label="Date"
                        />
                        {formik.touched.date && formik.errors.date && (
                          <span className="text-danger">{formik.errors.date}</span>
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
                        >
                          <option value="">Select Status</option>
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
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
