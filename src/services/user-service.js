import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};


export const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};