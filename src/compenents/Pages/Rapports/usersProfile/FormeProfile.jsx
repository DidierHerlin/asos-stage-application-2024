import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  Card, CardContent, CardHeader, TextField, Button, DialogActions,
  FormControl, CircularProgress, Alert,
} from '@mui/material';
import useAxios from '../../../../utils/useAxios';

export default function FormeProfile() {
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
    password: '', // Ne pas inclure le mot de passe dans l'initialisation
    is_superuser: 'false'
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
      const response = await axios.put(`http://localhost:8000/api/users/${userData.id}/`, userDataToUpdate, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage(response.data.detail);
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      if (err.response) {
        // Afficher les erreurs de validation
        setError(err.response.data || 'Une erreur est survenue.');
        console.error('Erreur de réponse:', err.response.data);
      } else {
        setError('Une erreur est survenue.');
      }
    }
  };
  

  return (
    <section className="w-full bg-blueGray-50 flex items-center justify-center dark:bg-slate-700">
      <div className="w-full lg:w-8/12 px-4 mx-auto">
        <div className="w-full relative flex flex-col min-w-0 break-words mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="w-full flex-auto px-4 lg:px-10 py-10 pt-0">
            <form onSubmit={handleSubmit}>
              <Section title="User Information">
                <InputField label="Username" type="text" value={userData.username} name="username" onChange={handleChange} isEditing={isEditing} className="dark:bg-slate-400 dark:text-black"/>
                <InputField label="Email address" type="email" value={userData.email} name="email" onChange={handleChange} isEditing={isEditing} className="dark:bg-slate-400 dark:text-black" />
                <InputField label="First Name" type="text" value={userData.first_name} name="first_name" onChange={handleChange} isEditing={isEditing} className="dark:bg-slate-400 dark:text-black"/>
                <InputField label="Last Name" type="text" value={userData.last_name} name="last_name" onChange={handleChange} isEditing={isEditing} className="dark:bg-slate-400 dark:text-black"/>
              </Section>

              <div className="flex justify-end mt-6 space-x-3">
                <button type="button" className="bg-red-300 text-gray-700 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150" onClick={handleEditToggle}>
                  {isEditing ? 'Annuler' : 'Modifier'}
                </button>
                <button type="submit" disabled={!isEditing} className="bg-blue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150">
                  Enregistrer
                </button>
              </div>

              {error && <Alert severity="error">{error}</Alert>}
              {successMessage && <Alert severity="success">{successMessage}</Alert>}
            </form>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="w-full lg:w-8/12 px-4 mx-auto mt-8 dark:bg-slate-700" >
        <div className="w-full relative flex flex-col min-w-0 break-words mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="w-full flex-auto px-4 lg:px-10 py-10 pt-0">
            <form onSubmit={ModfierMotDepasse}>
              <Section title="Modifier Mot de Passe">
                <InputField label="Ancien Mot de Passe" type="password" value={oldPassword} name="oldPassword" onChange={(e) => setOldPassword(e.target.value)} />
                <InputField label="Nouveau Mot de Passe" type="password" value={newPassword} name="newPassword" onChange={(e) => setNewPassword(e.target.value)} />
              </Section>

              <div className="flex justify-end mt-6 space-x-3">
                <button type="submit" className="bg-blue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150">
                  Changer le mot de passe
                </button>
              </div>

              {error && <Alert severity="error">{error}</Alert>}
              {message && <Alert severity="success">{message}</Alert>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// Composant Section pour chaque groupe d'entrées
const Section = ({ title, children }) => (
  <div className="mb-6">
    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">{title}</h6>
    <div className="flex flex-wrap">{children}</div>
  </div>
);

// Composant InputField pour les champs d'entrée
const InputField = ({ label, type, value, name, onChange, isEditing }) => (
  <div className={`w-full lg:w-6/12 px-4 mb-3`}>
    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">{label}</label>
    <input
      type={type}
      value={value}
      name={name}
      onChange={onChange}
      disabled={type === 'text' && !isEditing} // Disable if not editing
      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
    />
  </div>
);
