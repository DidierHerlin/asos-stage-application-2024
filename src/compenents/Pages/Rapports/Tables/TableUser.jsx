import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,FormControl,InputLabel,Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { fetchProjets, deleteProjet, editProjet } from '../../../../utils/api'; // Import API functions
import Swal from 'sweetalert2'; // Ensure Swal is imported for alerts
import Cookies from 'js-cookie';
import axios from 'axios';

const TableUser = () => {
  const [users, setUsers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [newUser, setNewUser] = useState({
    is_superuser: '0',
    username: '',
    last_name: '',
    first_name: '',
    email: '',
    password: '',
    is_activate: '1',
  });

  // Fetch data from the API
  useEffect(() => {
    const token = Cookies.get('access_token');
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        setError('Une erreur est survenue lors de la récupération des utilisateurs.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenModal = () => {
    setNewUser({ is_superuser: '0', username: '', last_name: '', first_name: '', email: '', password: '' });
    setIsCreating(true);
  };

  const handleCloseModal = () => {
    setIsCreating(false);
    setValidationErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: name === 'is_superuser' ? Number(value) : value, // Convertit la valeur en nombre si c'est 'is_superuser'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('access_token');

    try {
      const response = await axios.post('http://localhost:8000/api/users/', newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setUsers((prevUsers) => [...prevUsers, response.data]);
      handleCloseModal();
      Swal.fire('Utilisateur ajouté!', "L'utilisateur a été ajouté avec succès.", 'success');
    } catch (error) {
      const errorMessage = error.response?.data.detail || 'Une erreur est survenue lors de l\'ajout de l\'utilisateur.';
      Swal.fire('Erreur!', errorMessage, 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas annuler cela!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteProjet(id);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        Swal.fire('Supprimé!', 'L\'utilisateur a été supprimé.', 'success');
      } catch (error) {
        Swal.fire('Erreur!', 'Une erreur est survenue.', 'error');
      }
    }
  };

  const handleOpenEditModal = (user) => {
    setCurrentUser(user);
    setIsEditing(true);
  };

  const handleCloseEditModal = () => {
    setCurrentUser(null);
    setIsEditing(false);
  };

  const handleEditSubmit = async () => {
    try {
      await editProjet(currentUser.id, currentUser);
      setUsers((prev) =>
        prev.map((user) => (user.id === currentUser.id ? currentUser : user))
      );
      handleCloseEditModal();
      Swal.fire('Succès!', 'L\'utilisateur a été modifié.', 'success');
    } catch (error) {
      Swal.fire('Erreur!', 'Une erreur est survenue lors de la modification.', 'error');
    }
  };

  // Filter users based on the search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ padding: 2 }}>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ marginBottom: 2 }}
        InputLabelProps={{ shrink: true, className: 'dark:text-gray-400' }}
          className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
          
      />
      <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ marginBottom: 2 }}>
        Nouvel Employer
      </Button>

      <TableContainer component={Paper} className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">
        <Table className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">
          <TableHead className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }} className="dark:bg-gray-600 dark:text-gray-200 ">Pseudo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} className="dark:bg-gray-600 dark:text-gray-200 ">Nom</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} className="dark:bg-gray-600 dark:text-gray-200 ">Prenom</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} className="dark:bg-gray-600 dark:text-gray-200 ">Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} className="dark:bg-gray-600 dark:text-gray-200 ">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="dark:bg-gray-600 dark:text-gray-200 ">
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="dark:bg-gray-800 dark:text-gray-200 ">{user.username}</TableCell>
                <TableCell className="dark:bg-gray-800 dark:text-gray-200 ">{user.last_name}</TableCell>
                <TableCell className="dark:bg-gray-800 dark:text-gray-200 ">{user.first_name}</TableCell>
                <TableCell className="dark:bg-gray-800 dark:text-gray-200 ">{user.email}</TableCell>
                <TableCell className="dark:bg-gray-800 dark:text-gray-200 ">
                  <Tooltip title="Edit" className="dark:bg-gray-600 dark:text-green-500 ">
                    <IconButton onClick={() => handleOpenEditModal(user)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(user.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        className="dark:bg-gray-600 dark:text-gray-200"
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />

      {/* Create User Dialog */}
<Dialog open={isCreating} onClose={handleCloseModal} >
  <DialogTitle className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">Créer un nouvel utilisateur</DialogTitle>
  <DialogContent className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">
    <form onSubmit={handleSubmit} className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">
      <FormControl fullWidth margin="normal" className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">
        <InputLabel id="is_superuser-label">Statut</InputLabel>
        <Select
          labelId="is_superuser-label"
          name="is_superuser"
          value={newUser.is_superuser}
          onChange={handleChange}
          required
        >
          <MenuItem value={0}>Employé</MenuItem>
          <MenuItem value={1}>Admin</MenuItem>
        </Select>
      </FormControl>
      <TextField
        name="username"
        label="Nom d'utilisateur"
        value={newUser.username}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        name="last_name"
        label="Nom"
        value={newUser.last_name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        name="first_name"
        label="Prénom"
        value={newUser.first_name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        name="email"
        label="Email"
        type="email"
        value={newUser.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        name="password"
        label="Mot de passe"
        type="password"
        value={newUser.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <DialogActions>
        <Button onClick={handleCloseModal} color="primary" className="dark:bg-gray-600 dark:text-red-500 dark:border-gray-500">
          Annuler
        </Button>
        <Button type="submit" color="primary" className="dark:bg-gray-600 dark:text-green-500 dark:border-gray-500">
          Ajouter
        </Button>
      </DialogActions>
    </form>
  </DialogContent>
</Dialog>


      {/* Edit User Dialog */}
      <Dialog open={isEditing} onClose={handleCloseEditModal}>
        <DialogTitle className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">Modifier Utilisateur</DialogTitle>
        <DialogContent className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">
          {currentUser && (
            <>
              <TextField
                label="Username"
                fullWidth
                name="username"
                value={currentUser.username}
                onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
               
               
                margin="normal"
                required
              />
              <TextField
                label="Nom"
                fullWidth
                name="last_name"
                value={currentUser.last_name}
                onChange={(e) => setCurrentUser({ ...currentUser, last_name: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                label="Prenom"
                fullWidth
                name="first_name"
                value={currentUser.first_name}
                onChange={(e) => setCurrentUser({ ...currentUser, first_name: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                label="Email"
                fullWidth
                name="email"
                value={currentUser.email}
                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                margin="normal"
                required
              />
            </>
          )}
        </DialogContent>
        <DialogActions className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">
          <Button onClick={handleCloseEditModal} className="dark:bg-gray-600 dark:text-red-500 dark:border-gray-500">Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary" className="dark:bg-gray-600 dark:text-green-500 dark:border-gray-500">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableUser;
