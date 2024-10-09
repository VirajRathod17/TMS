import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface SearchFormProps {
    module: string;
    moduleTitle: string;
    onSearch: (query: { name: string; awardCategoryStatus: string; from_date: string; to_date: string }) => void;
    onReset: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ module, moduleTitle, onSearch, onReset }) => {
    const [name, setName] = React.useState('');
    const [awardCategoryStatus, setAwardCategoryStatus] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [from_date, setFromDate] = React.useState<Date | null>(null);
    const [to_date, setToDate] = React.useState<Date | null>(null);

    // Utility function to format date as dd-mm-yyyy
    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear(); // Full year (yyyy)
        return `${day}-${month}-${year}`;
    };

    const handleSearch = () => {
        if (module === 'award-category') {
            setLoading(true);

            // Format the from_date and to_date
            const formattedFromDate = formatDate(from_date);
            const formattedToDate = formatDate(to_date);

            // Pass both name and awardCategoryStatus in one object, including formatted dates
            onSearch({
                name,
                awardCategoryStatus,
                from_date: formattedFromDate,
                to_date: formattedToDate,
            });

            setLoading(false);
        }
    };

    const handleReset = () => {
        // Reset all state variables
        if (module === 'award-category') {
            setName('');
            setAwardCategoryStatus('');
        }
        // Set from_date and to_date back to null
        setFromDate(null); // This should be fine now
        setToDate(null);   // This should also work now
        onReset();
    };

    return (
        <div className="mb-15">
            <div className="mb-6">
                <h2>Search {moduleTitle}</h2>
            </div>
            {module === 'award-category' && (
                <div className="row mt-6">
                    <div className="col-lg-3 mb-lg-0">
                        <label>Name:</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control form-control-solid"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="col-lg-3 mb-lg-0">
                        <label>Status:</label>
                        <select
                            id="award_category_status"
                            className="form-control form-select datatable-input"
                            name="awardCategoryStatus"
                            data-control="select2"
                            data-hide-search="true"
                            value={awardCategoryStatus}
                            onChange={(e) => setAwardCategoryStatus(e.target.value)}
                        >
                            <option value="">-Choose Status-</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Active">Active</option>
                        </select>
                    </div>
                </div>
            )}
            <div className="row">
                <div className="col-lg-3 mb-lg-0">
                    <label>From Date:</label>
                    <DatePicker
                        selected={from_date}
                        onChange={(date: Date | null) => setFromDate(date)} // Correctly handles Date | null
                        dateFormat="dd-MM-yyyy"
                        className="form-control form-control-solid"
                        placeholderText="Select From Date"
                    />
                </div>
                <div className="col-lg-3 mb-lg-0">
                    <label>To Date:</label>
                    <DatePicker
                        selected={to_date}
                        onChange={(date: Date | null) => setToDate(date)} // Correctly handles Date | null
                        dateFormat="dd-MM-yyyy"
                        className="form-control form-control-solid"
                        placeholderText="Select To Date"
                    />
                </div>
                <div className="col-lg-3 my-5">
                    <button
                        className="btn btn-primary btn-primary--icon"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? (
                            <span>Loading...</span>
                        ) : (
                            <span>
                                <i className="la la-search"></i>
                                <span>Search</span>
                            </span>
                        )}
                    </button>
                    &nbsp;&nbsp;
                    <button
                        className="btn btn-secondary btn-secondary--icon"
                        onClick={handleReset}
                    >
                        <span>
                            <i className="la la-close"></i>
                            <span>Reset</span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchForm;
