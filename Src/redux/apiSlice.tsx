import AsyncStorage from '@react-native-async-storage/async-storage';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';


// 
// export const DOMAIN_URI='https://www.zoomconnect.co.in'
export const DOMAIN_URI='https://portal.zoomconnect.co.in'

 
// export const DOMAIN_URI='https://uat.zoomconnect.co.in'
// export const BASE_URL=`${DOMAIN_URL}/api/item`
//testing server
//  export const baseUrl = 'http://52.6.9.150:8000/api/v1';
export const baseUrl = `${DOMAIN_URI}/api/v1`;

//live url
// export const baseUrl = Config.API_HOST_USER;
//for local
//  export const baseUrl = 'http://192.168.43.98:8000/api/v1';

export const tokenMiddleware = storeAPI => next => action => {
  //   const state = storeAPI.getState();
  //get token from cookies

//   const token =null
//   token = JSON.parse(token);
//   console.log(token, 'token');
//   if (token) {
//     action.headers = {
//       ...action.headers,
//       Authorization: `Bearer ${token}`,
//     };
//   }

  return next(action);
};
const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  // 1. Make this function async
  prepareHeaders: async (headers, {getState}) => {
    try {
      // 2. Get the token from AsyncStorage (Change 'userToken' to your actual storage key)
      const token = await AsyncStorage.getItem('token');
      
      // OR: If you store token in Redux state, use this instead:
      // const token = getState().auth.token;

      // 3. If token exists, set the Authorization header
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (error) {
      console.error('Error retrieving token', error);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  //   reducerPath: "api",
  baseQuery: baseQuery,
  endpoints: builder => ({
    // ... Define your endpoints here ...
  }),
  // middleware: getDefaultMiddleware =>
  //   getDefaultMiddleware().concat(tokenMiddleware),
});