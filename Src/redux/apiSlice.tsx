import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios'; // We need axios here to make the initial call

// 1. Export your variables as undefined
export let DOMAIN_URI; 
export let baseUrl;    

// 2. ⚡️ THE SINGLETON PROMISE ⚡️
// This ensures we only hit the 'get-url' endpoint EXACTLY ONCE when the app opens.
let configPromise = null;

export const fetchDynamicUrl = async () => {
  // If we already fetched it (or are currently fetching it), don't do it again.
  if (configPromise) return configPromise;

  configPromise = axios.post('https://uat.zoomconnect.co.in/api/get-url')
    .then(response => {
      if (response.data?.data?.url) {
        DOMAIN_URI = response.data.data.url;
        baseUrl = `${DOMAIN_URI}api/v1`;
        console.log('✅ Fetched and locked in DOMAIN_URI:', DOMAIN_URI);
        return DOMAIN_URI;
      }
      throw new Error("URL missing from response");
    })
    .catch(error => {
      console.error('🚨 Failed to fetch dynamic URL:', error);
      configPromise = null; // Reset so we can try again if it fails
      throw error;
    });

  return configPromise;
};
console.log('Module loaded, DOMAIN_URI is still undefined:', DOMAIN_URI);

// 3. Raw Base Query (Standard setup)
const rawBaseQuery = fetchBaseQuery({
  baseUrl: '', 
  prepareHeaders: async (headers) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
    } catch (error) {
      console.error('Error retrieving token', error);
    }
    return headers;
  },
});

// 4. The Interceptor: Redux will wait for the URL to be fetched before firing
const dynamicBaseQuery = async (args, api, extraOptions) => {
  try {
    await fetchDynamicUrl();
    if (!DOMAIN_URI) return { error: { status: 'CUSTOM_ERROR', error: 'Base URL missing' } }; 

    const endpoint = typeof args === 'string' ? args : args.url;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const fullUrl = `${baseUrl}${cleanEndpoint}`;
    const modifiedArgs = typeof args === 'string' ? fullUrl : { ...args, url: fullUrl };

    // 🛑 ADD THIS LOG HERE:
    console.log("🚀 REDUX IS FIRING! Exact URL:", modifiedArgs.url || modifiedArgs);

    return rawBaseQuery(modifiedArgs, api, extraOptions);
  } catch (error) {
    return rawBaseQuery(args, api, extraOptions);
  }
};

// 5. Export API Slice
export const apiSlice = createApi({
  baseQuery: dynamicBaseQuery,
  endpoints: builder => ({}),
});