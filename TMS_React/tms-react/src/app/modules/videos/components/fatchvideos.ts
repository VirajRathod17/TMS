import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Videos {
  id: number;
  award_id: number; 
  sponsored_id: number; 
  image: string; 
  title: string;
  link: string; 
}

const useFetchVideos = () => {
  const [videos, setVideos] = useState<Videos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchvideos = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}videos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Assuming the API response structure is correct, map the response data to include new fields
        setVideos(response.data.data.map((item: any) => ({
          id: item.id,
          award_id: item.award_id,
          sponsored_id: item.sponsored_id, 
          image: item.image, 
          title: item.title, 
          link: item.link,
        })));
      } catch (error) {
        console.error('Error fetching Videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchvideos();
  }, []);

  return { videos, loading, setVideos, setLoading };
};

export default useFetchVideos;
