import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import Loader from '../../include/loader';
import '../../include/loader.css';
import DataTable from 'react-data-table-component';
import Breadcrumb from '../../include/breadcrumbs';
import Pagination from './pagination';
import SearchForm from '../../include/searchForm';

interface SupportingAssociation {
  id: number;
  name: string;
//   year: string;
  status: number;
  created_at: string;
}

const Index: React.FC = () => {
  const [supportingassociations, setSupportingAssociation] = useState<SupportingAssociation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedsupportingassociations, setSelectedSupportingAssociations] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [paginatedAwards, setPaginatedAwards] = useState<SupportingAssociation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const pageTitle = 'Manage Supporting Association';
  const module = 'supporting-association';
  const moduleTitle = 'Supporting Association';

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const supportingassociationId = parseInt(value, 10);
    if (checked) {
      setSelectedSupportingAssociations([...selectedsupportingassociations, supportingassociationId]);
    } else {
        setSelectedSupportingAssociations(selectedsupportingassociations.filter((id) => id !== supportingassociationId));
    }
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsSelectAll(checked);
    if (checked) {
      const allsupportingassociationIds = supportingassociations.map((supportingassociation) => supportingassociation.id);
      setSelectedSupportingAssociations(allsupportingassociationIds);
    } else {
        setSelectedSupportingAssociations([]);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
  
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchSupportingAssociations = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}supporting-association`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSupportingAssociation(response.data.data);
      } catch (error) {
        console.error('Error fetching Supporting Association:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupportingAssociations();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(supportingassociations.length / itemsPerPage));
    setCurrentPage(1);
  }, [supportingassociations, itemsPerPage]);

  const currentSupportingAssociations = supportingassociations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const deleteSupportingAssociation = (id: number) => {
    const token = localStorage.getItem('jwt_token');
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this Supporting Association?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${process.env.REACT_APP_API_BASE_URL}supporting-association/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            Swal.fire('Deleted!', response.data.message, 'success');
            setSupportingAssociation((prevSupportingAssociations) => prevSupportingAssociations.filter((supportingassociation) => supportingassociation.id !== id));
          })
          .catch((error) => {
            console.error('Error deleting Supporting Association:', error);
          });
      } else {
        Swal.fire('Cancelled', 'Supporting Association was not deleted', 'error');
      }
    });
  };

  const deleteMultiple = () => {
    if (selectedsupportingassociations.length === 0) {
      Swal.fire('No Supporting Association selected', 'Please select Supporting Association to delete.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete selected Supporting Association.`,
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
            data: { ids: selectedsupportingassociations },
          })
          .then((response) => {
            Swal.fire('Deleted!', response.data.message, 'success');
            const updatedSupportingAssociations = supportingassociations.filter(
              (award) => !selectedsupportingassociations.includes(award.id)
            );
            setSupportingAssociation(updatedSupportingAssociations);
            setSelectedSupportingAssociations([]);
            setIsSelectAll(false);
          })
          .catch((error) => {
            console.error('Error deleting Supporting Association:', error);
            Swal.fire('Error!', 'There was an error deleting the Supporting Association.', 'error');
          });
      }
    });
  };

  const breadcrumbs = [{ label: 'Manage Supporting Association', url: '' }];

  const columns = [
    {
      name: (
        <input
          className="form-check-input"
          type="checkbox"
          checked={isSelectAll}
          onChange={handleSelectAllChange}
        />
      ),
      cell: (row: SupportingAssociation) => (
        <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
          <input
            className="form-check-input"
            type="checkbox"
            value={row.id.toString()}
            checked={selectedsupportingassociations.includes(row.id)}
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
      selector: (row: SupportingAssociation) => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Award Date',
      selector: (row: SupportingAssociation) => formatDate(row.created_at),
      sortable: true,
      width: '150px',
    },
    {
      name: 'Name',
      selector: (row: SupportingAssociation) => row.name,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Status',
      cell: (row: SupportingAssociation) => (
        <span className={`badge ${row.status == 1 ? 'badge-light-success' : 'badge-light-danger'}`}>
          {row.status == 1 ? 'Active' : 'Inactive'}
        </span>
      ),
      sortable: true,
      width: '200px',
    },
    {
      name: 'Action',
      cell: (row: SupportingAssociation) => (
        <>
          <Link to={`/supporting-association/edit/${row.id}`} className="btn-primary btn btn-sm btn-icon btn-light me-2">
            <i className="fas fa-edit"></i>
          </Link>
          <button onClick={() => deleteSupportingAssociation(row.id)} className="btn-danger btn btn-sm btn-icon btn-light">
            <i className="fas fa-trash"></i>
          </button>
        </>
      ),
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
        borderBottom: '#dee2e6',
      },
    },
    headCells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px',
        fontWeight: 'bold',
        fontSize: '1rem',
        color: '#495057',
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
    <>
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
                  <div className="d-flex justify-content-between align-items-center mb-5">
                    <h2 className="mb-0">{pageTitle}</h2>
                    {selectedsupportingassociations.length === 0 ? (
                      <Link to="/supporting-association/create" className="btn btn-primary">
                        Add
                      </Link>
                    ) : (
                      <div className="d-flex justify-content-end align-items-center">
                        <div className="fw-bold me-5">
                          <span className="me-2">{selectedsupportingassociations.length}</span> Selected
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
                    <>
                      <DataTable
                        columns={columns}
                        data={currentSupportingAssociations}
                        customStyles={customStyles}
                        pagination={false}
                        noDataComponent="No Supporting Association found"
                        defaultSortFieldId="id"
                        defaultSortAsc={false}
                      />
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                      />
                    </>
                  )}
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