

import axios from 'axios';

// Define the type of data expected from the API (this can be extended)
interface Judges {
    id: number;
    date: string;
    name: string;
    award_id: number;
    status: string; 
    post: string;
}

// Helper function to fetch judges
const fetchJudges = async (): Promise<Judges[]> => {
    const token = localStorage.getItem('jwt_token');
    
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}judges`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching judges:', error);
        throw error; // Propagate the error to be handled by the caller
    }
};

export default fetchJudges;
