import React, { useEffect } from 'react';
import Form from './form';
import Breadcrumb from '../../include/breadcrumbs';
import { Helmet } from 'react-helmet';

function Create() {
  const initialValues = {
    name: '',
    award_id: '',
    website_link: '',
    status: '',
    description: '',
    image: null, // Ensure this is included
  };

  const pageTitle = 'Add Media Partner';

  useEffect(() => {
    document.title = pageTitle; // Dynamically set the document title
  }, [pageTitle]);

  const breadcrumb = [
    { label: 'Manage Media Partner', url: '/media-partner' },
    { label: 'view Media Partner', url: '' },
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

     
      
    </div>
  );
}

export default Create;
