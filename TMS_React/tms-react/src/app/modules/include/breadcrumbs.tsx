import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  breadcrumbs: { label: string; url?: string }[];
}

function Breadcrumb({ breadcrumbs }: BreadcrumbProps) {
  return (
    <div id="kt_app_toolbar_container" className="app-container">
      <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
        <li className="breadcrumb-item text-muted">
          <Link to="/dashboard" className="text-muted text-hover-primary">
            Dashboard
          </Link>
        </li>

        {/* Conditional bullet separator */}
        {!window.location.pathname.includes('/dashboard') && (
          <li className="breadcrumb-item">
            <span className="bullet bg-gray-400 w-5px h-2px"></span>
          </li>
        )}

        {/* Loop through the breadcrumb data */}
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            {breadcrumb.url ? (
              <li className="breadcrumb-item text-muted">
                <Link to={breadcrumb.url} className="text-muted text-hover-primary">
                  {breadcrumb.label}
                </Link>
              </li>
            ) : (
              <li className="breadcrumb-item text-muted">{breadcrumb.label}</li>
            )}

            {/* Only show separator if it's not the last item */}
            {index < breadcrumbs.length - 1 && (
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

export default Breadcrumb;
