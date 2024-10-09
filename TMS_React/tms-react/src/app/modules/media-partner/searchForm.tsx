import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface SearchFormProps {
    module: string;
    moduleTitle: string;
    onSearch: (query: { name: string; awardCategoryStatus: string; from_date: string; to_date: string }) => void;
    onReset: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ module, moduleTitle, onSearch,onReset}) => {
    const [name, setName] = React.useState('');
    const [awardCategoryStatus, setAwardCategoryStatus] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [from_date, setFromDate] = React.useState('');
    const [to_date, setToDate] = React.useState('');

    // Utility function to format date as dd-mm-yyyy
    const formatDate = (date: string): string => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = d.getFullYear(); // Full year (yyyy)
        return `${day}-${month}-${year}`;
    };

    const handleSearch = () => {
        if (module === 'media-partner') {
            setLoading(true);

            // Format the from_date and to_date
            const formattedFromDate = from_date ? formatDate(from_date) : '';
            const formattedToDate = to_date ? formatDate(to_date) : '';

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
        setName('');
        setAwardCategoryStatus('');
        setFromDate('');
        setToDate('');
        onReset();
    };

    return (
        <div className="mb-15">
            <div className="mb-6">
                <h2>Search {moduleTitle}</h2>
            </div>
            {module === 'media-partner' && (
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
                    <input
                        type="date"
                        id="from_date"
                        className="form-control form-control-solid"
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div className="col-lg-3 mb-lg-0">
                    <label>To Date:</label>
                    <input
                        type="date"
                        id="to_date"
                        className="form-control form-control-solid"
                        onChange={(e) => setToDate(e.target.value)}
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
