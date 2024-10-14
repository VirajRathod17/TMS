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
import Search from './Search';
import { News as NewsType } from './fatchnews';

interface News {
  id: number;
  title: string; // Changed from name to title
  image: string;
  location: number; // Changed from award_id to location
  status: string;
  date: string;
}

const Index: React.FC = () => {
  const { news, loading, setnews } = useFetchNews();
  const [selectedNews, setSelectedNews] = useState<number[]>([]); // Updated state to reflect 'News'
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [titleSearchTerm, setTitleSearchTerm] = useState(''); // Updated to titleSearchTerm
  const [dateSearchTerm, setDateSearchTerm] = useState('');
  const [statusSearchTerm, setStatusSearchTerm] = useState('');
  const [filteredNews, setFilteredNews] = useState<News[]>(news); // Updated to filteredNews

  const pageTitle = 'Manage News'; // Updated page title
  const module = 'news'; // Updated module name
  const moduleTitle = 'News'; // Updated module title

  useEffect(() => {
    document.title = pageTitle;
    setTotalPages(Math.ceil(filteredNews.length / itemsPerPage));
  }, [pageTitle, filteredNews, itemsPerPage]);

  useEffect(() => {
    setFilteredNews(news); // Set initial filtered news
  }, [news]);

  // Search handlers
  const handleTitleSearchChange = (term: string) => {
    setTitleSearchTerm(term); // Updated to handleTitleSearchChange
  };

  const handleDateSearchChange = (term: string) => {
    setDateSearchTerm(term);
  };

  const handleStatusSearchChange = (term: string) => {
    setStatusSearchTerm(term);
  };

  const handleSearch = () => {
    const filtered = news
      .filter(news => news.title.toLowerCase().includes(titleSearchTerm.toLowerCase())) // Updated to title
      .filter(news => formatDate(news.date).includes(dateSearchTerm)) // Updated to date
      .filter(news =>
        statusSearchTerm === '' || news.status.toLowerCase() === statusSearchTerm
      );

    setFilteredNews(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  // New reset handler
  const handleReset = () => {
    setTitleSearchTerm(''); // Updated to reset titleSearchTerm
    setDateSearchTerm('');
    setStatusSearchTerm('');
    setFilteredNews(news); // Reset to the original list
    setCurrentPage(1); // Reset to first page
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newsId = parseInt(e.target.value, 10);
    setSelectedNews((prev) =>
      e.target.checked ? [...prev, newsId] : prev.filter((id) => id !== newsId)
    );
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsSelectAll(checked);
    setSelectedNews(checked ? news.map((news) => news.id) : []);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ''; // Return empty string if the date is invalid
    }
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getFullYear()).slice(-2)}`;
  };

  const currentNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const deleteNews = async (id: number) => {
    const token = localStorage.getItem('jwt_token');
    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this News?",
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
        setnews((prev) => prev.filter((news) => news.id !== id));
        setFilteredNews((prev) => prev.filter((news) => news.id !== id)); // Update filtered news
      } catch (error) {
        console.error('Error deleting News:', error);
        Swal.fire('Error!', 'There was an error deleting the news.', 'error');
      }
    }
  };

  const deleteMultiple = async () => {
    if (selectedNews.length === 0) {
      Swal.fire('No news selected', 'Please select news to delete.', 'warning');
      return;
    }

    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete selected news.`,
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
          data: { ids: selectedNews },
        });

        Swal.fire('Deleted!', response.data.message, 'success');
        setnews((prev) => prev.filter((news) => !selectedNews.includes(news.id)));
        setFilteredNews((prev) => prev.filter((news) => !selectedNews.includes(news.id))); // Update filtered list
        setSelectedNews([]);
        setIsSelectAll(false);
      } catch (error) {
        console.error('Error deleting news:', error);
        Swal.fire('Error!', 'There was an error deleting the news.', 'error');
      }
    }
  };

  const breadcrumbs = [{ label: 'Manage News', url: '' }]; // Updated breadcrumbs

  const columns = [
    {
      name: <input className="form-check-input" type="checkbox" checked={isSelectAll} onChange={handleSelectAllChange} />,
      cell: (row: News) => (
        <input
          className="form-check-input"
          type="checkbox"
          value={row.id}
          checked={selectedNews.includes(row.id)}
          onChange={handleCheckboxChange}
        />
      ),
      sortable: false,
      width: '50px',
    },
    {
      name: 'ID',
      selector: (row: News) => row.id.toString(),
      sortable: true,
      width: '100px',
    },
    {
      name: 'Date',
      selector: (row: News) => formatDate(row.date), // Updated to date
      sortable: true,
      width: '150px',
    },
    {
      name: 'Title', // Updated from Name to Title
      selector: (row: News) => row.title, // Updated to title
      sortable: true,
      width: '200px',
    },
    {
      name: 'Logo',
      cell: (row: News) => <img src={row.image} alt={row.title} style={{ width: '50px', height: '50px' }} />, // Updated to title
      sortable: false,
      width: '150px',
    },
    {
      name: 'Location', // Updated from Award Year to Location
      selector: (row: News) => row.location, // Updated to location
      sortable: true,
      width: '150px',
    },
    {
      name: 'Status',
      selector: (row: News) => row.status,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Actions',
      cell: (row: News) => (
        <>
          <Link className="btn btn-info btn-sm" to={`edit/${row.id}`}>Edit</Link>
          <button className="btn btn-danger btn-sm" onClick={() => deleteNews(row.id)}>Delete</button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px',
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container-fluid">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>{moduleTitle}</h1>
        </div>
          <Search
            titleSearchTerm={titleSearchTerm} // Updated
            dateSearchTerm={dateSearchTerm}
            statusSearchTerm={statusSearchTerm}
            onTitleSearchChange={handleTitleSearchChange} // Updated
            onDateSearchChange={handleDateSearchChange}
            onStatusSearchChange={handleStatusSearchChange}
            onSearch={handleSearch}
            onReset={handleReset} // Updated
          />
        
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div id="kt_app_content_container" className="app-container">
            <div className="card card-flush mb-5">
              <div className="card-body pt-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                  <h2 className="mb-0">{pageTitle}</h2>
                  {selectedNews.length === 0 ? (
                    <Link to="/media-partner/create" className="btn btn-primary">
                      Add
                    </Link>
                  ) : (
                    <div className="d-flex align-items-center">
                      <button className="btn btn-danger me-2" onClick={deleteMultiple}>
                        Delete Selected
                      </button>
                      <button className="btn btn-light" onClick={() => setSelectedNews([])}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <DataTable
                  columns={columns}
                  data={currentNews}
                  pagination
                  paginationServer
                  paginationTotalRows={filteredNews.length}
                  onChangePage={handlePageChange}
                  onChangeRowsPerPage={handleItemsPerPageChange}
                  striped
                  highlightOnHover
                  pointerOnHover
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
   
  );
};

export default Index;
