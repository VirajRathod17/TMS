import * as Yup from 'yup';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios,{AxiosError} from 'axios';
import { useState } from 'react';

const loginSchema = Yup.object().shape({
	name: Yup.string()
	  	.min(2, 'Minimum 2 characters')
	  	.max(100, 'Maximum 100 characters')
	  	.required('Award Name is required'),
	year: Yup.string()
	  	.min(4, 'Minimum 4 characters')
	  	.max(4, 'Maximum 4 characters')
	  	.required('Award Year is required'),
	award_date: Yup.string()
	  	.required('Award Date is required'),
	start_date: Yup.string()
	  	.required('Award Start Date is required'),
	end_date: Yup.string()
	  	.required('Award End Date is required'),
	location: Yup.string()
	  	.required('Award Location is required'),
  });
  
  const initialValues = {
	name: '',
	year: '',
	award_date: '',
	start_date: '',
	end_date: '',
	location: '',
  };

function Form() {
	
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const formik = useFormik({
		initialValues,
		validationSchema: loginSchema,
		onSubmit: async (values, { setStatus, setSubmitting }) => {
		setLoading(true);
		setStatus(null);

		try {
			// API request to login
			const response = await axios.post('http://127.0.0.1:8000/api/awards', {
				name: values.name,
				year: values.year,
				award_date: values.award_date,
				start_date: values.start_date,
				end_date: values.end_date,
				location: values.location,
			});

			const { status, token, message } = response.data;

			if (status === 'success') {
			// Save the token to localStorage
			localStorage.setItem('jwt_token', token);

			navigate("/awards");
			// window.location.reload();
			} else {
			setStatus(message || 'Invalid email or password');
			setSubmitting(false);
			setLoading(false);
			}
		}  catch (error) {
			const axiosError = error as AxiosError;
		
			if (axiosError.response && axiosError.response.data) {
			const { message } = axiosError.response.data;
			setStatus(message || 'Something went wrong. Please try again');
			} else {
			setStatus('Network error. Please check your connection.');
			}
			setSubmitting(false);
			setLoading(false);
		}
		},
	});

  return (
    <div>
		<div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
			<div className="tab-content">
				<div className="tab-pane fade show active" id="kt_ecommerce_add_product_basic" role="tabpanel">
					<div className="d-flex flex-column">
						<div className="card card-flush">
							<div className="card-header">
								<div className="card-title">
								<h2>award form</h2>
								</div>
							</div>
							<div className="card-body pt-0">
								<form onSubmit={formik.handleSubmit} noValidate id='kt_store_and_update_form'>
								{formik.status ? (
									<div className='mb-lg-15 alert alert-danger'>
										<div className='alert-text font-weight-bold'>{formik.status}</div>
									</div>
								) : (
									<div className='mb-10 bg-light-info p-8 rounded'>
										<div className='text-info'>Add Award.</div>
									</div>
								)}
									<div className="row">
										<div className="col-md-4 fv-row">
											<label className="required form-label manager-code">Name</label>
											<input type="text" 
											{...formik.getFieldProps('name')}
												className={clsx(
													'form-control mb-2 form-control-lg form-control-solid',
													{ 'is-invalid': formik.touched.name && formik.errors.name },
													{ 'is-valid': formik.touched.name && !formik.errors.name }
												)}
											placeholder="Enter Name" />
										</div>
										<div className="col-md-4 fv-row">
												<label className="required form-label">Year</label>
												<select
													{...formik.getFieldProps('year')}
													className={clsx('form-control mb-2', {
														'is-invalid': formik.touched.year && formik.errors.year,
														'is-valid': formik.touched.year && !formik.errors.year,
													})}
												>
													<option value="">Select Year</option>
													{Array.from({ length: 30 }, (_, i) => {
														const year = 2024 - i;
														return (
															<option key={year} value={year}>
																{year}
															</option>
														);
													})}
												</select>
												{formik.touched.year && formik.errors.year && (
													<div className="invalid-feedback">{formik.errors.year}</div>
												)}
											</div>
										<div className="col-md-4 fv-row">
											<label className="required form-label manager-code">Award Date</label>
											<input type="date" id="award_date"
											{...formik.getFieldProps('award_date')}
												className={clsx(
													'form-control mb-2 form-control-lg form-control-solid',
													{ 'is-invalid': formik.touched.award_date && formik.errors.award_date },
													{ 'is-valid': formik.touched.award_date && !formik.errors.award_date }
												)}
											placeholder="Choose Award Date" autoComplete="off" />
										</div>
										<div className="col-md-4 fv-row">
											<label className="required form-label manager-code">Start Date</label>
											<input type="date" id="start_date"
											{...formik.getFieldProps('start_date')}
												className={clsx(
												'form-control mb-2 form-control-lg form-control-solid',
												{ 'is-invalid': formik.touched.start_date && formik.errors.start_date },
												{ 'is-valid': formik.touched.start_date && !formik.errors.start_date }
											)}
											placeholder="Choose Start Date" autoComplete="off" />
										</div>
										<div className="col-md-4 fv-row">
											<label className="required form-label manager-code">End Date</label>
											<input type="date" id="end_date"
											
										{...formik.getFieldProps('end_date')}
											className={clsx(
											'form-control mb-2 form-control-lg form-control-solid',
											{ 'is-invalid': formik.touched.end_date && formik.errors.end_date },
											{ 'is-valid': formik.touched.end_date && !formik.errors.end_date }
										)}

											placeholder="Choose End Date" autoComplete="off" />
										</div>
										<div className="col-md-4 fv-row">
												<label className="required form-label">Location</label>
												<textarea
													{...formik.getFieldProps('location')}
													className={clsx('form-control mb-2', {
														'is-invalid': formik.touched.location && formik.errors.location,
														'is-valid': formik.touched.location && !formik.errors.location,
													})}
													placeholder="Enter Award Location"
												/>
												{formik.touched.location && formik.errors.location && (
													<div className="invalid-feedback">{formik.errors.location}</div>
												)}
										</div>
									</div>
									<div className="d-flex justify-content-end py-4">
										<Link to="/awards" className="btn btn-sm btn-flex bg-body btn-color-primary-700 btn-active-color-primary fw-bold me-5" style={{ marginLeft: '10px' }}>Cancel</Link>
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
