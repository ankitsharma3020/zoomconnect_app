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
// import userdataSlice from './services/userdataSlice';
// import policydataSlice from './services/policydataSlice';
// import AdditionlistSlice from '../screens/Natural addition/AdditionlistSlice';
// import profileSlice from '../screens/Dashboard/profileSlice';
// import WellnessSlice from '../screens/Dashboard/WellnessSlice';
// import policySlice from '../screens/Dashboard/AllpolicySlice';
// import AllpolicySlice from '../screens/Dashboard/AllpolicySlice';
// import ClaimSlice from '../screens/claims/ClaimSlice';
// import nhtSlice from '../screens/Nhtconsultant/nhtSlice';
// import newUserSlice from '../navigation/newUserSlice';
// import SurveySlice from '../screens/Survey/SurveySlice';
// import SurveylistSlice from '../screens/Dashboard/SurveylistSlice';
// import EnrollSlice from '../screens/Dashboard/EnrollSlice'
// import SingleEnrollmentSlice from '../screens/Enrollment/SingleEnrollmentSlice'







  const persistConfig = {
    key: 'root',
    storage:AsyncStorage,
  }
 
  const reducer=combineReducers({
    user: userSlice,
    // userdata:userdataSlice,
    // profiledata:profileSlice,
    // policydata:policydataSlice,
    // naturallistdata:AdditionlistSlice,
    // wellnessdata:WellnessSlice,
    // allpolicydata:AllpolicySlice,
    // claimsdata:ClaimSlice,
    // nhtdata:nhtSlice,
    // newuserdata:newUserSlice,
    // questionlistdata:SurveySlice,
    // surveylistdata:SurveylistSlice,
    // enrollmentlistdata:EnrollSlice,
    // singleenrollmentdata:SingleEnrollmentSlice,
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