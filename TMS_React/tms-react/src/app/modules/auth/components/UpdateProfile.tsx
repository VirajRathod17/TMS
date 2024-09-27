import {Link} from 'react-router-dom'
import React, {useState} from 'react'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import * as Yup from 'yup'
import {useFormik} from 'formik'

export default function UpdateProfile() {
    
  const [loading, setLoading] = useState(false)
  return (
    <>
   <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_profile_details'
        aria-expanded='true'
        aria-controls='kt_account_profile_details'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Profile Details</h3>
        </div>
      </div>

      <div id='kt_account_profile_details' className='collapse show'>
        <form noValidate className='form'>
          <div className='card-body border-top p-9'>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Profile Image</label>
              <div className='col-lg-8'>
                <div
                  className='image-input image-input-outline'
                  data-kt-image-input='true'
                  style={{backgroundImage: `url(${toAbsoluteUrl('/media/avatars/blank.png')})`}}
                >
                  <div
                    className='image-input-wrapper w-125px h-125px'
                    // style={{backgroundImage: `url(${toAbsoluteUrl(data.avatar)})`}}
                  ></div>
                </div>
              </div>
            </div>

        

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Name</label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Company name'
                //   {...formik.getFieldProps('company')}
                />
                {/* {formik.touched.company && formik.errors.company && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.company}</div>
                  </div>
                )} */}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'>Email</span>
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='tel'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Phone number'
                //   {...formik.getFieldProps('contactPhone')}
                />
                {/* {formik.touched.contactPhone && formik.errors.contactPhone && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.contactPhone}</div>
                  </div>
                )} */}
              </div>
            </div>

         
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='submit' className='btn btn-primary' disabled={loading}>
              {!loading && 'Save Changes'}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
