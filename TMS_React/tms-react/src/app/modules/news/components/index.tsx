import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import Loader from '../../include/loader';
import '../../include/loader.css';
import DataTable from 'react-data-table-component';
import Breadcrumb from '../../include/breadcrumbs';
import Pagination from '../../include/pagination';
import useFetchNews from './fatchnews';
import { News as NewsType } from './fatchnews'; // Ensure consistent import

const Index: React.FC = () => {
  const { news, loading, setnews } = useFetchNews();
  const [selectednews, setSelectednews] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const pageTitle = 'Manage News';

  useEffect(() => {
    document.title = pageTitle;
    setTotalPages(Math.ceil(news.length / itemsPerPage));
  }, [pageTitle, news, itemsPerPage]);


  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = parseInt(e.target.value, 10);
    setSelectednews((prev) => 
      e.target.checked ? [...prev, newId] : prev.filter((id) => id !== newId)
    );
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsSelectAll(checked);
    setSelectednews(checked ? news.map((partner) => partner.id) : []);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getFullYear()).slice(-2)}`;
  };

  const currentnews = news.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const deletenew = async (id: number) => {
    const token = localStorage.getItem('jwt_token');
    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this Media Partner?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (confirmed.isConfirmed) {
      try {
        const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}news/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire('Deleted!', response.data.message, 'success');
        setnews((prev) => prev.filter((partner) => partner.id !== id));
      } catch (error) {
        console.error('Error deleting Media Partner:', error);
        Swal.fire('Error!', 'There was an error deleting the media partner.', 'error');
      }
    }
  };
  

const deleteMultiple = async () => {
    if (selectednews.length === 0) {
        Swal.fire('No News selected', 'Please select News to delete.', 'warning');
        return;
    }

    const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete selected News.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete them!',
    });

    if (confirmed.isConfirmed) {
        const token = localStorage.getItem('jwt_token');
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}news-delete-multiple`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: { ids: selectednews },
            });
            
            Swal.fire('Deleted!', response.data.message, 'success');
            setnews((prev) => prev.filter((partner) => !selectednews.includes(partner.id)));
            setSelectednews([]);
            setIsSelectAll(false);
        } catch (error) {
            console.error('Error deleting News:', error);
            Swal.fire('Error!', 'There was an error deleting the News.', 'error');
        }
    }
};

  const breadcrumbs = [{ label: 'Manage News', url: '' }];

  const columns = [
    {
      name: <input className="form-check-input" type="checkbox" checked={isSelectAll} onChange={handleSelectAllChange} />,
      cell: (row: NewsType) => (
        <input
          className="form-check-input"
          type="checkbox"
          value={row.id.toString()}
          checked={selectednews.includes(row.id)}
          onChange={handleCheckboxChange}
        />
      ),
      sortable: false,
      width: '80px',
    },
    {
      name: 'ID',
      selector: (row: NewsType) => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Title', // Updated from 'Name' to 'Title'
      selector: (row: NewsType) => row.title, // Updated to use 'title'
      sortable: true,
      width: '200px',
    },
    {
      name: 'Date',
      selector: (row: NewsType) => formatDate(row.date),
      sortable: true,
      width: '150px',
    },
    {
      name: 'Image',
      cell: (row: NewsType) => <img src={row.image} alt={row.title} style={{ width: '50px', height: '50px' }} />, // Updated alt text
      sortable: false,
      width: '100px',
    },
    {
      name: 'Location', // New column for location
      selector: (row: NewsType) => row.location,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Status',
      selector: (row: NewsType) => row.status,
      sortable: true,
      width: '150px',
    },
    
    {
      name: 'Action',
      cell: (row: NewsType) => (
        <>
          <Link to={`/news/edit/${row.id}`} className="btn-primary btn btn-sm btn-icon btn-light me-2">
            <i className="fas fa-edit"></i>
          </Link>
          <button onClick={() => deletenew(row.id)} className="btn-danger btn btn-sm btn-icon btn-light">
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
              <div className="card-body pt-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                  <h2 className="mb-0">{pageTitle}</h2>
                  {selectednews.length === 0 ? (
                    <Link to="/news/create" className="btn btn-primary">
                      Add
                    </Link>
                  ) : (
                    <div className="d-flex align-items-center">
                      <button className="btn btn-danger me-2" onClick={deleteMultiple}>
                        Delete Selected
                      </button>
                      <button className="btn btn-light" onClick={() => setSelectednews([])}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <DataTable
                  columns={columns}
                  data={currentnews}
                  paginationTotalRows={news.length}
                  onChangePage={handlePageChange}
                  onChangeRowsPerPage={handleItemsPerPageChange}
                  customStyles={customStyles}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
