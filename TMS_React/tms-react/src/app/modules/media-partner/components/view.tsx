import React, { useEffect, useState } from 'react';
import useFetchMediaPartners from './fatchmedia-partner';
import Loader from '../../include/loader';
import '../../include/loader.css';

interface MediaPartner {
    id: number;
    name: string;
    website_link?: string;  // Mark as optional
    image?: string;         // Mark as optional
    award_id?: number;      // Mark as optional
    description?: string;    // Mark as optional
    status: string;
    date: string;
}

const getMediaPartnerImage = (id: number, img_name: string, size: string | null) => {
    if (id > 0 && img_name) {
        // Construct the image path based on size
        return size
            ? `${process.env.REACT_APP_API_URL}/storage/media_partners/${id}/thumb_${size}_${img_name}`
            : `${process.env.REACT_APP_API_URL}/storage/media_partners/${id}/${img_name}`;
    }
    // Fallback to a default image if no valid image is provided
    return `${process.env.REACT_APP_API_URL}/storage/Admin/uploads/noimg.png`;
};

const View: React.FC = () => {
    const { mediaPartners, loading } = useFetchMediaPartners();
    const [currentPartner, setCurrentPartner] = useState<MediaPartner | null>(null);

    useEffect(() => {
        if (mediaPartners.length > 0) {
            // Set the first media partner as the default selected partner
            setCurrentPartner(mediaPartners[0]);
        }
    }, [mediaPartners]);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getFullYear()).slice(-2)}`;
    };

    if (loading) {
        return <Loader />;
    }

    if (!currentPartner) {
        return <div>No media partner found.</div>;
    }

    // Extract image details
    const img_name = currentPartner.image || 'default.png'; // Fallback image name if none provided
    const thumbImage = getMediaPartnerImage(currentPartner.id, img_name, '100x100'); // Thumbnail size
    const originalImage = getMediaPartnerImage(currentPartner.id, img_name, null); // Original size

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <div id="kt_app_toolbar" className="app-toolbar py-lg-6">
                <div id="kt_app_toolbar_container" className="app-container container-fluid">
                    <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                        <h2>Media Partner Details</h2>
                    </div>
                </div>
            </div>
            <div id="kt_app_content" className="app-content flex-column-fluid">
                <div id="kt_app_content_container" className="app-container container-fluid">
                    <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
                        <div className="card card-flush">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div className="card-title">
                                    <h2>{currentPartner.name}</h2>
                                </div>
                                <a href="/media-partner" className="btn btn-sm btn-primary">
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
                                    <label className="col-lg-3 fw-semibold text-muted">Website</label>
                                    <div className="col-lg-3">
                                        <a href={currentPartner.website_link} target="_blank" rel="noopener noreferrer">
                                            <span className="fw-bold fs-6 text-gray-800">{currentPartner.website_link || '--'}</span>
                                        </a>
                                    </div>
                                </div>
                                <div className="row mb-7">
                                    <label className="col-lg-3 fw-semibold text-muted">Status</label>
                                    <div className="col-lg-3">
                                        {currentPartner.status === '1' ? (
                                            <span className="badge badge-light-success">Active</span>
                                        ) : (
                                            <span className="badge badge-light-danger">Inactive</span>
                                        )}
                                    </div>
                                </div>
                                <div className="row mb-7">
                                    <label className="col-lg-3 fw-semibold text-muted">Award Name</label>
                                    <div className="col-lg-3">
                                        <span className="fw-bold fs-6 text-gray-800">{currentPartner.award_id || '--'}</span>
                                    </div>
                                </div>
                                <div className="row mb-12">
                                    <label className="col-lg-3 fw-semibold text-muted">Description</label>
                                    <div className="col-lg-8">
                                        <span className="fw-bold fs-6 text-gray-800">{currentPartner.description || '--'}</span>
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

export default View;
