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
  SELLER_SERVICES: "/sellerServices",
  SELLER: "/seller",
  ORDER: "/order",
  BUYER_ORDERS: "/buyerOrders",
  PAY_ORDER: "/payOrder",
  RATE_ORDER: "/rateOrder",
}

export const BUYER_SERVICE = {
  sellerServices: async (payload) => {
    try {
      const response = await apiInstance.get(ENDPOINTS.SELLER_SERVICES, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error get Seller Services");
    }
  },
  seller: async (payload) => {
    try {
      const response = await apiInstance.get(`${ENDPOINTS.SELLER}/${payload}`);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error get Seller Services");
    }
  },
  filterServices: async (payload) => {
    try {
      const response = await apiInstance.get(`${ENDPOINTS.SELLER_SERVICES}?${payload}`);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error get Seller Services");
    }
  },
  order: async (payload) => {
    try {
      const response = await apiInstance.post(ENDPOINTS.ORDER, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error to create Order");
    }
  },
  buyerOrders: async (payload) => {
    try {
      const response = await apiInstance.get(ENDPOINTS.BUYER_ORDERS, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error get Order List")
    }
  },
  payOrder: async (payload) => {
    try {
      const response = await apiInstance.put(ENDPOINTS.PAY_ORDER, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error get Order List")
    }
  },
  rateOrder: async (payload) => {
    try {
      const response = await apiInstance.put(ENDPOINTS.RATE_ORDER, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error get Order List")
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