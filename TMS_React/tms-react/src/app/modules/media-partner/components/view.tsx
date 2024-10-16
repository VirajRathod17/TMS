import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams
import useFetchMediaPartners from './fatchmedia-partner';
import Loader from '../../include/loader';
import '../../include/loader.css';

interface MediaPartner {
    id: number;
    name: string;
    website_link?: string;  // Optional fields
    image?: string;
    award_id?: number;
    description?: string;
    status: string;
    date: string;
}

const getMediaPartnerImage = (id: number, img_name: string, size: string | null) => {
    if (img_name.startsWith('http://') || img_name.startsWith('https://')) {
        return img_name;
    }
    if (id > 0 && img_name) {
        return size
            ? `${process.env.REACT_APP_API_URL}/storage/media_partners/${id}/thumb_${size}_${img_name}`
            : `${process.env.REACT_APP_API_URL}/storage/media_partners/${id}/${img_name}`;
    }
    return `${process.env.REACT_APP_API_URL}/storage/Admin/uploads/noimg.png`;
};

const stripHtmlTags = (text: string) => {
    return text.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
  };

const View: React.FC = () => {
    const { id } = useParams<{ id: string }>();  // Capture the id from the URL
    const { mediaPartners, loading } = useFetchMediaPartners();
    const [currentPartner, setCurrentPartner] = useState<MediaPartner | null>(null);

    useEffect(() => {
        if (mediaPartners.length > 0 && id) {
            // Find the media partner by id
            const partner = mediaPartners.find((partner) => partner.id === parseInt(id, 10));
            setCurrentPartner(partner || null);  // Set the correct partner or null if not found
        }
    }, [mediaPartners, id]);

    if (loading) {
        return <Loader />;
    }

    if (!currentPartner) {
        return <div>No media partner found.</div>;
    }

    const img_name = currentPartner.image || 'default.png';
    const originalImage = getMediaPartnerImage(currentPartner.id, img_name, null);

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
                                        <a href={originalImage} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={originalImage}
                                                alt={currentPartner.name}
                                                className="img-fluid"
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />

                                        </a>
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
                                        <span className="fw-bold fs-6 text-gray-800">    {currentPartner.description ? currentPartner.description.replace(/<[^>]+>/g, '') : '--'}</span>
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
