import React from 'react';

interface SearchProps {
  nameSearchTerm: string;
  fromDate: string; // New prop for From Date
  toDate: string; // New prop for To Date
  statusSearchTerm: string;
  onNameSearchChange: (term: string) => void;
  onFromDateChange: (term: string) => void; // Handler for From Date
  onToDateChange: (term: string) => void; // Handler for To Date
  onStatusSearchChange: (term: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

const Search: React.FC<SearchProps> = ({
  nameSearchTerm,
  fromDate,
  toDate,
  statusSearchTerm,
  onNameSearchChange,
  onFromDateChange,
  onToDateChange,
  onStatusSearchChange,
  onSearch,
  onReset,
}) => {
  return (
    <div className="search-filters mb-3">
      <div className="row">
        {/* Name Search */}
        <div className="col-lg-3 mb-3">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name..."
            value={nameSearchTerm}
            onChange={(e) => onNameSearchChange(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <div className="col-lg-3 mb-3">
          <label htmlFor="status">Status:</label>
          <select
            className="form-control"
            value={statusSearchTerm}
            onChange={(e) => onStatusSearchChange(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Date Range (From-To) */}
      <div className="row">
        <div className="col-lg-3 mb-3">
          <label htmlFor="from_date">From Date:</label>
          <input
            type="date" // Use date input for better browser support
            id="from_date"
            className="form-control"
            value={fromDate} // Controlled value for From Date
            onChange={(e) => onFromDateChange(e.target.value)} // Handler for From Date
          />
        </div>

        <div className="col-lg-3 mb-3">
          <label htmlFor="to_date">To Date:</label>
          <input
            type="date" // Use date input for better browser support
            id="to_date"
            className="form-control"
            value={toDate} // Controlled value for To Date
            onChange={(e) => onToDateChange(e.target.value)} // Handler for To Date
          />
        </div>

        {/* Search and Reset Buttons */}
        <div className="col-lg-3 mb-3 d-flex align-items-end">
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={onSearch} // Trigger search handler
          >
            <i className="la la-search" /> Search
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onReset} // Trigger reset handler
          >
            <i className="la la-close" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;
