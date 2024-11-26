// api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({

  baseURL: 'http://localhost:8000/api/ProjetApp/',

  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to headers
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch all projects
export const fetchProjets = async () => {
  const response = await apiClient.get('projets/');
  return response.data;
};


export const addProjet = async (projet) => {
  const response = await apiClient.post('projets/', projet);
  return response.data;
};


// Delete a project
export const deleteProjet = async (id) => {
  await apiClient.delete(`projets/${id}/`);
};

// Edit a project
export const editProjet = async (id, projet) => {
  await apiClient.put(`projets/${id}/`, projet);
};
