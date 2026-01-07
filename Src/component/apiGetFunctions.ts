import { getApi } from '../component/Apifunctions';

// Example endpoints (replace with your actual endpoints)
const PROFILE_URL = 'https://portal.zoomconnect.co.in/api/v1/profile';
const POLICY_URL = 'https://portal.zoomconnect.co.in/api/v1/employee-policies';
const WELLNESS_URL = 'https://portal.zoomconnect.co.in/api/v1/wellness-services';

export async function getProfile(token) {
  return getApi(PROFILE_URL, {}, token);
}

export async function getPolicyData(token) {
  return getApi(POLICY_URL, {}, token);
}

export async function getWellnessServices(token) {
  return getApi(WELLNESS_URL, {}, token);
}

export async function getAllData(token) {
  return Promise.all([
    getProfile(token),
    getPolicyData(token),
    getWellnessServices(token)
  ]).then(([profile, policy, wellness]) => ({
    profile,
    policy,
    wellness
  }));
}
