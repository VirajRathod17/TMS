import React, { useEffect, useState } from 'react';
import useFetchNews from './fatchnews';  // Change this to your actual fetch hook for news
import Loader from '../../include/loader';
import '../../include/loader.css';

interface News {
    id: number;
    title: string;
    date: string;           // Date of the news item
    image?: string;        // Optional image field
    location?: string;     // Optional location field
    status: string;        // Status of the news
    description?: string;  // Optional description field
}

// Utility function to get the news image URL
const getNewsImage = (id: number, img_name: string, size: string | null) => {
    if (id > 0 && img_name) {
        return size
            ? `${process.env.REACT_APP_API_URL}/storage/news/${id}/thumb_${size}_${img_name}`
            : `${process.env.REACT_APP_API_URL}/storage/news/${id}/${img_name}`;
    }
    return `${process.env.REACT_APP_API_URL}/storage/Admin/uploads/noimg.png`;
};

const NewsView: React.FC = () => {
    const { news, loading } = useFetchNews(); // Adjust this to the actual hook that fetches news
    const [currentNews, setCurrentNews] = useState<News | null>(null);

    useEffect(() => {
        if (news.length > 0) {
            // Set the first news item as the default selected item
            setCurrentNews(news[0]);
        }
    }, [news]);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getFullYear()).slice(-2)}`;
    };

    if (loading) {
        return <Loader />;
    }

    if (!currentNews) {
        return <div>No news found.</div>;
    }

    // Extract image details
    const img_name = currentNews.image || 'default.png'; // Fallback image name if none provided
    const thumbImage = getNewsImage(currentNews.id, img_name, '100x100'); // Thumbnail size
    const originalImage = getNewsImage(currentNews.id, img_name, null); // Original size

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <div id="kt_app_toolbar" className="app-toolbar py-lg-6">
                <div id="kt_app_toolbar_container" className="app-container container-fluid">
                    <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                        <h2>News Details</h2>
                    </div>
                </div>
            </div>
            <div id="kt_app_content" className="app-content flex-column-fluid">
                <div id="kt_app_content_container" className="app-container container-fluid">
                    <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
                        <div className="card card-flush">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div className="card-title">
                                    <h2>{currentNews.title}</h2>
                                </div>
                                <a href="/news" className="btn btn-sm btn-primary">
                                    <i className="fas fa-arrow-left"></i> Back to List
                                </a>
                            </div>
                            <div className="card-body p-9">
                                <div className="row mb-7">
                                    <div className="col-lg-8">
                                        <div className="image-input image-input-outline mt-0" data-kt-image-input="true">
                                            <div className="image-input-wrapper w-100px h-100px" style={{ backgroundImage: `url(${thumbImage})` }}></div>
                                            <a data-fancybox="gallery" href={originalImage} className="stretched-link"></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-7">
                                    <label className="col-lg-3 fw-semibold text-muted">Location</label>
                                    <div className="col-lg-3">
                                        <span className="fw-bold fs-6 text-gray-800">{currentNews.location || '--'}</span>
                                    </div>
                                </div>
                                <div className="row mb-7">
                                    <label className="col-lg-3 fw-semibold text-muted">Date</label>
                                    <div className="col-lg-3">
                                        <span className="fw-bold fs-6 text-gray-800">{currentNews.date ? formatDate(currentNews.date) : '--'}</span>
                                    </div>
                                </div>
                                <div className="row mb-7">
                                    <label className="col-lg-3 fw-semibold text-muted">Status</label>
                                    <div className="col-lg-3">
                                        {currentNews.status === 'active' ? (
                                            <span className="badge badge-light-success">Active</span>
                                        ) : (
                                            <span className="badge badge-light-danger">Inactive</span>
                                        )}
                                    </div>
                                </div>
                                <div className="row mb-12">
                                    <label className="col-lg-3 fw-semibold text-muted">Description</label>
                                    <div className="col-lg-8">
                                        <span className="fw-bold fs-6 text-gray-800">{currentNews.description || '--'}</span>
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
