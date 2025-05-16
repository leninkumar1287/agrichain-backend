import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get headers with optional token
const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// GET request
export const getRequest = async (endpoint, token = null) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: getHeaders(token)
    });
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

// POST request
export const postRequest = async (endpoint, data, token = null) => {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: getHeaders(token)
    });
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

// PUT request
export const putRequest = async (endpoint, data, token = null) => {
  try {
    const response = await axios.put(`${BASE_URL}${endpoint}`, data, {
      headers: getHeaders(token)
    });
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

// PATCH request
export const patchRequest = async (endpoint, data, token = null) => {
  try {
    const response = await axios.patch(`${BASE_URL}${endpoint}`, data, {
      headers: getHeaders(token)
    });
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

// DELETE request
export const deleteRequest = async (endpoint, token = null) => {
  try {
    const response = await axios.delete(`${BASE_URL}${endpoint}`, {
      headers: getHeaders(token)
    });
    return response;
  } catch (error) {
    throw error.response || error;
  }
}; 