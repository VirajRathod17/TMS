import React, { useEffect } from 'react';
import Form from './form';
import Breadcrumb from '../../include/breadcrumbs';
import { Helmet } from 'react-helmet';

function Create() {
  // Update the initialValues to include award_id, sponsored_id, and link
  const initialValues = {
    award_id: '',
    sponsored_id: '', // New field
    title: '',
    link: '', // New field
    image: null, 
    image_path: '',
  };

  const pageTitle = 'Add Videos';

  useEffect(() => {
    document.title = pageTitle; // Dynamically set the document title
  }, [pageTitle]);

  const breadcrumb = [
    { label: 'Manage Videos', url: '/videos' },
    { label: 'Add Videos', url: '' },
  ];

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      {/* Toolbar Section */}
      <div id="kt_app_toolbar" className="app-toolbar">
        <div id="kt_app_toolbar_container" className="app-container">
          <Breadcrumb breadcrumbs={breadcrumb} />
        </div>
      </div>

      {/* Content Section */}
      <div id="kt_app_content" className="app-content flex-column-fluid mt-6">
        <div id="kt_app_content_container" className="app-container">
          <Form
            mode="create"
            initialValues={initialValues}
            submitUrl={`${process.env.REACT_APP_API_BASE_URL}videos`} // API endpoint for form submission
            redirectUrl="/videos" // Redirect URL after form submission
            successMessage="Videos has been created successfully"
            pageTitle={pageTitle}
          />
        </div>
      </div>
    </div>
  );
}

export default Create;
