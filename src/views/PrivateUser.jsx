import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  Card, CardContent, CardHeader, TextField, Button, DialogActions,
  FormControl, CircularProgress, Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useAxios from '../utils/useAxios';

const Private = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const token = Cookies.get('access_token');
  const [userData, setUserData] = useState({
    id: null,
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    is_superuser: ''  // Utiliser la valeur de la base de données pour le statut
  });
  const api = useAxios();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.user_id;
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setUserData(response.data);
      } catch (error) {
        setError("Erreur lors du chargement des données de l'utilisateur");
        console.error("Erreur lors du chargement des données de l'utilisateur", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, ...userDataToUpdate } = userData;
    console.log("User Data to Update:", userDataToUpdate);
    try {
      const response = await axios.put(`http://localhost:8000/api/users/${userData.id}/`,
        userDataToUpdate, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccessMessage('Profil mis à jour avec succès');
      setUserData(response.data);
      setIsEditing(false);
    } catch (error) {
      setError('Erreur lors de la mise à jour du profil');
      console.error('Erreur lors de la mise à jour du profil', error.response.data || error.message);
    }
  };

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const ModfierMotDepasse = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await axios.put(
        'http://localhost:8000/api/change-password/',
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage(response.data.detail);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || 'Une erreur est survenue.');
      } else {
        setError('Une erreur est survenue.');
      }
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Card sx={{ marginLeft: '300px', marginTop: '-120px' }}>
      <CardHeader title="Profil Utilisateur" />
      <CardContent>
        {error && <Alert severity="error">{error}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Statut"
              value={userData.is_superuser === "0" ? "Employé" : "Admin"}  // Afficher le statut basé sur is_superuser
              variant="outlined"
              fullWidth
              margin="normal"
              disabled
            />
          </FormControl>
          <TextField
            name="username"
            label="Nom d'utilisateur"
            value={userData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={!isEditing}
          />
          <TextField
            name="last_name"
            label="Nom"
            value={userData.last_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={!isEditing}
          />
          <TextField
            name="first_name"
            label="Prénom"
            value={userData.first_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={!isEditing}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            value={userData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={!isEditing}
          />
          <TextField
            name="password"
            label="Nouveau Mot de passe"
            type="password"
            placeholder="Laissez vide pour conserver le mot de passe actuel"
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <DialogActions>
            <Button onClick={handleEditToggle} color="primary">
              {isEditing ? 'Annuler' : 'Modifier'}
            </Button>
            {isEditing && (
              <Button type="submit" color="primary">
                Enregistrer
              </Button>
            )}
            <Button onClick={ModfierMotDepasse} color="secondary">
              Modifier mot de passe
            </Button>
          </DialogActions>
        </form>
      </CardContent>
    </Card>
  );
};

export default Private;
