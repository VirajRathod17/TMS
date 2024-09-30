import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Define the Award type
interface Award {
  id: number;
  name: string;
  year: string;
}

function Index() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch awards data
  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/awards-datatable`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Full response:', response.data);
        setAwards(response.data); // Adjust this based on the structure of your response
      } catch (error) {
        console.error('Error fetching awards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar mb-5 mt-5">
        <div id="kt_app_toolbar_container" className="app-container">
          {/* <h1>Hello</h1> */}
        </div>
      </div>
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div id="kt_app_content_container" className="app-container">
          <div className="card card-flush mb-5">
            <div className="card-body pt-6 pb-3">
              {/* Include Search Form Here */}
              {/* <SearchForm /> */}
            </div>
          </div>
          <div className="card card-flush mb-5">
            <div className="card-body pt-5">
              <div className="d-flex flex-stack mb-5">
                <div className="d-flex align-items-center position-relative my-1">
                  <h2 className="mb-0">Home</h2>
                </div>
                <div className="d-flex justify-content-end">
                  <Link to="/awards/create" className="btn btn-primary" style={{ marginLeft: '10px' }}>Add</Link>
                </div>
              </div>
              <table id="kt_datatable_example_1" className="table align-middle table-row-dashed fs-6 gy-5">
                <thead>
                  <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                    <th className="w-10px pe-2">
                      <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                        <input className="form-check-input" type="checkbox" data-kt-check="true" data-kt-check-target="#kt_datatable_example_1 .form-check-input" value="1" />
                      </div>
                    </th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Award Year</th>
                    <th className="text-end min-w-100px">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 fw-semibold">
                  {/* {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center">Loading...</td>
                    </tr>
                  ) : (
                    awards.map((award) => (
                      <tr key={award.id}>
                        <td>
                          <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                            <input className="form-check-input" type="checkbox" value={award.id} />
                          </div>
                        </td>
                        <td>{award.id}</td>
                        <td>{award.name}</td>
                        <td>{award.year}</td>
                        <td className="text-end">
                          <Link to={`/awards/edit/${award.id}`} className="btn btn-sm btn-light">Edit</Link>
                          {/* Add additional action buttons here 
                        </td>
                      </tr>
                    ))
                  )} */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
