import axios from "axios";

const instance = axios.create({
  baseURL: "https://yourapi.com",
  headers: {
    Authorization: `Bearer ${YOUR_TOKEN_HERE}`,
  },
});

// export const registerTeacher =
export default instance;