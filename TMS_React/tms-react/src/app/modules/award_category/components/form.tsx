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
						  <h2>Add Award Category</h2>
						</div>
					</div>
					<div className="card-body pt-0">
						<form>
						<div className="row">
							<div className="col-md-4 fv-row">
							<label className="required form-label manager-code">Name</label>
							<input
								type="text"
								name="name"
								className="form-control mb-2"
								placeholder="Enter Name"
							/>
							</div>

							<div className="col-md-4 fv-row">
							<label className="required form-label manager-code">Year</label>
							<select
								name="year"
								className="form-control mb-2"
								// onChange={handleChange}
								// value={formData.year}
							>
								<option value="">Select Year</option>
								<option value="2022">2022</option>
                                <option value="2021">2021</option>
							</select>
							
							</div>

							<div className="col-md-4 fv-row">
							<label className="required form-label manager-code">Main Sponsor</label>
							<select
								name="main_sponsor"
								className="form-control mb-2"
								// onChange={handleChange}
								// value={formData.year}
							>
								<option value="">Select Main Sponsor</option>
								<option value="TMS">TMS</option>
                                <option value="Test">Test</option>
							</select>
							
							</div>

							<div className="col-md-4 fv-row">
							<label className="required form-label manager-code">Status</label>
							<select
								name="status"
								className="form-control mb-2"
								// onChange={handleChange}
								// value={formData.year}
							>
								<option value="">Select Status</option>
								<option value="1">Active</option>
                                <option value="0">Inactive</option>
							</select>
							
							</div>

							<div className="col-md-4 fv-row">
							<label className="form-label manager-code">Description</label>
							<textarea
								name="description"
								id="description"
								// cols="40"
								// rows="1"
								className="form-control mb-2"
								placeholder="Enter your description"
								// value={formData.location}
								// onChange={handleChange}
							/>
							</div>
						</div>

						<div className="d-flex justify-content-end py-4">
							<a href='#' id="kt_ecommerce_add_product_cancel" className="btn btn-sm btn-flex bg-body btn-color-primary-700 btn-active-color-primary fw-bold me-5">
							Cancel
							</a>
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
