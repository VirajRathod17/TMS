import React from 'react';
import Form from './form';

function Create() {
  return (
    <div>
		<div className="d-flex flex-column flex-column-fluid">
			<div id="kt_app_toolbar" className="app-toolbar">
				<div id="kt_app_toolbar_container" className="app-container container-fluid">
					
				</div>
			</div>
			<div id="kt_app_content" className="app-content flex-column-fluid mt-6">
				<div id="kt_app_content_container" className="app-container container-fluid">
					<form className="form d-flex flex-column flex-lg-row" id="form-input" encType="multipart/form-data">
						<Form />
					</form>
				</div>
			</div>
		</div>
    </div>
  );
}

export default Create;