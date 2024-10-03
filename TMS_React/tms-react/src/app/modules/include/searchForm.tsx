import React, { useState } from 'react';
import { PageTitle } from '../../../_metronic/layout/core';

interface SearchFormProps {
    module: string; 
    moduleTitle: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ module, moduleTitle}) => {
  return (
        <div className="mb-15">

        <div className="mb-6 ">
            <h2>Search {moduleTitle}</h2>
        </div>

        {module === 'award-category' &&  
        (
            <div className="row mt-6">
                <div className="row mb-5" style={{ marginBottom: '5px' }}>
                    <div className="col-lg-3 mb-lg-0">
                        <label>Name:</label>
                        <input type="text" id="name" className="form-control form-control-solid datatable-input"
                            placeholder="Enter Name" data-col-index="{{ $name }}"/>
                    </div>
                    <div className="col-lg-3 mb-lg-0">
                        <label>Email:</label>
                        <input type="text" id="email" className="form-control form-control-solid datatable-input"
                            placeholder="Enter Email" data-col-index="{{ $email }}"/>
                    </div>
                    <div className="col-lg-3 mb-lg-0">
                        <label>Subject:</label>
                        <input type="text" id="subject" className="form-control form-control-solid datatable-input"
                            placeholder="Enter Subject" data-col-index="{{ $subject }}"/>
                    </div>
                </div>
            </div>
        )}

            <div className="row ">
            <div className="col-lg-3  mb-lg-0 mb-6">
                <label>From Date:</label>
                <div className="input-daterange input-group" id="kt_datepicker">
                    <input type="text" className="form-control form-control-solid datatable-input" id="from_date"
                        name="from_date" placeholder="Choose From Date" data-col-index="{{ $from_date }}"/>
                </div>
            </div>
            <div className="col-lg-3  mb-lg-0 mb-6">
                <label>To Date:</label>
                <div className="input-daterange input-group" id="kt_datepicker">
                    <input type="text" className="form-control form-control-solid datatable-input" id="to_date"
                        name="to_date" placeholder="Choose To Date" data-col-index="{{ $to_date }}"/>
                </div>
            </div>

            <div className="col-lg-3 my-5 ">
                <button className="btn btn-primary btn-primary--icon" id="kt_search">
                    <span>
                        <i className="la la-search"></i>
                        <span>Search</span>
                    </span>
                </button>
                &nbsp;&nbsp;
                <button className="btn btn-secondary btn-secondary--icon" id="kt_reset">
                    <span>
                        <i className="la la-close"></i>
                        <span>Reset</span>
                    </span>
                </button>
            </div>

        </div>

    </div>

  )
}

export default SearchForm
