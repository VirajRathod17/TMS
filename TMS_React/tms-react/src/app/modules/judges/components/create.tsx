import React,{ useEffect } from 'react';
import Form from './form';
import Breadcrumb from '../../include/breadcrumbs';
import {Helmet} from 'react-helmet';
function Create() {
  const initialValues = {
    name: '',
    award_id: '',
    status: '',
    description: '',
    post: '',
    image: null,
    imageUrl: '',
  };
  const pageTitle = 'Add Judges'; 

  useEffect(() => {
      document.title = pageTitle; 
  }, [pageTitle]); 

  const breadcrumb = [
    {label:'Manage Judges Panel', url: '/judges'},
    {label:'Add Judges', url: ''},
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
            <Form
              mode="create"
              initialValues={initialValues}
              submitUrl={process.env.REACT_APP_API_BASE_URL + 'judges'}
              redirectUrl="/judges"
              successMessage="Judge has been created successfully"
              pageTitle={pageTitle}
            />
          </div>
        </div>
      </div>
  );
}

export default Create;
