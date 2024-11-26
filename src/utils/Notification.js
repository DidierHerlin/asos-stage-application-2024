import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const getToken = () => Cookies.get('access_token');

const handleError = (error, defaultMessage) => {
  const message = error.response?.data?.message || defaultMessage;
  showError(message);
  return [];
};

export const fetchNotificationsFromAPI = async () => {
  const token = getToken();
  if (!token) return showError('Token d\'accès manquant. Veuillez vous reconnecter.');

  try {
    const response = await axios.get('http://localhost:8000/api/notifications/', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data; // Return notifications
  } catch (error) {
    return handleError(error, 'Une erreur est survenue lors de la récupération des notifications.');
  }
};

export const addNotification = async (message, navigate) => {
  const token = getToken();
  if (!token) return showError('Token d\'accès manquant. Veuillez vous reconnecter.');

  try {
    await axios.post('http://localhost:8000/api/notifications/', { message }, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    });
    showSuccess('Notification ajoutée avec succès.');
    navigate('/notifications');
  } catch (error) {
    handleError(error, 'Une erreur est survenue lors de l\'ajout de la notification.');
  }
};

export const deleteNotification = async (id, setNotifications) => {
  const token = getToken();
  if (!token) return showError('Token d\'accès manquant. Veuillez vous reconnecter.');

  try {
    await axios.delete(`http://localhost:8000/api/notifications/${id}/`, { headers: { 'Authorization': `Bearer ${token}` } });
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    showSuccess('Notification supprimée avec succès.');
  } catch (error) {
    handleError(error, 'Une erreur est survenue lors de la suppression de la notification.');
  }
};

export const updateNotification = async (id, updatedFields, setNotifications) => {
  const token = getToken();
  if (!token) return showError('Token d\'accès manquant. Veuillez vous reconnecter.');

  try {
    console.log('Mise à jour des champs:', updatedFields); // Log des champs
    await axios.put(`http://localhost:8000/api/notifications/${id}/`, updatedFields, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    });
    setNotifications(prev => prev.map(notification => (notification.id === id ? { ...notification, ...updatedFields } : notification)));
    showSuccess('Notification mise à jour avec succès.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error); // Log d'erreur
    handleError(error, 'Une erreur est survenue lors de la mise à jour de la notification.');
  }
};

const showSuccess = (message) => Swal.fire({ icon: 'success', title: 'Succès!', text: message });
const showError = (message) => Swal.fire({ icon: 'error', title: 'Erreur!', text: message });
