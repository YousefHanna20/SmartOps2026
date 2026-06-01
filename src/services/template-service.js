import api from "./api";

export const getTemplates = async () => {
  const response = await api.get("/project-templates");
  return response.data;
};

export const getTemplateById = async (templateId) => {
  const response = await api.get(`/project-templates/${templateId}`);
  return response.data;
};

export const createTemplate = async (templateData) => {
  const response = await api.post("/project-templates", templateData);
  return response.data;
};

export const updateTemplate = async (templateId, templateData) => {
  const response = await api.put(`/project-templates/${templateId}`, templateData);
  return response.data;
};

export const deleteTemplate = async (templateId) => {
  const response = await api.delete(`/project-templates/${templateId}`);
  return response.data;
};