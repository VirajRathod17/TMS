import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Form from './form';
import '../../include/loader.css';
import Loader from '../../include/loader';
import Breadcrumb from '../../include/breadcrumbs';
import {Helmet} from 'react-helmet';
function Edit() {
  const { id } = useParams(); // Assuming you get the ID from the URL
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);

  const pageTitle = 'Edit Award Categories'; 

  useEffect(() => {
      document.title = pageTitle; 
  }, [pageTitle]); 

  useEffect(() => {

    // Fetch existing data for the item to be edited
    const fetchAwardCategory = async () => {
      setLoading(true);
      const token = localStorage.getItem('jwt_token');
      const response = await axios.get(
        process.env.REACT_APP_API_BASE_URL + `award-category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setInitialValues(response.data.data); // Set the fetched data as initial values
        setLoading(false);
      }
    };
    fetchAwardCategory();
  }, [id]);


  const breadcrumb = [
    {label:'Manage Award Categories', url: '/award_category'},
    {label:'Edit Award Categories', url: ''},
  ]
  return (
    <div className="d-flex flex-column flex-column-fluid">
       <Helmet>
            <title>{pageTitle}</title>
        </Helmet>
      <div id="kt_app_toolbar" className="app-toolbar">
        <div id="kt_app_toolbar_container" className="app-container">
          <Breadcrumb breadcrumbs={breadcrumb} />
        </div>
      </div>
      <div id="kt_app_content" className="app-content flex-column-fluid mt-6">
        <div id="kt_app_content_container" className="app-container">
          {initialValues ? (
            <Form
              mode="edit"
              initialValues={initialValues}
              submitUrl={process.env.REACT_APP_API_BASE_URL + `award-category/${id}`}
              redirectUrl="/award-category"
              successMessage="Award Category has been updated successfully"
              pageTitle={pageTitle}
            />
          ) : (
          loading &&  <Loader />
          )}
        </div>
      </div>
    </div>
  );
}
export default Edit;
