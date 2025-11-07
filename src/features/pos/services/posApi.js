import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const getAllProducts = async (token) => {
  const res = await axios.get(`${API_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const placeOrder = async (orderData, token) => {
  const res = await axios.post(`${API_URL}/orders`, orderData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getReceiptPDF = (orderId) => {
  window.open(`${API_URL}/orders/${orderId}/receipt`, "_blank");
};

export const getAllRawMaterials = async (token) => {
  const res = await axios.get(`${API_URL}/raw-materials`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};