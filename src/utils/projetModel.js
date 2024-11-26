// projetModel.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:8000/api/ProjetApp/projets/';


export const fetchProjets = async () => {
  const token = Cookies.get('access_token');
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteProjet = async (id) => {
  const token = Cookies.get('access_token');
  await axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateProjet = async (id, projetData) => {
  const token = Cookies.get('access_token');
  await axios.put(`${API_URL}${id}/`, projetData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};
