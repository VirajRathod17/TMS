import React from 'react';
import Form from './form';

function Create() {
  const initialValues = {
    name: '',
    award_id: '',
    main_sponsored_id: '',
    status: '',
    description: '',
  };

  return (
    <div>
      <div className="d-flex flex-column flex-column-fluid">
        <div id="kt_app_toolbar" className="app-toolbar">
          <div id="kt_app_toolbar_container" className="app-container">
            {/* Toolbar content */}
          </div>
        </div>
        <div id="kt_app_content" className="app-content flex-column-fluid mt-6">
          <div id="kt_app_content_container" className="app-container">
            <Form
              mode="create"
              initialValues={initialValues}
              submitUrl={process.env.REACT_APP_API_BASE_URL + 'award-category'}
              redirectUrl="/award_category"
              successMessage="Award Category has been created successfully"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create;
