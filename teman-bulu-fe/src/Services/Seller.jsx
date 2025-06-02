import { dateFormatWithTime } from '../Utils/dateFormat'
import axios from 'axios'

const apiToken = localStorage.getItem("token");

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${apiToken}`,
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
  SELLER_ORDERS: "/sellerOrders",
  UPDATE_STATUS: "/updateStatus",
  CHANGE_STATUS: "/changeStatus",
  GET_PROFILE: "/getProfile",
  UPDATE_PROFILE_SELLER: "/updateProfileSeller",
}

export const SELLER_SERVICE = {
  sellerOrders: async () => {
    try {
      const response = await apiInstance.get(ENDPOINTS.SELLER_ORDERS);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error to get seller orders");
    }
  },
  updateStatus: async (payload) => {
    try {
      const response = await apiInstance.put(ENDPOINTS.UPDATE_STATUS, payload)
      return response.data
    } catch (error) {
      handleApiError(error, "Error to update status");
    }
  },
  changeStatus: async (payload) => {
    try {
      const response = await apiInstance.put(ENDPOINTS.CHANGE_STATUS, payload)
      return response.data
    } catch (error) {
      handleApiError(error, "Error to update status");
    }
  },
  getProfile: async () => {
    try {
      const response = await apiInstance.get(ENDPOINTS.GET_PROFILE)
      return response.data
    } catch (error) {
      handleApiError(error, "Error to get profile");
    }
  },
  updateProfileSeller: async (payload) => {
    try {
      const response = await apiInstance.put(ENDPOINTS.UPDATE_PROFILE_SELLER, payload)
      return response.data
    } catch (error) {
      handleApiError(error, "Error to get profile");
    }
  }
}