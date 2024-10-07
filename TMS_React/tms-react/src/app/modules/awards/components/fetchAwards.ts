
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Award {
  id: number;
  name: string;
  year: string;
  location: string;
  award_date: string;
}

const useFetchAwards = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAward = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get(
          process.env.REACT_APP_API_BASE_URL + 'awards',
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

  return { awards, loading, setAwards, setLoading };
};

export default useFetchAwards;