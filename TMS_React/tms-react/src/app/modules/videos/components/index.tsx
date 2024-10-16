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
import useFetchVideos from '../components/fatchvideos';
import { Videos as VideoType } from '../components/fatchvideos';

const Index: React.FC = () => {
  const { videos, loading, setVideos } = useFetchVideos();
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const pageTitle = 'Manage Videos';

  useEffect(() => {
    document.title = pageTitle;
    setTotalPages(Math.ceil(videos.length / itemsPerPage));
  }, [pageTitle, videos, itemsPerPage]);

  // Handle checkbox change for individual videos
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videoId = parseInt(e.target.value, 10);
    setSelectedVideos((prev) => 
      e.target.checked ? [...prev, videoId] : prev.filter((id) => id !== videoId)
    );
  };

  // Handle "select all" checkbox change
  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsSelectAll(checked);
    setSelectedVideos(checked ? videos.map((video) => video.id) : []);
  };

  // Format date to DD-MM-YY
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getFullYear()).slice(-2)}`;
  };

  // Slice videos for pagination
  const currentVideos = videos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Pagination handlers
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  // Delete a single video
  const deleteVideo = async (id: number) => {
    const token = localStorage.getItem('jwt_token');
    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this video?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirmed.isConfirmed) {
      try {
        const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}videos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Deleted!', response.data.message, 'success');
        setVideos((prev) => prev.filter((video) => video.id !== id));
      } catch (error) {
        console.error('Error deleting video:', error);
        Swal.fire('Error!', 'There was an error deleting the video.', 'error');
      }
    }
  };

  // Delete multiple videos
  const deleteMultiple = async () => {
    if (selectedVideos.length === 0) {
      Swal.fire('No videos selected', 'Please select videos to delete.', 'warning');
      return;
    }

    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete selected videos.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete them!',
    });

    if (confirmed.isConfirmed) {
      const token = localStorage.getItem('jwt_token');
      try {
        const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}videos-delete-multiple`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { ids: selectedVideos },
        });
        
        Swal.fire('Deleted!', response.data.message, 'success');
        setVideos((prev) => prev.filter((video) => !selectedVideos.includes(video.id)));
        setSelectedVideos([]);
        setIsSelectAll(false);
      } catch (error) {
        console.error('Error deleting videos:', error);
        Swal.fire('Error!', 'There was an error deleting the videos.', 'error');
      }
    }
  };

  const breadcrumbs = [{ label: 'Manage Videos', url: '' }];

  // Define table columns
  const columns = [
    {
      name: <input className="form-check-input" type="checkbox" checked={isSelectAll} onChange={handleSelectAllChange} />,
      cell: (row: VideoType) => (
        <input
          className="form-check-input"
          type="checkbox"
          value={row.id.toString()}
          checked={selectedVideos.includes(row.id)}
          onChange={handleCheckboxChange}
        />
      ),
      sortable: false,
      width: '80px',
    },
    {
      name: 'ID',
      selector: (row: VideoType) => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Title',
      selector: (row: VideoType) => row.title,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Award ID',
      selector: (row: VideoType) => row.award_id,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Sponsor Name',
      selector: (row: VideoType) => row.sponsored_id,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Banner Image',
      cell: (row: VideoType) => <img src={row.image} alt={row.title} style={{ width: '50px', height: '50px' }} />,
      sortable: false,
      width: '100px',
    },
    // {
    //   name: 'Link',
    //   cell: (row: VideoType) => (
    //     <a href={row.link} target="_blank" rel="noopener noreferrer">
    //       Watch Video
    //     </a>
    //   ),
    //   sortable: false,
    //   width: '150px',
    // },
    {
      name: 'Action',
      cell: (row: VideoType) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <a 
        href={row.link} // Assuming row.link contains the URL
        target="_blank" // Open in a new tab
        rel="noopener noreferrer" // Security improvement
        className="btn-danger btn btn-sm btn-icon btn-light me-2" // Same button styling
      >
        <i className="fas fa-external-link-alt"></i> {/* Optional icon */}
      </a>
          <Link to={`/videos/edit/${row.id}`} className="btn-primary btn btn-sm btn-icon btn-light me-2">
            <i className="fas fa-edit"></i>
          </Link>
          <button onClick={() => deleteVideo(row.id)} className="btn-danger btn btn-sm btn-icon btn-light">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
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

  // Show loader while videos are loading
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
      <Helmet>
        <title>{pageTitle}</title>
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
                  {selectedVideos.length === 0 ? (
                    <Link to="/videos/create" className="btn btn-primary">
                      Add
                    </Link>
                  ) : (
                    <div className="d-flex align-items-center">
                      <button className="btn btn-danger me-2" onClick={deleteMultiple}>
                        Delete Selected
                      </button>
                      <button className="btn btn-light" onClick={() => setSelectedVideos([])}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <DataTable
                  columns={columns}
                  data={currentVideos}
                  paginationTotalRows={videos.length}
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
