import axios from 'axios';
import Cookies from 'js-cookie';


const API_URL = 'http://localhost:8000/api/RapportApp/rapports/';
const PROJETS_URL = 'http://localhost:8000/api/ProjetApp/projets/';



const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${Cookies.get('access_token')}`,
    'Content-Type': 'application/json',
  },
});


export const fetchRapport = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des rapports:', error);

    throw error;
  }
};

export const addRapport = async (projetData) => {
  try {
    const response = await axios.post(API_URL, projetData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du rapport:', error);
    throw error;
  }
};

export const deleteRapport = async (id) => {
  try {
    await axios.delete(`${API_URL}${id}/`, getAuthHeaders());
  } catch (error) {
    console.error('Erreur lors de la suppression du rapport:', error);
    throw error;
  }
};

export const updateRapport = async (id, projetData) => {
  const url = `${API_URL}${id}/`;

  try {
    const headers = {
      ...getAuthHeaders().headers,
      'Content-Type': projetData instanceof FormData ? 'multipart/form-data' : 'application/json',
    };

    const response = await axios.put(url, projetData, { headers });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error.response?.data || error.message);
    throw new Error('Erreur lors de la mise à jour du projet');
  }
};

// <<<<<<< HEAD
// // Fonction pour récupérer tous les projets
// export const fetchProjets = async () => {
//   return await apiRequest('GET', PROJETS_URL);
// };
// =======
export const fetchProjets = async () => {
  const token = Cookies.get('access_token');
  const response = await axios.get('http://localhost:8000/api/ProjetApp/projets/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const fetchUsers = async () => {
  try {
    const token = Cookies.get('access_token');
    const response = await axios.get('http://127.0.0.1:8000/api/users/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
};
