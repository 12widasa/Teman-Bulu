import { dateFormatWithTime } from '../Utils/dateFormat'
import axios from 'axios'

const token = localStorage.getItem("token");

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
  timeout: 10000,
});

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
  UPDATE_PROFILE_BUYER: "/updateProfileBuyer",
  UPDATE_PROFILE_SELLER: "/updateProfileSeller",
}

export const AUTH_SERVICE = {
  async loginUser(payload) {
    try {
      console.log(email, password)
      const response = await apiInstance.post(ENDPOINTS.LOGIN, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error Login");
    }
  },
  async registerBuyer(payload) {
    try {
      const response = await apiInstance.post(ENDPOINTS.REGISTER_BUYER, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error Register");
    }
  },
  async registerSeller(payload) {
    try {
      const response = await apiInstance.post(ENDPOINTS.REGISTER_SELLER, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error Register");
    }
  },
  async listAnimal() {
    try {
      const response = await apiInstance.get(ENDPOINTS.ANIMALS);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error List Animal");
    }
  },
  updateProfileBuyer: async (payload) => {
    try {
      const response = await apiInstance.post(ENDPOINTS.UPDATE_PROFILE_BUYER, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error Update Profile Buyer");
    }
  }
}