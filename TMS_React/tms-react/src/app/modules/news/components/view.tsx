import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // Capture the news ID from the URL
import useFetchNews from './fatchnews';  // Custom hook for fetching news
import Loader from '../../include/loader';  // Loader component
import '../../include/loader.css';  // Loader styles

interface NewsItem {
  id: number;
  title: string;
  date: string;           // Date of the news item
  image?: string;         // Optional image field
  location?: string;      // Optional location field
  status: string;         // Status of the news
  description?: string;   // Optional description field
}

// Helper function to get the correct image URL for a news item
const getNewsImage = (id: number, img_name: string, size: string | null) => {
  if (img_name.startsWith('http://') || img_name.startsWith('https://')) {
    return img_name;
  }
  if (id > 0 && img_name) {
    return size
      ? `${process.env.REACT_APP_API_URL}/storage/news/${id}/thumb_${size}_${img_name}`
      : `${process.env.REACT_APP_API_URL}/storage/news/${id}/${img_name}`;
  }
  return `${process.env.REACT_APP_API_URL}/storage/Admin/uploads/noimg.png`;  // Default image path
};

const NewsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();  // Get the ID from the URL
  const { news: newsItems, loading } = useFetchNews();  // Fetch news items using a custom hook
  const [currentNews, setCurrentNews] = useState<NewsItem | null>(null);  // State to hold the current news item

  // Helper function to strip HTML tags
  const stripHtmlTags = (text: string) => {
 return text.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
  };

  // UseEffect to find the current news item by ID once the newsItems and ID are available
  useEffect(() => {
    if (newsItems.length > 0 && id) {
      const newsItem = newsItems.find((item) => item.id === parseInt(id, 10));
      
      const transformedItem: NewsItem | null = newsItem
        ? {
            ...newsItem,
            location: newsItem.location ? String(newsItem.location) : undefined, // Convert number to string
          }
        : null;
  
      setCurrentNews(transformedItem);  // Set the transformed news item or null if not found
    }
  }, [newsItems, id]);
  

  // Show loader while the data is still loading
  if (loading) {
    return <Loader />;
  }

  // Show a message if the news item is not found
  if (!currentNews) {
    return <div>No news item found.</div>;
  }

  // Fetch image for the current news item
  const img_name = currentNews.image || 'default.png';
  const originalImage = getNewsImage(currentNews.id, img_name, null);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      {/* Toolbar with page title */}
      <div id="kt_app_toolbar" className="app-toolbar py-lg-6">
        <div id="kt_app_toolbar_container" className="app-container container-fluid">
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <h2>News Details</h2>
          </div>
        </div>
      </div>
      {/* Content area */}
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div id="kt_app_content_container" className="app-container container-fluid">
          <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
            <div className="card card-flush">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div className="card-title">
                  <h2>{currentNews.title}</h2>  {/* Display news title */}
                </div>
                <a href="/news" className="btn btn-sm btn-primary">
                  <i className="fas fa-arrow-left"></i> Back to List
                </a>
              </div>
              <div className="card-body p-9">
                {/* News image */}
                <div className="row mb-7">
                  <div className="col-lg-8">
                    <a href={originalImage} target="_blank" rel="noopener noreferrer">
                      <img
                        src={originalImage}
                        alt={currentNews.title}
                        className="img-fluid"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    </a>
                  </div>
                </div>
                {/* News location */}
                <div className="row mb-7">
                  <label className="col-lg-3 fw-semibold text-muted">Location</label>
                  <div className="col-lg-3">
                    <span className="fw-bold fs-6 text-gray-800">{currentNews.location || '--'}</span>
                  </div>
                </div>
                {/* News status */}
                <div className="row mb-7">
                  <label className="col-lg-3 fw-semibold text-muted">Status</label>
                  <div className="col-lg-3">
                    {currentNews.status === '1' ? (
                      <span className="badge badge-light-success">Active</span>
                    ) : (
                      <span className="badge badge-light-danger">Inactive</span>
                    )}
                  </div>
                </div>
                {/* News date */}
                <div className="row mb-7">
                  <label className="col-lg-3 fw-semibold text-muted">Date</label>
                  <div className="col-lg-3">
                    <span className="fw-bold fs-6 text-gray-800">{currentNews.date}</span>
                  </div>
                </div>
                {/* News description */}
                <div className="row mb-12">
                  <label className="col-lg-3 fw-semibold text-muted">Description</label>
                  <div className="col-lg-8">
                    <span className="fw-bold fs-6 text-gray-800">{stripHtmlTags(currentNews.description || '--')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsView;
