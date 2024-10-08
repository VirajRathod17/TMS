import React, { useEffect, useState } from 'react';
import '../../include/loader.css';
import Loader from '../../include/loader';
import Breadcrumb from '../../include/breadcrumbs';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

interface InitialValues {
  name: string;
  description: string;
  main_sponsored_id: string;
  status: string;
  award_name: string;
  credentials: Record<string, string>; // This will hold questions as key-value pairs
}

function View() {
  const [initialValues, setInitialValues] = useState<InitialValues | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const pageTitle = 'View Award Category';
  const { id } = useParams();

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const breadcrumb = [
    { label: 'Manage Award Categories', url: '/award_category' },
    { label: 'View Award Category', url: '' },
  ];

  useEffect(() => {
    // Fetch existing data for the item to be edited
    const fetchAwardCategory = async () => {
      setLoading(true);
      const token = localStorage.getItem('jwt_token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}award-category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        const { name, description, main_sponsored_id, status, credentials } = response.data.data;
        const award_name = response.data.award;

        setInitialValues({
          name,
          description,
          main_sponsored_id: String(main_sponsored_id),
          status,
          award_name,
          credentials: credentials || {}, // Ensure credentials are handled
        });
      }
      setLoading(false);
    };

    fetchAwardCategory();
  }, [id]);

  if (loading) {
    return <Loader />; // Show a loader if data is still being fetched
  }

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar mb-4">
        <div id="kt_app_toolbar_container" className="app-container">
          <Breadcrumb breadcrumbs={breadcrumb} />
        </div>
      </div>
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div id="kt_app_content_container" className="app-container">
          <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div className="card-title m-0">
                <h2 className="fw-bold m-0">{pageTitle ? pageTitle : ''}</h2>
              </div>
              <Link to="/award-category" className="btn btn-sm btn-primary">
                <i className="fas fa-arrow-left me-2"></i>Back to List
              </Link>
            </div>
            <div className="card-body p-9">
              <div className="row mb-7">
                <label className="col-lg-3 fw-semibold text-muted">Award Category Name</label>
                <div className="col-lg-3">
                  <span className="fw-bold fs-6 text-gray-800">{initialValues?.name}</span>
                </div>

                <label className="col-lg-3 fw-semibold text-muted">Award Year</label>
                <div className="col-lg-3">
                  <span className="fw-bold fs-6 text-gray-800">{initialValues?.award_name}</span>
                </div>
              </div>
              <div className="row mb-7">
                <label className="col-lg-3 fw-semibold text-muted">Main Sponsor</label>
                <div className="col-lg-3">
                  <span className="fw-bold fs-6 text-gray-800">{initialValues?.main_sponsored_id === '1' ? 'Sponsor-2' : 'Sponsor-1'}</span>
                </div>
                <label className="col-lg-3 fw-semibold text-muted">Status</label>
                <div className="col-lg-3 fw-semibold text-muted">
                  <span className={`fw-bold fs-6 ${initialValues?.status === 'active' ? 'text-success' : 'text-danger'}`}>
                    {initialValues?.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="row mb-7">
                <label className="col-lg-3 fw-semibold text-muted">Description</label>
                <div className="col-lg-9">
                  <span className="fs-6 text-gray-800">{initialValues?.description}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section to display questions inside textareas */}
        <div id="kt_app_content_container" className="app-container">
          <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div className="card-title m-0">
                <h2 className="fw-bold m-0">Questions List</h2>
              </div>
            </div>
            <div className="card p-4">
              <div className="card-body">
                {initialValues?.credentials && Object.keys(initialValues.credentials).length > 0 ? (
                  Object.entries(initialValues.credentials).map(([key, question], index) => (
                    <div className="row mb-3" key={index}>
                      <label className="col-lg-3 fw-semibold text-muted">Question {index + 1}</label>
                      <div className="col-lg-9">
                        <textarea
                          className="form-control"
                          readOnly
                          value={question}
                        ></textarea>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No questions available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default View;
