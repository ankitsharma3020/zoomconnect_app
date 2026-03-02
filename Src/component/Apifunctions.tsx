// Apifunctions.tsx
import axios from 'axios';
// Removed unused AsyncStorage import to prevent warnings
import { baseUrl } from '../redux/apiSlice';

// Added 'export' directly before const
export const GetApi = async (url: string, params: Record<string, any> = {}, token?: string) => {
  try {
    
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    // console.log('Full API URL:', fullUrl,token); // Debug: Log the full URL being requested
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
export const PostApi = async (url: string, body: Record<string, any> = {}, token?: string) => {
  try {
    console.log("body:", body); 
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    // console.log('Full API URL:', fullUrl, token); // Debug: Log the full URL being requested
    
    const config: any = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // In axios.post, the second argument is the data (body) 
    // and the third argument is the config (headers, etc.)
    const response = await axios.post(fullUrl, body, config);
    return response.data;
  } catch (error) {
    console.error('API error:', error); 
    throw error;
  }
};