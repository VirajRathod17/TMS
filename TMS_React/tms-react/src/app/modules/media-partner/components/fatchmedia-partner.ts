import { useEffect, useState } from 'react';
import axios from 'axios';


interface MediaPartner {
  id: number;
  name: string; // This field is kept as 'name'
  image: string; // Changed from 'image' to 'image'
  award_id: number; // Changed from 'award_id' to 'awardId'
  status: string;
  date: string;
}


const useFetchMediaPartner = () => {
    const [mediapartner, setMediapartner] = useState<MediaPartner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMediaPartners = async () => {
            try {
                const token = localStorage.getItem('jwt_token');
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}media-partner`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMediapartner(response.data);
            } catch (error) {
                console.error('Error fetching media partners:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMediaPartners();
    }, []);

    return [mediapartner, setMediapartner, loading, setLoading] as const; // Use as const for a tuple return type
};

export default useFetchMediaPartner;
