import { getRequest, postRequest, putRequest, patchRequest, deleteRequest } from './axiosServices';

// Auth Services
export const login = async (credentials) => {
  const response = await postRequest('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await postRequest('/auth/register', userData);
  return response.data;
};

// Certification Request Services
export const createCertificationRequest = async (requestData, token) => {
  const response = await postRequest('/certification/requests', requestData, token);
  return response.data;
};

export const getCertificationRequests = async (token) => {
  const response = await getRequest('/certification/requests', token);
  return response.data;
};

export const getCertificationRequestById = async ( token) => {
  const response = await getRequest(`/certification/requests/${requestId}`, token);
  return response.data;
};

export const updateCertificationRequest = async ( updateData, token) => {
  const response = await putRequest(`/certification/requests/${requestId}`, updateData, token);
  return response.data;
};

export const deleteCertificationRequest = async ( token) => {
  const response = await deleteRequest(`/certification/requests/${requestId}`, token);
  return response.data;
};

// Farmer Services
export const getFarmerProfile = async (token) => {
  const response = await getRequest('/farmers/profile', token);
  return response.data;
};

export const updateFarmerProfile = async (profileData, token) => {
  const response = await putRequest('/farmers/profile', profileData, token);
  return response.data;
};

// Inspector Services
export const getPendingInspections = async (token) => {
  const response = await getRequest('/inspections/pending', token);
  return response.data;
};

export const submitInspectionReport = async (inspectionId, reportData, token) => {
  const response = await postRequest(`/inspections/${inspectionId}/report`, reportData, token);
  return response.data;
};

// Blockchain Services
export const getBlockchainTransaction = async (transactionId, token) => {
  const response = await getRequest(`/blockchain/transactions/${transactionId}`, token);
  return response.data;
};

export const verifyBlockchainRecord = async (recordId, token) => {
  const response = await getRequest(`/blockchain/verify/${recordId}`, token);
  return response.data;
}; 