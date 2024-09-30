import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Form from './form';
import '../../loader.css';
import Loader from '../../loader';
function Edit() {
  const { id } = useParams(); // Assuming you get the ID from the URL
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {

    // Fetch existing data for the item to be edited
    const fetchAwardCategory = async () => {
      setLoading(true);
      const token = localStorage.getItem('jwt_token');
      const response = await axios.get(
        process.env.REACT_APP_API_BASE_URL + `award-category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setInitialValues(response.data.data); // Set the fetched data as initial values
        setLoading(false);
      }
    };
    fetchAwardCategory();
  }, [id]);

  return (
    <div>
      {initialValues ? (
        <Form
          mode="edit"
          initialValues={initialValues}
          submitUrl={process.env.REACT_APP_API_BASE_URL + `award-category/${id}`}
          redirectUrl="/award_category"
          successMessage="Award Category has been updated successfully"
        />
      ) : (
       loading &&  <Loader />
      )}
    </div>
  );
}
export default Edit;
