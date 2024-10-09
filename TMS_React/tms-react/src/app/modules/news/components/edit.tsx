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

  const pageTitle = 'Edit News'; 

  useEffect(() => {
      document.title = pageTitle; 
  }, [pageTitle]); 

  useEffect(() => {

    // Fetch existing data for the item to be edited
    const fetchMediaPartner = async () => {
      setLoading(true);
      const token = localStorage.getItem('jwt_token');
      const response = await axios.get(
        process.env.REACT_APP_API_BASE_URL + `news/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Log the response to check the data structure
      console.log(response.data); // Add this line to debug
      
      if (response.data) {
        setInitialValues(response.data.data); // Ensure this matches your FormValues structure
        setLoading(false);
      }
    };
    
    fetchMediaPartner();
  }, [id]);


  const breadcrumb = [
    {label:'Manage News', url: '/news'},
    {label:'Edit News', url: ''},
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
          {initialValues ? (
            <Form
              mode="edit"
              initialValues={initialValues}
              submitUrl={process.env.REACT_APP_API_BASE_URL + `news/${id}`}
              redirectUrl="/news"
              successMessage="News has been updated successfully"
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
