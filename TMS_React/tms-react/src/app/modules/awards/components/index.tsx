// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { Helmet } from 'react-helmet';
// import Loader from '../../include/loader';
// import '../../include/loader.css';
// import DataTable from 'react-data-table-component';
// import Breadcrumb from '../../include/breadcrumbs';
// import Pagination from '../../include/pagination';
// import SearchForm from './searchform';
// import useFetchAwards from './fetchAwards';


// interface Award {
//   id: number;
//   name: string;
//   year: string;
//   // created_at: string;
// }

// const Index: React.FC = () => {
//   const { awards, loading, setAwards, setLoading } = useFetchAwards();
//   const [selectedAwards, setSelectedAwards] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState(false);
//   const [filteredAwardCategories, setFilteredAwardCategories] = useState<Award[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchName, setSearchName] = useState<string>('');
//   const [searchYear, setSearchYear] = useState<string>('');
//   const [fromDate, setFromDate] = useState<string>('');
//   const [toDate, setToDate] = useState<string>('');
//   const pageTitle = 'Manage Award';
//   const module = 'awards';
//   const moduleTitle = 'Award';

//   useEffect(() => {
//     document.title = pageTitle;
//   }, [pageTitle]);


//   useEffect(() => {
//     const filterData = () => {
//       const filtered = awards.filter((award) => {
//         const matchesName = award.name.toLowerCase().includes(searchName.toLowerCase());
//         const matchesYear = award.year.toLowerCase().includes(searchYear.toLowerCase());
//         const matchesDateRange = (!fromDate || new Date(award.created_at) >= new Date(fromDate)) &&
//                                  (!toDate || new Date(award.created_at) <= new Date(toDate));
  
//         return matchesName && matchesYear && matchesDateRange;
//       });
  
//       setFilteredAwardCategories(filtered);
//     };
  
//     filterData();
//   }, [searchName, searchYear, fromDate, toDate, awards]);

//   const paginatedData = filteredAwardCategories.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const totalPages = Math.ceil(filteredAwardCategories.length / itemsPerPage);

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value, checked } = e.target;
//     const awardId = parseInt(value, 10);
//     if (checked) {
//       setSelectedAwards([...selectedAwards, awardId]);
//     } else {
//       setSelectedAwards(selectedAwards.filter((id) => id !== awardId));
//     }
//   };

//   const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const checked = e.target.checked;
//     setIsSelectAll(checked);
//     if (checked) {
//       const allAwardIds = awards.map((award) => award.id);
//       setSelectedAwards(allAwardIds);
//     } else {
//       setSelectedAwards([]);
//     }
//   };

//   const formatDate = (dateString: string): string => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = String(date.getFullYear()).slice(-2);
  
//     return `${day}-${month}-${year}`;
//   };

//   useEffect(() => {
//     setTotalPages(Math.ceil(awards.length / itemsPerPage));
//     setCurrentPage(1);
//   }, [awards, itemsPerPage]);

//   const currentAwards = awards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleItemsPerPageChange = (items: number) => {
//     setItemsPerPage(items);
//     setCurrentPage(1);
//   };

//   const handleSearch = ({ name, year, from_date, to_date }: { name: string; year: string; from_date: string; to_date: string }) => {
//     setSearchName(name);
//     setSearchYear(year);
//     setFromDate(from_date);
//     setToDate(to_date);
//   };

//   const handleReset = () => {
//     setSearchName('');
//     setSearchYear('');
//     setFromDate('');
//     setToDate('');
//   };

//   const deleteAward = (id: number) => {
//     const token = localStorage.getItem('jwt_token');
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "Do you really want to delete this Award?",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'No, cancel!',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         axios
//           .delete(`${process.env.REACT_APP_API_BASE_URL}awards/${id}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           })
//           .then((response) => {
//             Swal.fire('Deleted!', response.data.message, 'success');
//             setAwards((prevAwards) => prevAwards.filter((award) => award.id !== id));
//           })
//           .catch((error) => {
//             console.error('Error deleting Award:', error);
//           });
//       } else {
//         Swal.fire('Cancelled', 'Award was not deleted', 'error');
//       }
//     });
//   };

//   const deleteMultiple = () => {
//     if (selectedAwards.length === 0) {
//       Swal.fire('No awards selected', 'Please select awards to delete.', 'warning');
//       return;
//     }

//     Swal.fire({
//       title: 'Are you sure?',
//       text: `You are about to delete selected awards.`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete them!',
//       cancelButtonText: 'No, cancel!',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const token = localStorage.getItem('jwt_token');
//         axios
//           .delete(`${process.env.REACT_APP_API_BASE_URL}/awards-delete-multiple`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             data: { ids: selectedAwards },
//           })
//           .then((response) => {
//             Swal.fire('Deleted!', response.data.message, 'success');
//             const updatedAwards = awards.filter(
//               (award) => !selectedAwards.includes(award.id)
//             );
//             setAwards(updatedAwards);
//             setSelectedAwards([]);
//             setIsSelectAll(false);
//           })
//           .catch((error) => {
//             console.error('Error deleting awards:', error);
//             Swal.fire('Error!', 'There was an error deleting the awards.', 'error');
//           });
//       }
//     });
//   };

//   const breadcrumbs = [{ label: 'Manage Award', url: '' }];

//   const columns = [
//     {
//       name: <input className="form-check-input" type="checkbox" checked={isSelectAll} onChange={handleSelectAllChange} />,
//       cell: (row: any) => (
//         <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
//           <input
//             className="form-check-input"
//             type="checkbox"
//             value={row.id.toString()}
//             checked={selectedAwards.includes(row.id)}
//             onChange={handleCheckboxChange}
//           />
//         </div>
//       ),
//       sortable: false,
//       ignoreRowClick: true,
//       allowOverflow: true,
//       button: false,
//       width: '80px',
//     },
//     {
//       name: 'ID',
//       selector: (row: any) => row.id,
//       sortable: true,
//       width: '80px',
//     },
//     {
//       name: 'Award Date',
//       selector: (row: any) => formatDate(row.created_at),
//       sortable: true,
//       width: '150px',
//     },
//     {
//       name: 'Name',
//       selector: (row: any) => row.name,
//       sortable: true,
//       width: '200px',
//     },
//     {
//       name: 'Award Year',
//       selector: (row: any) => row.year,
//       sortable: true,
//       width: '200px',
//     },
//     {
//       name: 'Action',
//       cell: (row: any) => (
//         <>
//           <Link to={`/awards/edit/${row.id}`} className="btn-primary btn btn-sm btn-icon btn-light me-2">
//             <i className="fas fa-edit"></i>
//           </Link>
//           <button onClick={() => deleteAward(row.id)} className="btn-danger btn btn-sm btn-icon btn-light">
//             <i className="fas fa-trash"></i>
//           </button>
//         </>
//       ),
//       style: {
//         display: 'flex',
//         justifyContent: 'flex-end',
//       },
//     },
//   ];

//   const customStyles = {
//     rows: {
//       style: {
//         minHeight: '72px',
//         borderBottom: '#dee2e6',
//       },
//     },
//     headCells: {
//       style: {
//         paddingLeft: '16px',
//         paddingRight: '16px',
//         fontWeight: 'bold',
//         fontSize: '1rem',
//         color: '#495057',
//       },
//     },
//     cells: {
//       style: {
//         paddingLeft: '16px',
//         paddingRight: '16px',
//         fontSize: '0.875rem',
//         color: '#212529',
//       },
//     },
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <>
//       <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
//         <Helmet>
//           <title>{pageTitle ? pageTitle : ''}</title>
//         </Helmet>
//         <div className="d-flex flex-column flex-column-fluid">
//           <div id="kt_app_toolbar" className="app-toolbar mb-5">
//             <Breadcrumb breadcrumbs={breadcrumbs} />
//           </div>
//           <div id="kt_app_content" className="app-content flex-column-fluid">
//             <div id="kt_app_content_container" className="app-container">
//               <div className="card card-flush mb-5">
//                 <div className="card-body pt-6 pb-3">
//                   {/* <SearchForm module={module} moduleTitle={moduleTitle} /> */}
//                  <SearchForm 
//                     module={module} 
//                     moduleTitle={moduleTitle} 
//                     onSearch={handleSearch} 
//                     onReset={handleReset} 
//                   /> 
//                 </div>
//               </div>
//               <div className="card card-flush mb-5">
//                 <div className="card-body pt-5">
//                   <div className="d-flex justify-content-between align-items-center mb-5">
//                     <h2 className="mb-0">{pageTitle}</h2>
//                     {selectedAwards.length === 0 ? (
//                       <Link to="/awards/create" className="btn btn-primary">
//                         Add
//                       </Link>
//                     ) : (
//                       <div className="d-flex justify-content-end align-items-center">
//                         <div className="fw-bold me-5">
//                           <span className="me-2">{selectedAwards.length}</span> Selected
//                         </div>
//                         <button type="button" className="btn btn-primary" onClick={deleteMultiple}>
//                           Remove Selected
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                   {loading ? (
//                     <p>Loading...</p>
//                   ) : (
//                     <>
//                       <DataTable
//                         columns={columns}
//                         data={currentAwards}
//                         customStyles={customStyles}
//                         pagination={false}
//                         noDataComponent="No awards found"
//                         defaultSortFieldId="id"
//                         defaultSortAsc={false}
//                       />
//                       <Pagination
//                         currentPage={currentPage}
//                         totalPages={totalPages}
//                         onPageChange={handlePageChange}
//                         itemsPerPage={itemsPerPage}
//                         onItemsPerPageChange={handleItemsPerPageChange}
//                       />
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Index;










