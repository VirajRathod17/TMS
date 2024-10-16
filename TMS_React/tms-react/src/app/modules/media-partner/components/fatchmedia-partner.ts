
import { useState, useEffect } from 'react';
import axios from 'axios';

export interface MediaPartner {
    id: number;
    name: string;
    image: string;
    award_id: number;
    status: string;
    date: string;
  }

const useFetchMediaPartners = () => {
  const [mediaPartners, setMediaPartners] = useState<MediaPartner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchmediaPartners = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get(
          process.env.REACT_APP_API_BASE_URL + 'media-partner',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMediaPartners(response.data.data);
      } catch (error) {
        console.error('Error fetching Media-Partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchmediaPartners();
  }, []);

  return { mediaPartners, loading, setMediaPartners, setLoading };
};

export default useFetchMediaPartners;
