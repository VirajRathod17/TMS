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
import Pagination from '../../include/pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash , faEye } from '@fortawesome/free-solid-svg-icons';
import { Badge } from 'react-bootstrap';

interface Judges {
    id: number;
    date: string;
    name: string;
    award_id: number;
    status: string; 
}

function Index() {
  const [judges, setJudges] = useState<Judges[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pageTitle = 'Manage Judges Panel'; 
  const module = 'judges';
  const moduleTitle = 'Judges Panel';
    useEffect(() => {
        document.title = pageTitle; 
    }, [pageTitle]); 

    const breadcrumbs = [{ label: 'Manage Judges Panel', url: '' }];
    useEffect(() => {
        const fetchJudges = async () => {
            try {
                const token = localStorage.getItem('jwt_token');
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}judges`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setJudges(response.data.data);
            } catch (error) {
                console.error('Error fetching award categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJudges();
    }, []);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = judges.map((judge) => judge.id);
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
            text: 'Do you want to delete the selected judges?',
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
                    `${process.env.REACT_APP_API_BASE_URL}judges-multiple-delete`,
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
                    setJudges((prevCategories) =>
                        prevCategories.filter((judge) => !selectedIds.includes(judge.id))
                    );
                    setSelectedIds([]); 
                } else {
                    Swal.fire('Error!', response.data.message, 'error');
                }
            } catch (error) {
                console.error('Error deleting judges:', error);
                Swal.fire('Error!', 'An error occurred while deleting the judges.', 'error');
            }
        } else {
            Swal.fire('Cancelled', 'The selected judges were not deleted', 'error');
        }
    };

    const Delete = async (id: number) => {
        const token = localStorage.getItem('jwt_token');
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this judge?",
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
                    `${process.env.REACT_APP_API_BASE_URL}judges/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                Swal.fire('Deleted!', response.data.message, 'success');

                // Update the award categories state
                setJudges(prevJudges => 
                    prevJudges.filter(judge => judge.id !== id)
                );
            } catch (error) {
                console.error('Error deleting judge:', error);
                Swal.fire('Error!', 'An error occurred while deleting the judge.', 'error');
            }
        } else {
            Swal.fire('Cancelled', 'Judge was not deleted', 'error');
        }
    };


    const columns = [
        {
          name: <input className="form-check-input" type="checkbox" checked={selectedIds.length === judges.length} onChange={handleSelectAll} />,
          cell: (row: Judges) => (
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
          width: '70px',
        },
        {
          name: 'ID',
          selector: (row: Judges) => row.id,
          sortable: true,
          width: '80px',
        },
        {
          name: 'Date',
          selector: (row: Judges) => row.date,
          sortable: true,
          width: '130px',
        },
        {
          name: 'Name',
          selector: (row: Judges) => row.name,
          sortable: true,
          width: '200px',
        },
        {
          name: 'Award ID',
          selector: (row: Judges) => row.award_id,
          sortable: true,
          width: '150px',
        },
        {
          name: 'Status',
          cell: (row: Judges) => 
            row.status === 'Active' 
              ? <span className="badge badge-light-success">{row.status}</span> 
              : <span className="badge badge-light-danger">{row.status}</span>,
          sortable: true,
          width: '250px',
        },
        {
          name: 'Action',
          cell: (row: Judges) => (
            <>
              <div className="text-end">
                {/* <Link to={`/award-category/view/${row.id}`} className="btn btn-sm btn-primary me-2">
                  <FontAwesomeIcon icon={faEye} />
                </Link> */}
                <Link to={`/judges/edit/${row.id}`} className="btn btn-sm btn-info me-2">
                   <FontAwesomeIcon icon={faPenToSquare} />
                </Link>
                <button onClick={() => Delete(row.id)} className="btn btn-sm btn-danger">
                <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </>
          ),
          width: '290px',
          style: {
              display: 'flex',
              justifyContent: 'flex-end',
          },
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
      
      if (loading) {
          return <Loader />;
      }

      return (
        <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
          <div className="d-flex flex-column flex-column-fluid">
            <div id="kt_app_toolbar" className="app-toolbar mb-5">
              <Breadcrumb breadcrumbs={breadcrumbs} />
            </div>
            <div id="kt_app_content" className="app-content flex-column-fluid">
              <div id="kt_app_content_container" className="app-container">
                <div className="card card-flush mb-5">
                  <div className="card-body pt-6 pb-3">
                  {/* <SearchForm  module={module} 
                      moduleTitle={moduleTitle} onSearch={handleSearch} onReset={handleReset}/> */}
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
                          <Link to="/judges/create" className="btn btn-primary" style={{ marginLeft: '10px' }}>
                            Add
                          </Link>
                        )}
                        {selectedIds.length > 0 && (
                            
                            <div className="d-flex justify-content-end align-items-center">
                              <div className="fw-bold me-5">
                                <span className="me-2">{selectedIds.length}</span> Selected
                              </div>
                              <button type="button" className="btn btn-danger me-3" onClick={handleRemoveSelected}>
                                Remove Selected
                              </button>
                            </div>
                        )}
                      </div>
                    </div>
                    <DataTable
                        columns={columns}
                        data={judges}
                        customStyles={customStyles}
                        pagination={false}
                        noDataComponent="No Judges found"
                    />
                    {/* {!loading && (
                          <Pagination
                              totalPages={totalPages}
                              currentPage={currentPage}
                              onPageChange={setCurrentPage}
                              itemsPerPage={itemsPerPage}
                              onItemsPerPageChange={setItemsPerPage}
                          />
                      )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default Index;
