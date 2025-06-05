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
  LOGIN: "/login",
  REGISTER_BUYER: "/registerBuyer",
  REGISTER_SELLER: "/registerSeller",
  ANIMALS: "/animals",
}

export const AUTH_SERVICE = {
  loginUser: async (payload) => {
    try {
      console.log(email, password)
      const response = await apiInstance.post(ENDPOINTS.LOGIN, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error Login");
    }
  },
  registerBuyer: async (payload) => {
    try {
      const response = await apiInstance.post(ENDPOINTS.REGISTER_BUYER, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error Register");
    }
  },
  registerSeller: async (payload) => {
    try {
      const response = await apiInstance.post(ENDPOINTS.REGISTER_SELLER, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error Register");
    }
  },
  listAnimal: async () => {
    try {
      const response = await apiInstance.get(ENDPOINTS.ANIMALS);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error List Animal");
    }
  }
}