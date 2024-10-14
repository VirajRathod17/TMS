import React from 'react';

interface SearchProps {
  titleSearchTerm: string;
  dateSearchTerm: string;
  statusSearchTerm: string;
  onTitleSearchChange: (term: string) => void;
  onDateSearchChange: (term: string) => void;
  onStatusSearchChange: (term: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

const Search: React.FC<SearchProps> = ({
  titleSearchTerm,
  dateSearchTerm,
  statusSearchTerm,
  onTitleSearchChange,
  onDateSearchChange,
  onStatusSearchChange,
  onSearch,
  onReset,
}) => {
  return (
    <div className="mb-3">
      <h4>Search News</h4>
      <div className="row">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Title"
            value={titleSearchTerm}
            onChange={(e) => onTitleSearchChange(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Date (DD-MM-YY)"
            value={dateSearchTerm}
            onChange={(e) => onDateSearchChange(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <select
            className="form-control"
            value={statusSearchTerm}
            onChange={(e) => onStatusSearchChange(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <button onClick={onSearch} className="btn btn-primary me-2">Search</button>
      <button onClick={onReset} className="btn btn-secondary">Reset</button>
    </div>
  );
};

export default Search;
