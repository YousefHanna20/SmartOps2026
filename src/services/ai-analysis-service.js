import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getStoredToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken")
  );
};

const getAuthHeaders = () => {
  const token = getStoredToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const generateProjectAiAnalysis = async (projectId) => {
  const response = await axios.post(
    `${API_BASE_URL}/ai-analysis/project/${projectId}`,
    {},
    getAuthHeaders()
  );

  return response.data;
};

export const getLatestProjectAiAnalysis = async (projectId) => {
  const response = await axios.get(
    `${API_BASE_URL}/ai-analysis/project/${projectId}`,
    getAuthHeaders()
  );

  return response.data;
};

export const getAiAnalyses = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/ai-analysis`,
    getAuthHeaders()
  );

  return response.data;
};