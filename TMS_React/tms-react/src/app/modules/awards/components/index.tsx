import React from 'react';
import Create from './create'
import { Link } from 'react-router-dom'

function Index() {
  return (
    // <div>
       	<div className="d-flex flex-column flex-column-fluid">
			<div id="kt_app_toolbar" className="app-toolbar mb-5 mt-5">
				<div id="kt_app_toolbar_container" className="app-container">
					{/* <h1>Hello</h1> */}
				</div>
			</div>
			<div id="kt_app_content" className="app-content flex-column-fluid">
				<div id="kt_app_content_container" className="app-container">
					<div className="card card-flush mb-5">
						<div className="card-body pt-6 pb-3">
						{/* Include Search Form Here */}
						{/* <SearchForm /> */}
						</div>
					</div>
					<div className="card card-flush mb-5">
						<div className="card-body pt-5">
							<div className="d-flex flex-stack mb-5">
								<div className="d-flex align-items-center position-relative my-1">
									<h2 className="mb-0">Home</h2>
								</div>
								<div className="d-flex justify-content-end" data-kt-docs-table-toolbar="base">
									{/* <Link to="#" className="btn btn-primary" style={{ marginLeft: '10px' }}>Add</Link> */}
									<Link to="/awards/create" className="btn btn-primary" style={{ marginLeft: '10px' }}>Add</Link>
								</div>
								<div className="d-flex justify-content-end align-items-center d-none" data-kt-docs-table-toolbar="selected">
									<div className="fw-bold me-5">
										<span className="me-2" data-kt-docs-table-select="selected_count"></span>
										Selected
									</div>
									<button type="button" className="btn btn-primary" data-kt-docs-table-select="delete_selected">Remove Selected</button>
								</div>
							</div>
							<table id="kt_datatable_example_1" className="table align-middle table-row-dashed fs-6 gy-5">
								<thead>
									<tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
										<th className="w-10px pe-2">
											<div className="form-check form-check-sm form-check-custom form-check-solid me-3">
												<input className="form-check-input" type="checkbox" data-kt-check="true" data-kt-check-target="#kt_datatable_example_1 .form-check-input" value="1"/>
											</div>
										</th>
										<th>ID</th>
										<th>Date</th>
										<th>Title</th>
										<th>Award Year</th>
										<th className="text-end min-w-100px">Action</th>
									</tr>
								</thead>
								<tbody className="text-gray-600 fw-semibold">
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
    // </div>
  );
}

export default Index;
