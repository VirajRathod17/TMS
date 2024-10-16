import React from 'react';

interface SearchProps {
  nameSearchTerm: string;
  dateSearchTerm: string;
  statusSearchTerm: string;
  onNameSearchChange: (term: string) => void;
  onDateSearchChange: (term: string) => void;
  onStatusSearchChange: (term: string) => void;
  onSearch: () => void; // New prop for search
  onReset: () => void; // New prop for reset
}

const Search: React.FC<SearchProps> = ({
  nameSearchTerm,
  dateSearchTerm,
  statusSearchTerm,
  onNameSearchChange,
  onDateSearchChange,
  onStatusSearchChange,
  onSearch,
  onReset,
}) => {
  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Search by Name..."
        value={nameSearchTerm}
        onChange={(e) => onNameSearchChange(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Search by Date (DD-MM-YY)..."
        value={dateSearchTerm}
        onChange={(e) => onDateSearchChange(e.target.value)}
      />
      <select
        className="form-control mb-2"
        value={statusSearchTerm}
        onChange={(e) => onStatusSearchChange(e.target.value)}
      >
        <option value="">Select Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <div className="d-flex justify-content-between">
        <button className="btn btn-primary" onClick={onSearch}>
          Search
        </button>
        <button className="btn btn-secondary" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Search;
