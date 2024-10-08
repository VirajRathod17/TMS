import React, { useEffect } from 'react';
import Form from './form';
import Breadcrumb from '../include/breadcrumbs';
import { Helmet } from 'react-helmet';

function Create() {
  const initialValues = {
    name: '',
    award_id: '',
    website_link: '',
    status: '',
    description: '',
    image: null, 
  };

  const pageTitle = 'Add Media Partner';

  useEffect(() => {
    document.title = pageTitle; // Dynamically set the document title
  }, [pageTitle]);

  const breadcrumb = [
    { label: 'Manage Media Partner', url: '/media-partner' },
    { label: 'Add Media Partner', url: '' },
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
            submitUrl={`${process.env.REACT_APP_API_BASE_URL}media-partner`} // API endpoint for form submission
            redirectUrl="/media-partner" // Redirect URL after form submission
            successMessage="Media Partner has been created successfully"
            pageTitle={pageTitle}
          />
        </div>
      </div>
    </div>
  );
}

export default Create;
