import React, { useEffect, useState } from 'react';
import '../../loader.css';
import Loader from '../../loader';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Define the type for award category
interface AwardCategory {
    id: number;  // or string, depending on your backend
    name: string;
    award_id: number; // or string
    main_sponsored_id: number; // or string
    status: string; // or whatever type it should be
}

function Index() {
    // State to hold award categories
    const [awardCategories, setAwardCategories] = useState<AwardCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch award categories on component mount
    useEffect(() => {
        const fetchAwardCategories = async () => {
            try {
                const token = localStorage.getItem('jwt_token');
                const response = await axios.get(
                    process.env.REACT_APP_API_BASE_URL + 'award-category',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Adjust the API endpoint
                setAwardCategories(response.data.data);
            } catch (error) {
                console.error('Error fetching award categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAwardCategories();
    }, []);

    // Display loader while fetching
    if (loading) {
        return <Loader />;
    }

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <div id="kt_app_toolbar" className="app-toolbar mb-5 mt-5">
                <div id="kt_app_toolbar_container" className="app-container container-fluid">
                    {/* Toolbar Content */}
                </div>
            </div>
            <div id="kt_app_content" className="app-content flex-column-fluid">
                <div id="kt_app_content_container" className="app-container container-fluid">
                    <div className="card card-flush mb-5">
                        <div className="card-body pt-6 pb-3">
                            {/* Card Body Content */}
                        </div>
                    </div>
                    <div className="card card-flush mb-5">
                        <div className="card-body pt-5">
                            <div className="d-flex flex-stack mb-5">
                                <div className="d-flex align-items-center position-relative my-1">
                                    <h2 className="mb-0">Award Category</h2>
                                </div>
                                <div className="d-flex justify-content-end" data-kt-docs-table-toolbar="base">
                                    <Link to="/award_category/create" className="btn btn-primary" style={{ marginLeft: '10px' }}>
                                        Add
                                    </Link>
                                </div>
                            </div>
                            <table id="kt_datatable_example_1" className="table align-middle table-row-dashed fs-6 gy-5">
                                <thead>
                                    <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                                        <th className="w-10px pe-2">
                                            <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    data-kt-check="true"
                                                    data-kt-check-target="#kt_datatable_example_1 .form-check-input"
                                                    value="1"
                                                />
                                            </div>
                                        </th>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Award ID</th>
                                        <th>Main Sponsored ID</th>
                                        <th>Status</th>
                                        <th className="text-end min-w-100px">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 fw-semibold">
                                    {awardCategories.map((category) => (
                                        <tr key={category.id}>
                                            <td>
                                                <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={category.id}
                                                    />
                                                </div>
                                            </td>
                                            <td>{category.id}</td>
                                            <td>{category.name}</td>
                                            <td>{category.award_id}</td>
                                            <td>{category.main_sponsored_id}</td>
                                            <td>{category.status}</td>
                                            <td className="text-end">
                                                <Link to={`/award_category/edit/${category.id}`} className="btn btn-sm btn-light">
                                                    Edit
                                                </Link>
                                                {/* Add additional action buttons here */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Index;
