import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Form from './form';

function Edit() {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAward = async () => {
      setLoading(true);
      const token = localStorage.getItem('jwt_token');
      const response = await axios.get(
        process.env.REACT_APP_API_BASE_URL + `/awards/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setInitialValues(response.data.data);
        setLoading(false);
      }
    };
    fetchAward();
  }, [id]);

  return (
    <div>
		{initialValues && (
			<Form
				mode="edit"
				initialValues={initialValues}
				submitUrl={process.env.REACT_APP_API_BASE_URL + `/awards/${id}`}
				redirectUrl="/awards"
				successMessage="Award has been updated successfully"
			/>
		)}
    </div>
  );
}
export default Edit;