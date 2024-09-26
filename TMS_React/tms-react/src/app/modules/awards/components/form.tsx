import React from 'react';


function Form() {
  return (
    <div>
		<div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
			<div className="tab-content">
				<div className="tab-pane fade show active" id="kt_ecommerce_add_product_basic" role="tabpanel">
					<div className="d-flex flex-column">
						<div className="card card-flush">
							<div className="card-header">
								<div className="card-title">
								{/* <h2>{pageTitle || ''}</h2> */}
								</div>
							</div>
							<div className="card-body pt-0">
								<form>
									<div className="row">
										<div className="col-md-4 fv-row">
											<label className="required form-label manager-code">Name</label>
											<input type="text" name="name" className="form-control mb-2" placeholder="Enter Name" />
										</div>
										<div className="col-md-4 fv-row">
											<label className="required form-label manager-code">Year</label>
											<select name="year" className="form-control mb-2">
												<option value="">Select Year</option>
											</select>
										</div>
										<div className="col-md-4 fv-row">
											<label className="required form-label manager-code">Award Date</label>
											<input type="text" id="award_date" name="award_date" className="form-control mb-2" placeholder="Choose Award Date" autoComplete="off" />
										</div>
										<div className="col-md-4 fv-row">
											<label className="required form-label manager-code">Start Date</label>
											<input type="text" id="start_date" name="start_date" className="form-control mb-2" placeholder="Choose Start Date" autoComplete="off" />
										</div>
										<div className="col-md-4 fv-row">
											<label className="required form-label manager-code">End Date</label>
											<input type="text" id="end_date" name="end_date" className="form-control mb-2" placeholder="Choose End Date" autoComplete="off" />
										</div>
										<div className="col-md-4 fv-row">
											<label className="form-label manager-code">Award Location</label>
											<textarea name="location" id="location" className="form-control mb-2" placeholder="Enter your Location" />
										</div>
									</div>
									<div className="d-flex justify-content-end py-4">
										<a href='#' id="kt_ecommerce_add_product_cancel" className="btn btn-sm btn-flex bg-body btn-color-primary-700 btn-active-color-primary fw-bold me-5">Cancel</a>
										<button type="submit" className="btn btn-primary">Submit</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
    </div>
  );
}

export default Form;
