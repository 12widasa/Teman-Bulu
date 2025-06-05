import { dateFormatWithTime } from '../Utils/dateFormat'
import axios from 'axios'

// const token = localStorage.getItem("token");

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Authorization: `Bearer ${token}`,
  },
  timeout: 10000,
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const handleApiError = (error, customMessage = "API Error") => {
  const errorDetails = {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    timestamp: dateFormatWithTime(),
  };
  console.error(`${customMessage}:`, errorDetails);
  throw error;
};

apiInstance.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => Promise.reject(error)
);

const ENDPOINTS = {
  GET_USER: "/users",
  VERIFY_USER: "/verify",
  DECLINE_USER: "/decline"
}

export const ADMIN_DATA_SERVICE = {
  async getUser(payload) {
    try {
      const response = await apiInstance.get(ENDPOINTS.GET_USER, { params: payload });
      return response.data;
    } catch (error) {
      handleApiError(error, "Error Login");
    }
  },
  verifyUser: async (payload) => {
    try {
      const response = await apiInstance.post(ENDPOINTS.VERIFY_USER, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error Login");
    }
  },
  declineUser: async (payload) => {
    try {
      const response = await apiInstance.post(ENDPOINTS.DECLINE_USER, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error Login");
    }
  }
}