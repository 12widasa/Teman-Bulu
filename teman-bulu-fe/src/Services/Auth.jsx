import { dateFormatWithTime } from '../Utils/dateFormat'
import axios from 'axios'

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
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
  REGISTER: "/register",
  ANIMALS: "/animals"
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
  async registerUser(payload) {
    try {
      const response = await apiInstance.post(ENDPOINTS.REGISTER, payload);
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
}