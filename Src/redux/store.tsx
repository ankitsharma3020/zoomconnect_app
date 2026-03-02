import {
    configureStore,
    createSlice,
    getDefaultMiddleware,
  } from '@reduxjs/toolkit';
  import {apiSlice, tokenMiddleware} from './apiSlice';
  import { persistReducer } from 'redux-persist';
  import storage from 'redux-persist/lib/storage';
  import { combineReducers } from '@reduxjs/toolkit';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import userSlice from './service/userSlice';
  import profileReducer from '../screens/Slices/ProfileSlice';
  import policyReducer from '../screens/Slices/PolicySlice';
  import wellnessReducer from '../screens/Slices/wellnessSlice';
  import ticketReducer from '../screens/Slices/ticketSlice';
  import singleChatReducer from '../screens/Slices/singleChatSlice';
  import policydetailsReducer from '../screens/Slices/PolicydetailsSlice';
  import surveyReducer from '../screens/Slices/SurveySlice';
  import hospitalstateReducer from '../screens/Slices/getStatebypidSlice';
  import DependentReducer from '../screens/Slices/getDependentList';






  const persistConfig = {
    key: 'root',
    storage:AsyncStorage,
  }
 
  const reducer=combineReducers({
    user: userSlice,
    profile:profileReducer,
    policy:policyReducer,
    wellness:wellnessReducer,
    tickets:ticketReducer,
    chat:singleChatReducer,
    policydetails:policydetailsReducer,
    surveys:surveyReducer,
    hospitalstate:hospitalstateReducer,
    dependence:DependentReducer,

     
 
  })

  const persistedReducer=persistReducer(persistConfig,reducer)


const store = configureStore({
  reducer: persistedReducer,
    


  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false,
       serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'], // Add any paths you know have non-serializable data
      },

    // {
    //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    // },
  }).concat(apiSlice.middleware),
   
  //   middleware: (getDefaultMiddleware) =>
  //     getDefaultMiddleware().concat(tokenMiddleware),
});

export default store;

// import { configureStore } from '@reduxjs/toolkit';    
// import todoReducer from './todoSlice';
// const store=configureStore({
//   reducer: {
//     todo: todoReducer,
//   },
// });
// export default store;