import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie'; // Ensure you have this package installed
import jwt_decode from 'jwt-decode'; // Ensure you have this package installed
import { fetchRapport, fetchProjets, fetchUsers } from '../../utils/Rapport';

const Table = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [rapportToEdit, setRapportToEdit] = useState(null);
  const [rapports, setRapports] = useState([]);
  const [users, setUsers] = useState([]); // New state to hold users
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  const isAccessTokenExpired = (token) => {
    const decoded = jwt_decode(token);
    return decoded.exp * 1000 < Date.now(); // Check if the token has expired
  };

  const getRefreshToken = async () => {
    const refreshToken = Cookies.get('refresh_token');
    const response = await axios.post('http://localhost:8000/api/token/refresh/', { refresh: refreshToken });
    return response.data; // This should return new access and refresh tokens
  };

  const setAuthUser = (access, refresh) => {
    Cookies.set('access_token', access);
    Cookies.set('refresh_token', refresh);
  };

  const fetchRapports = async () => {
    setLoading(true);
    try {
      const accessToken = Cookies.get('access_token');
      if (!accessToken) {
        console.error('No access token found. Please login again.');
        return;
      }

      if (isAccessTokenExpired(accessToken)) {
        const newTokens = await getRefreshToken();
        setAuthUser(newTokens.access, newTokens.refresh);
      }

      const response = await axios.get('http://localhost:8000/api/rapports/par-date/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setRapports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => { // Fetch users to use in getUserNameById
    const accessToken = Cookies.get('access_token');
    const response = await axios.get('http://localhost:8000/api/users/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setUsers(response.data);
  };

  useEffect(() => {
    fetchRapports();
    fetchUsers(); // Call to fetch users
  }, []);

  const handleEdit = (item) => {
    setRapportToEdit(item);
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setRapportToEdit(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRapportToEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your submit logic here (e.g., update the rapport on the server)
    handleEditModalClose();
  };

  const getUserNameById = (userId) => {
    if (!userId) {
      console.warn('L\'ID utilisateur est undefined ou null.');
      return 'Utilisateur inconnu';
    }

    const user = users.find(user => user.id === userId);
    if (!user) {
      console.warn(`Utilisateur avec l'ID ${userId} non trouvé.`);
      return 'Utilisateur inconnu';
    }

    return user.username;
  };

  const totalPages = Math.ceil(rapports.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rapports.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full max-w-[1300px] mx-auto bg-white rounded-lg shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Nouveaux rapports.</h2>
      </div>

      <div className="p-6">
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Auteur</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Projet</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Contenu du rapport</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Date création</th>
                </tr>
              </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out" onClick={() => handleEdit(item)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getUserNameById(item.user)}</td> {/* Use the correct function call */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.titre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nom_projet}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.contenue}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(item.date_creation).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-700">Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, rapports.length)} of {rapports.length}</span>

              <div className="flex items-center">
                <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                  Previous
                </Button>

                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
                  >
                    {index + 1}
                  </Button>
                ))}

                <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      <Modal open={openEditModal} onClose={handleEditModalClose}>
        <Box sx={{ width: 400, bgcolor: 'background.paper', p: 4, margin: 'auto', mt: 5 }}>
          <Typography variant="h6" component="h2">Edit Report</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={rapportToEdit?.name || ''}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Age"
              name="age"
              value={rapportToEdit?.age || ''}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="number"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Job</InputLabel>
              <Select
                name="job"
                value={rapportToEdit?.job || ''}
                onChange={handleInputChange}
              >
                {/* Add job options here */}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">Save</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Table;
