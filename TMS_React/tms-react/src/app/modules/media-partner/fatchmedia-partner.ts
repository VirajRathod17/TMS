
import { useState, useEffect } from 'react';
import axios from 'axios';

interface MediaPartner {
    id: number;
    name: string; // This field is kept as 'name'
    image: string; // Changed from 'image' to 'image'
    award_id: number; // Changed from 'award_id' to 'awardId'
    status: string;
    date: string;
    awardYear: string; // Changed from 'award_year' to 'awardYear'
}

const usefetchmediapartner = () => {
    const [mediapartner, setmediapartner] = useState<MediaPartner[]>([]);

  const [MediaPartner, setMediaPartner] = useState<MediaPartner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchmediapartner = async () => {
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
        setMediaPartner(response.data.data);
      } catch (error) {
        console.error('Error fetching Media-Partner:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchmediapartner();
  }, []);

  return { MediaPartner, loading, setMediaPartner, setLoading };
};

export default usefetchmediapartner;