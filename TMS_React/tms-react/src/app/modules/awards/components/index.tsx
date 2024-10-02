import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Award {
  id: number;
  name: string;
  year: string;
  location: string;
  award_date: string;
}

function Index() {

  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAwards, setSelectedAwards] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const awardId = parseInt(value, 10);
    if (checked) {
      setSelectedAwards([...selectedAwards, awardId]);
    } else {
      setSelectedAwards(selectedAwards.filter((id) => id !== awardId));
    }
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsSelectAll(checked);
    if (checked) {
      const allAwardIds = awards.map((award) => award.id);
      setSelectedAwards(allAwardIds);
    } else {
      setSelectedAwards([]);
    }
  };

  useEffect(() => {
    const fetchAward = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get(
          process.env.REACT_APP_API_BASE_URL + '/awards',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAwards(response.data.data);
      } catch (error) {
        console.error('Error fetching Award:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAward();
  }, []);

  const deleteAward = (id: number) => {
    const token = localStorage.getItem('jwt_token');
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this Award?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(process.env.REACT_APP_API_BASE_URL + `/awards/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            Swal.fire('Deleted!', response.data.message, 'success');
            setAwards((prevAwards) => prevAwards.filter((award) => award.id !== id));
          })
          .catch((error) => {
            console.error('Error deleting Award:', error);
          });
      } else {
        Swal.fire('Cancelled', 'Award was not deleted', 'error');
      }
    });
  };

  const deleteMultiple = () => {
    if (selectedAwards.length === 0) {
      Swal.fire('No awards selected', 'Please select awards to delete.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete selected awards.`,
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
            data: { ids: selectedAwards },
          })
          .then((response) => {
            Swal.fire('Deleted!', response.data.message, 'success');
            const updatedAwards = awards.filter(
              (award) => !selectedAwards.includes(award.id)
            );
            setAwards(updatedAwards);
            setSelectedAwards([]);
            setIsSelectAll(false);
          })
          .catch((error) => {
            console.error('Error deleting awards:', error);
            Swal.fire('Error!', 'There was an error deleting the awards.', 'error');
          });
      }
    });
  };
  
  return (
    <>
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar">
        <div id="kt_app_toolbar_container" className="app-container">
          {/* <h1>Hello</h1> */}
        </div>
      </div>
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div id="kt_app_content_container" className="app-container">
          <div className="card card-flush mb-5">
            <div className="card-body pt-6">
              {/* <SearchForm /> */}
            </div>
          </div>
          <div className="card card-flush mb-5">
            <div className="card-body pt-5">
              <div className="d-flex flex-stack mb-5">
                <div className="d-flex align-items-center position-relative my-1">
                  <h2 className="mb-0">Home</h2>
                </div>
                {selectedAwards.length === 0 ? (
                    <Link to="/awards/create" className="btn btn-primary" style={{ marginLeft: '10px' }}>
                        Add
                    </Link>
                ) : (
                    <div className="d-flex justify-content-end align-items-center" data-kt-docs-table-toolbar="selected">
                        <div className="fw-bold me-5">
                            <span className="me-2">{selectedAwards.length}</span> Selected
                        </div>
                        <button type="button" className="btn btn-primary" onClick={deleteMultiple}>
                            Remove Selected
                        </button>
                    </div>
                )}
              </div>
              <table id="kt_datatable_example_1" className="table align-middle table-row-dashed fs-6 gy-5">
                <thead>
                  <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                    <th className="w-10px pe-2">
                      <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                        <input className="form-check-input" type="checkbox" data-kt-check="true" data-kt-check-target="#kt_datatable_example_1 .form-check-input" checked={isSelectAll} onChange={handleSelectAllChange}/>
                      </div>
                    </th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Award Year</th>
                    <th>Location</th>
                    <th>Award Date</th>
                    <th className="text-end min-w-100px">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 fw-semibold">
                  {(
                    awards.map((award) => (
                      <tr key={award.id}>
                        <td>
                          <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                            <input className="form-check-input" type="checkbox" value={award.id.toString()} checked={selectedAwards.includes(award.id)} onChange={handleCheckboxChange} />
                          </div>
                        </td>
                        <td>{award.id}</td>
                        <td>{award.name}</td>
                        <td>{award.year}</td>
                        <td>{award.location}</td>
                        <td>{award.award_date}</td>
                        <td className="text-end">
                          <Link to={`/awards/edit/${award.id}`} className="btn btn-sm btn-light me-2">Edit</Link>
                          <Link to="#" className="btn btn-sm btn-light" onClick={() => deleteAward(award.id)}>Delete</Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Index;
