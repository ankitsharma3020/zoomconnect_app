// Apifunctions.tsx
import axios from 'axios';
// Removed unused AsyncStorage import to prevent warnings
import { baseUrl } from '../redux/apiSlice';

// Added 'export' directly before const
export const GetApi = async (url: string, params: Record<string, any> = {}, token?: string) => {
  try {
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    
    const config: any = {
      headers: {
        'Content-Type': 'application/json',
      },
      params,
    };

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.get(fullUrl, config);
    return response.data;
  } catch (error) {
    // Better to log the specific message for debugging
    console.error('API error:', error); 
    throw error;
  }
};