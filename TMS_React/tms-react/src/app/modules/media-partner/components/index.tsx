import React, { useEffect, useState } from 'react';
import '../../include/loader.css';
import Loader from '../../include/loader';
import Breadcrumb from '../../include/breadcrumbs';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import SearchForm from '../../include/searchForm';

interface MediaPartner {
    id: number;
    name: string; // This field is kept as 'name'
    image: string; // Changed from 'image' to 'image'
    award_id: number; // Changed from 'award_id' to 'awardId'
    status: string;
    date: string;
    awardYear: string; // Changed from 'award_year' to 'awardYear'
}

function Index() {
    const [mediapartner, setmediapartner] = useState<MediaPartner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const pageTitle = 'Manage Media Partner';
    const module = 'media-partner';
    const moduleTitle = 'Media Partner';

    useEffect(() => {
        document.title = pageTitle;
    }, [pageTitle]);

    useEffect(() => {
        const fetchmediapartner = async () => {
            try {
                const token = localStorage.getItem('jwt_token');
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}media-partner`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setmediapartner(response.data.data);
            } catch (error) {
                console.error('Error fetching Media Partner:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchmediapartner();
    }, []);

    const breadcrumbs = [{ label: 'Manage Media Partner', url: '' }];

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = mediapartner.map((data) => data.id);
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
        );
    };

    const handleRemoveSelected = async () => {
        if (selectedIds.length === 0) {
            Swal.fire('No selection!', 'Please select at least one item to delete.', 'info');
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You will delete ${selectedIds.length} item(s)!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete them!',
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('jwt_token');

                for (const id of selectedIds) {
                    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}media-partner/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }

                Swal.fire('Deleted!', 'Selected items have been deleted.', 'success');

                setmediapartner((prevCategories) =>
                    prevCategories.filter((data) => !selectedIds.includes(data.id))
                );

                setSelectedIds([]);
            } catch (error) {
                Swal.fire('Error!', 'There was a problem deleting the selected media partners.', 'error');
                console.error('Error deleting Media Partners:', error);
            }
        }
    };

    const Delete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('jwt_token');
                await axios.delete(`${process.env.REACT_APP_API_BASE_URL}media-partner/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');

                setmediapartner((prevCategories) => prevCategories.filter((data) => data.id !== id));
            } catch (error) {
                Swal.fire('Error!', 'There was a problem deleting the media partner.', 'error');
                console.error('Error deleting Media Partner:', error);
            }
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
            <Helmet>
                <title>{pageTitle ? pageTitle : ''}</title>
            </Helmet>
            <div className="d-flex flex-column flex-column-fluid">
                <div id="kt_app_toolbar" className="app-toolbar mb-5">
                    <Breadcrumb breadcrumbs={breadcrumbs} />
                </div>
                <div id="kt_app_content" className="app-content flex-column-fluid">
                    <div id="kt_app_content_container" className="app-container">
                        <div className="card card-flush mb-5">
                            <div className="card-body pt-6 pb-3">
                                {/* <SearchForm module={module} moduleTitle={moduleTitle} /> */}
                            </div>
                        </div>
                        <div className="card card-flush mb-5">
                            <div className="card-body pt-5">
                                <div className="d-flex flex-stack mb-5">
                                    <div className="d-flex align-items-center position-relative my-1">
                                        <h2 className="mb-0">{pageTitle ? pageTitle : ''}</h2>
                                    </div>
                                    <div className="d-flex justify-content-end" data-kt-docs-table-toolbar="base">
                                        {selectedIds.length > 0 && (
                                            <button
                                                className="btn btn-danger me-2"
                                                onClick={handleRemoveSelected}
                                            >
                                                Delete Selected
                                            </button>
                                        )}
                                        <Link to="/media-partner/create" className="btn btn-primary" style={{ marginLeft: '10px' }}>
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
                                                        onChange={handleSelectAll}
                                                    />
                                                </div>
                                            </th>
                                            <th>ID</th>
                                            <th>Date</th>
                                            <th>Name</th>
                                            <th>Image</th>
                                            <th>Award Year</th> {/* Updated from Award Year to Award ID */}
                                            <th>Status</th>
                                            <th className="text-end min-w-100px">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 fw-semibold">
                                        {mediapartner.map((data) => (
                                            <tr key={data.id}>
                                                <td>
                                                    <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={selectedIds.includes(data.id)}
                                                            onChange={() => handleSelect(data.id)}
                                                        />
                                                    </div>
                                                </td>
                                                <td>{data.id}</td>
                                                <td>{new Date(data.date).toLocaleDateString()}</td>
                                                <td>{data.name}</td>
                                                <td>
                                                    {data.image && ( // Updated from 'image' to 'image'
                                                        <img
                                                            src={data.image}
                                                            alt="image"
                                                            style={{ width: '50px', height: '50px' }}
                                                        />
                                                    )}
                                                </td>
                                                <td>{data.award_id}</td>
                                                <td>
                                                    <span
                                                        className={`badge badge-${data.status === 'Inactive' ? 'light-danger' : 'light-success'
                                                            }`}
                                                    >
                                                        {data.status}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <Link to={`/media-partner/edit/${data.id}`} className="btn btn-sm btn-light me-1">
                                                        Edit
                                                    </Link>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => Delete(data.id)}
                                                    >
                                                        Delete
                                                    </button>
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
        </div>
    );
}

export default Index;
