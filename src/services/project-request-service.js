import api from "./api";

export const getProjectRequests = async () => {
  const response = await api.get("/project-requests");
  return response.data;
};

export const getProjectRequestById = async (requestId) => {
  const response = await api.get(`/project-requests/${requestId}`);
  return response.data;
};

export const createProjectRequest = async (requestData) => {
  const response = await api.post("/project-requests", requestData);
  return response.data;
};

export const approveProjectRequest = async (requestId) => {
  const response = await api.patch(`/project-requests/${requestId}/approve`);
  return response.data;
};

export const rejectProjectRequest = async (requestId, rejectionReason) => {
  const response = await api.patch(`/project-requests/${requestId}/reject`, {
    rejection_reason: rejectionReason,
  });

  return response.data;
};

export const deleteProjectRequest = async (requestId) => {
  const response = await api.delete(`/project-requests/${requestId}`);
  return response.data;
};