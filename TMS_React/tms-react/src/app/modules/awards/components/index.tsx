import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import DataTable from 'react-data-table-component';
import Breadcrumb from '../../include/breadcrumbs';
import Pagination from './pagination';

interface Award {
  id: number;
  name: string;
  year: string;
  location: string;
  award_date: string;
}

const Index: React.FC = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAwards, setSelectedAwards] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [paginatedAwards, setPaginatedAwards] = useState<Award[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const pageTitle = 'Manage Award';
  const moduleTitle = 'Award';

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const awardId = parseInt(value, 10);
    if (checked) {
      setSelectedAwards([...selectedAwards, awardId]);
    } else {
      setSelectedAwards(selectedAwards.filter((id) => id !== awardId));
    }
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsSelectAll(checked);
    if (checked) {
      const allAwardIds = awards.map((award) => award.id);
      setSelectedAwards(allAwardIds);
    } else {
      setSelectedAwards([]);
    }
  };

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}awards`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAwards(response.data.data);
      } catch (error) {
        console.error('Error fetching Awards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  useEffect(() => {
    const paginateAwards = () => {
      setLoading(true);

      const startIndex = (currentPage - 1) * itemsPerPage;
      // const paginatedData = awards.slice(startIndex, startIndex + itemsPerPage);
      const paginatedData = awards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

      setPaginatedAwards(paginatedData);
      setTotalPages(Math.ceil(awards.length / itemsPerPage));
      setLoading(false);
    };

    paginateAwards();
  }, [currentPage, itemsPerPage, awards]);

  const deleteAward = (id: number) => {
    const token = localStorage.getItem('jwt_token');
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this Award?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${process.env.REACT_APP_API_BASE_URL}awards/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            Swal.fire('Deleted!', response.data.message, 'success');
            setAwards((prevAwards) => prevAwards.filter((award) => award.id !== id));
          })
          .catch((error) => {
            console.error('Error deleting Award:', error);
          });
      } else {
        Swal.fire('Cancelled', 'Award was not deleted', 'error');
      }
    });
  };

  const deleteMultiple = () => {
    if (selectedAwards.length === 0) {
      Swal.fire('No awards selected', 'Please select awards to delete.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete selected awards.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('jwt_token');
        axios
          .delete(`${process.env.REACT_APP_API_BASE_URL}/awards-delete-multiple`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { ids: selectedAwards },
          })
          .then((response) => {
            Swal.fire('Deleted!', response.data.message, 'success');
            const updatedAwards = awards.filter(
              (award) => !selectedAwards.includes(award.id)
            );
            setAwards(updatedAwards);
            setSelectedAwards([]);
            setIsSelectAll(false);
          })
          .catch((error) => {
            console.error('Error deleting awards:', error);
            Swal.fire('Error!', 'There was an error deleting the awards.', 'error');
          });
      }
    });
  };

  const breadcrumbs = [{ label: 'Manage Award', url: '' }];

  const columns = [
    {
      name: <input className="form-check-input" type="checkbox" checked={isSelectAll} onChange={handleSelectAllChange} />,
      cell: (row: Award) => (
        <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
          <input
            className="form-check-input"
            type="checkbox"
            value={row.id.toString()}
            checked={selectedAwards.includes(row.id)}
            onChange={handleCheckboxChange}
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
      selector: (row: Award) => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Name',
      selector: (row: Award) => row.name,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Award Year',
      selector: (row: Award) => row.year,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Location',
      selector: (row: Award) => row.location,
      sortable: true,
      width: '250px',
    },
    {
      name: 'Award Date',
      selector: (row: Award) => row.award_date,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Action',
      cell: (row: Award) => (
        <>
        <div className='justify-content-end'>
          <Link to={`/awards/edit/${row.id}`} className="btn btn-sm btn-light me-2">
            Edit
          </Link>
          <button onClick={() => deleteAward(row.id)} className="btn btn-sm btn-light">
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
    <>
      <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <div className="d-flex flex-column flex-column-fluid">
          <div id="kt_app_toolbar" className="app-toolbar">
            <Breadcrumb breadcrumbs={breadcrumbs} />
          </div>
          <div id="kt_app_content" className="app-content flex-column-fluid">
            <div id="kt_app_content_container" className="app-container">
              <div className="card card-flush mb-5">
                <div className="card-body pt-6">
                  {/* <SearchForm /> */}
                </div>
              </div>
              <div className="card card-flush mb-5">
                <div className="card-body pt-5">
                  <div className="d-flex justify-content-between align-items-center mb-5">
                    <h2 className="mb-0">{pageTitle}</h2>
                    {selectedAwards.length === 0 ? (
                      <Link to="/awards/create" className="btn btn-primary">
                        Add {moduleTitle}
                      </Link>
                    ) : (
                      <div className="d-flex justify-content-end align-items-center">
                        <div className="fw-bold me-5">
                          <span className="me-2">{selectedAwards.length}</span> Selected
                        </div>
                        <button type="button" className="btn btn-primary" onClick={deleteMultiple}>
                          Remove Selected
                        </button>
                      </div>
                    )}
                  </div>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={awards}
                      customStyles={customStyles}
                      pagination={false}
                      striped
                      highlightOnHover
                      pointerOnHover
                      persistTableHead
                    />
                  )}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                    itemsPerPage={itemsPerPage}
                    isLoading={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
