import React, { useEffect, useState } from 'react';
import '../../include/loader.css';
import Loader from '../../include/loader';
import Breadcrumb from '../../include/breadcrumbs';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {Helmet} from 'react-helmet';
import SearchForm from '../../include/searchForm';
import DataTable from 'react-data-table-component';
interface AwardCategory {
    id: number;
    name: string;
    award_id: number;
    main_sponsored_id: number; 
    status: string; 
}

function Index() {
    const [awardCategories, setAwardCategories] = useState<AwardCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const pageTitle = 'Manage Award Categories'; // Dynamic page title
    const module = 'award-category';
    const moduleTitle = 'Award Categories';
    useEffect(() => {
        document.title = pageTitle; 
    }, [pageTitle]); 

    useEffect(() => {
        const fetchAwardCategories = async () => {
            try {
                const token = localStorage.getItem('jwt_token');
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}award-category`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setAwardCategories(response.data.data);
            } catch (error) {
                console.error('Error fetching award categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAwardCategories();
    }, []);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = awardCategories.map((category) => category.id);
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
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete the selected categories?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete them!',
            cancelButtonText: 'No, cancel!',
        });

        if (confirmed.isConfirmed) {
            const token = localStorage.getItem('jwt_token');
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}award-category-multiple-delete`,
                    { ids: selectedIds }, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                        },
                    }
                );
                if (response.data.status === 'success') {
                    Swal.fire('Deleted!', 'Award categories have been deleted.', 'success');
                    // Update the state to remove deleted categories
                    setAwardCategories((prevCategories) =>
                        prevCategories.filter((category) => !selectedIds.includes(category.id))
                    );
                    setSelectedIds([]); 
                } else {
                    Swal.fire('Error!', response.data.message, 'error');
                }
            } catch (error) {
                console.error('Error deleting categories:', error);
                Swal.fire('Error!', 'An error occurred while deleting the categories.', 'error');
            }
        } else {
            Swal.fire('Cancelled', 'The selected categories were not deleted', 'error');
        }
    };

    const Delete = async (id: number) => {
        const token = localStorage.getItem('jwt_token');
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this category?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });

        if (confirmed.isConfirmed) {
            try {
                const response = await axios.delete(
                    `${process.env.REACT_APP_API_BASE_URL}award-category/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                Swal.fire('Deleted!', response.data.message, 'success');

                // Update the award categories state
                setAwardCategories(prevCategories => 
                    prevCategories.filter(category => category.id !== id)
                );
            } catch (error) {
                console.error('Error deleting award category:', error);
                Swal.fire('Error!', 'An error occurred while deleting the category.', 'error');
            }
        } else {
            Swal.fire('Cancelled', 'Award category was not deleted', 'error');
        }
    };

    const breadcrumbs = [{ label: 'Manage Award Categories', url: '' }];

    if (loading) {
        return <Loader />;
    }

    const columns = [
        {
          name: <input className="form-check-input" type="checkbox" checked={selectedIds.length === awardCategories.length} onChange={handleSelectAll} />,
          cell: (row: AwardCategory) => (
            <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
              <input
                className="form-check-input"
                type="checkbox"
                value={row.id.toString()}
                checked={selectedIds.includes(row.id)}
                onChange={() => handleSelect(row.id)}
              />
            </div>
          ),
          sortable: false,
          ignoreRowClick: true,
          allowOverflow: true,
          button: false,
          width: '80px',
        },
        {
          name: 'ID',
          selector: (row: AwardCategory) => row.id,
          sortable: true,
          width: '80px',
        },
        {
          name: 'Name',
          selector: (row: AwardCategory) => row.name,
          sortable: true,
          width: '200px',
        },
        {
          name: 'Award ID',
          selector: (row: AwardCategory) => row.award_id,
          sortable: true,
          width: '200px',
        },
        {
          name: 'Main Sponsored ID',
          selector: (row: AwardCategory) => row.main_sponsored_id,
          sortable: true,
          width: '200px',
        },
        {
          name: 'Status',
          selector: (row: AwardCategory) => row.status,
          sortable: true,
          width: '150px',
        },
        {
          name: 'Action',
          cell: (row: AwardCategory) => (
            <>
              <div style={{ textAlign: 'right' }}>
                <Link to={`/award-category/edit/${row.id}`} className="btn btn-sm btn-light me-2">
                  Edit
                </Link>
                <button onClick={() => Delete(row.id)} className="btn btn-sm btn-light">
                  Delete
                </button>
              </div>
            </>
          ),
        },
      ];
      
      const customStyles = {
        rows: {
          style: {
            minHeight: '72px',
            borderBottom: '1px solid #dee2e6',
          },
        },
        headCells: {
          style: {
            paddingLeft: '16px',
            paddingRight: '16px',
            fontWeight: 'bold',
            fontSize: '1rem',
            color: '#495057',
            backgroundColor: '#f8f9fa',
          },
        },
        cells: {
          style: {
            paddingLeft: '16px',
            paddingRight: '16px',
            fontSize: '0.875rem',
            color: '#212529',
          },
        },
      };
      
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
                    <SearchForm module={module} moduleTitle={moduleTitle} />
                  </div>
                </div>
                <div className="card card-flush mb-5">
                  <div className="card-body pt-5">
                    <div className="d-flex flex-stack mb-5">
                      <div className="d-flex align-items-center position-relative my-1">
                        <h2 className="mb-0">{pageTitle ? pageTitle : ''}</h2>
                      </div>
                      <div className="d-flex justify-content-end" data-kt-docs-table-toolbar="base">
                        {selectedIds.length === 0 && (
                          <Link to="/award-category/create" className="btn btn-primary" style={{ marginLeft: '10px' }}>
                            Add
                          </Link>
                        )}
                        {selectedIds.length > 0 && (
                          <div className="d-flex justify-content-end align-items-center">
                            <button type="button" className="btn btn-danger me-3" onClick={handleRemoveSelected}>
                              Remove Selected
                            </button>
                            <button type="button" className="btn btn-light" onClick={() => setSelectedIds([])}>
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <DataTable
                      columns={columns}
                      data={awardCategories}
                      customStyles={customStyles}
                      pagination
                      striped
                      highlightOnHover
                      pointerOnHover
                      persistTableHead
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default Index;
