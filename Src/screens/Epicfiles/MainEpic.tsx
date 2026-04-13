import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../redux/apiSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetApi, PostApi } from '../../component/Apifunctions';

// --- 1. THE THUNK (Async Action) ---
// This function handles the "GET" request
export const fetchPolicies = createAsyncThunk(
  'policy/fetchPolicies', // Action name
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const endpoint = '/employee-policies'; 

      // 2. FIXED: GetApi expects (url, params, token). 
      // We must pass an empty object {} as the second argument.
      const response = await GetApi(endpoint, {}, token);

      // 3. REQUESTED: Console log the response
      // console.log('Profile API Response:', JSON.stringify(response, null, 2));

      return response;
    } catch (error) {
      console.log('Profile API Error:', error);
      
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  }
);
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  // 1. FIXED: The first argument is the payload (unused here, so '_'), 
  // the second argument is the thunkAPI object containing rejectWithValue.
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const endpoint = '/profile'; 

      // 2. FIXED: GetApi expects (url, params, token). 
      // We must pass an empty object {} as the second argument.
      const response = await GetApi(endpoint, {}, token);

      // 3. REQUESTED: Console log the response
      console.log('Profile API Response:', JSON.stringify(response, null, 2));

      return response;
    } catch (error) {
      console.log('Profile API Error:', error);
      
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  }
);


export const fetchtickets=createAsyncThunk(
  'ticket/fetchtickets',
  // 1. FIXED: The first argument is the payload (unused here, so '_'), 
  // the second argument is the thunkAPI object containing rejectWithValue.
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const endpoint = '/support/tickets'; 

      // 2. FIXED: GetApi expects (url, params, token). 
      // We must pass an empty object {} as the second argument.
      const response = await GetApi(endpoint, {}, token);

      // 3. REQUESTED: Console log the response


      return response?.data?.tickets;
    } catch (error) {
      console.log('Profile API Error:', error);
      
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  }
);
export const fetchWellness=createAsyncThunk(
  'wellness/fetchWellness',
  // 1. FIXED: The first argument is the payload (unused here, so '_'), 
  // the second argument is the thunkAPI object containing rejectWithValue.
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const endpoint = '/wellness-services'; 

      // 2. FIXED: GetApi expects (url, params, token). 
      // We must pass an empty object {} as the second argument.
      const response = await GetApi(endpoint, {}, token);

      // 3. REQUESTED: Console log the response


      return response?.data?.services;
    } catch (error) {
      console.log('Profile API Error:', error);
      
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  }
);
export const fetchTicketChat = createAsyncThunk(
  'chat/fetchTicketChat',
  async ({ ticketId }, { rejectWithValue }) => {
    try {
       const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      console.log("Fetching chat for Ticket ID:", ticketId);
      // 1. Construct the relative URL
      // BaseURL is .../api/v1, so we just need the rest
      const endpoint = `/support/tickets/${ticketId}`;

      // 2. Call your custom GetApi function
      // Signature: GetApi(url, params, token)
      const response = await GetApi(endpoint, {}, token);
           
       console.log('fetchTicketChat API Response:', JSON.stringify(response, null, 2));
      // 3. Return response (this becomes action.payload in fulfilled case)
      return response.data;
    } catch (error) {
      // Handle errors safely
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch chat';
      return rejectWithValue(errorMessage);
    }
  }
);



export const fetchPolicydetails=createAsyncThunk(
  'policydetails/fetchPolicydetails',
  async ({ PolicyId }, { rejectWithValue }) => {
    try {
       const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      // 1. Construct the relative URL
      // BaseURL is .../api/v1, so we just need the rest
      const endpoint = `/policy-details/${PolicyId}`;

      // 2. Call your custom GetApi function
      // Signature: GetApi(url, params, token)
      const response = await GetApi(endpoint, {}, token);
           
             
      // 3. Return response (this becomes action.payload in fulfilled case)
      return response.data;
    } catch (error) {
      // Handle errors safely
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch chat';
      return rejectWithValue(errorMessage);
    }
  }
);
export const fetchSurveys=createAsyncThunk(
  'surveys/fetchSurveys',
  // 1. FIXED: The first argument is the payload (unused here, so '_'), 
  // the second argument is the thunkAPI object containing rejectWithValue.
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const endpoint = '/surveys/assigned'; 

      // 2. FIXED: GetApi expects (url, params, token). 
      // We must pass an empty object {} as the second argument.
      const response = await GetApi(endpoint, {}, token);
        // console.log('surveys API Response:', JSON.stringify(response, null, 2));

      // 3. REQUESTED: Console log the response


      return response?.data;
    } catch (error) {
      console.log('Profile API Error:', error);
      
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  }
);
export const fetchhospitalstate=createAsyncThunk(
  'hospitalstate/fetchhospitalstate',
  // 1. FIXED: The first argument is the payload (unused here, so '_'), 
  // the second argument is the thunkAPI object containing rejectWithValue.
   async ({ PolicyId }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const endpoint =`/network-hospitals/search-options/${PolicyId}` ; 

      // 2. FIXED: GetApi expects (url, params, token). 
      // We must pass an empty object {} as the second argument.
      const response = await GetApi(endpoint, {}, token);
        // console.log('HospitalstareAPI Response:', JSON.stringify(response, null, 2));

      // 3. REQUESTED: Console log the response


      return response;
    } catch (error) {
      console.log('Profile API Error:', error);
      
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  }
);
export const fetchDependence=createAsyncThunk(
  'dependence/fetchDependence',
  // 1. FIXED: The first argument is the payload (unused here, so '_'), 
  // the second argument is the thunkAPI object containing rejectWithValue.
   async ({ policyid }, { rejectWithValue })=>{
    const token = await AsyncStorage.getItem('token');
    console.log("Fetching Dependence for Policy ID:", policyid,token);
    try {
      
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const endpoint =`/natural-addition/list` ; 

      // 2. FIXED: GetApi expects (url, params, token). 
      // We must pass an empty object {} as the second argument.
      const response = await PostApi(endpoint, {policy_id:policyid}, token);
        console.log('DependenceAPI Response:', JSON.stringify(response, null, 2));

      // 3. REQUESTED: Console log the response


      return response.data.data
;
    } catch (error) {
      console.log('Profile API Error:', error);
      
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  }
);
