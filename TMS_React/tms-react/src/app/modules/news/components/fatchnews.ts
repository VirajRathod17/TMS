
import { useState, useEffect } from 'react';
import axios from 'axios';

export interface News {
    id: number;
    title: string;
    image: string;
    location: number;
    status: string;
    date: string;
  }



const useFetchNews = () => {
  const [news, setnews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchnews = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get(
          process.env.REACT_APP_API_BASE_URL + 'news',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setnews(response.data.data);
      } catch (error) {
        console.error('Error fetching Newss:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchnews();
  }, []);

  return { news, loading, setnews, setLoading };
};

export default useFetchNews;
