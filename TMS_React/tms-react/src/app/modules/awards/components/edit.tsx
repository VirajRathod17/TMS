import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Form from './form';
import Breadcrumb from '../../include/breadcrumbs';
import {Helmet} from 'react-helmet';

function Edit() {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);

  const pageTitle = 'Edit Award'; 

  useEffect(() => {
      document.title = pageTitle; 
  }, [pageTitle]); 

  useEffect(() => {
    const fetchAward = async () => {
      setLoading(true);
      const token = localStorage.getItem('jwt_token');
      const response = await axios.get(
        process.env.REACT_APP_API_BASE_URL + `awards/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setInitialValues(response.data.data);
        setLoading(false);
      }
    };
    fetchAward();
  }, [id]);

  const breadcrumb = [
    {label:'Manage Award', url: '/awards'},
    {label:'Edit Award', url: ''},
  ]

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <Helmet>
        <title>{pageTitle ? pageTitle : ''}</title>
      </Helmet>
      <div id="kt_app_toolbar" className="app-toolbar">
        <div id="kt_app_toolbar_container" className="app-container">
          <Breadcrumb breadcrumbs={breadcrumb} />
        </div>
      </div>
      <div id="kt_app_content" className="app-content flex-column-fluid mt-6">
        <div id="kt_app_content_container" className="app-container">
          {/* {initialValues ? ( */}
		      {initialValues && (
            <Form
              mode="edit"
              initialValues={initialValues}
              submitUrl={process.env.REACT_APP_API_BASE_URL + `awards/${id}`}
              redirectUrl="/awards"
              successMessage="Award has been updated successfully"
              pageTitle={pageTitle}
            />
		      )}
        </div>
      </div>
    </div>
  );
}
export default Edit;
