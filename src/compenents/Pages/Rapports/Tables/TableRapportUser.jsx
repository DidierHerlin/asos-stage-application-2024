import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Modal,
  Typography
} from '@mui/material';
import { FaEye, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { setAuthUser, getRefreshToken, isAccessTokenExpired } from '../../../../utils/auth';
import { GrAdd } from "react-icons/gr";

const TableRapportUser = () => {
  const [rapports, setRapports] = useState([]);
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [rapportToEdit, setRapportToEdit] = useState(null);
  const [editError, setEditError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatut, setSelectedStatut] = useState('');
  const [selectedProjet, setSelectedProjet] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserReports();
    fetchProjets();
  }, []);

  const fetchUserReports = async () => {
    setLoading(true);
    try {
      const accessToken = Cookies.get('access_token');
      const refreshToken = Cookies.get('refresh_token');

      if (!accessToken || !refreshToken) {
        setError('No token found. Please login again.');
        return;
      }

      if (isAccessTokenExpired(accessToken)) {
        const newTokens = await getRefreshToken();
        setAuthUser(newTokens.access, newTokens.refresh);
        return fetchUserReports();
      }

      const decodedToken = jwt_decode(accessToken);
      const userId = decodedToken.user_id;

      const response = await axios.get('http://localhost:8000/api/RapportApp/rapports/user-reports/', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { userId },
      });

      const rapportsWithProjetInfo = response.data.map(rapport => ({
        ...rapport,
        projet_id: rapport.projet
      }));

      setRapports(rapportsWithProjetInfo);
    } catch (error) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjets = async () => {
    try {
      const accessToken = Cookies.get('access_token');
      if (isAccessTokenExpired(accessToken)) {
        const newTokens = await getRefreshToken();
        setAuthUser(newTokens.access, newTokens.refresh);
        return fetchProjets();
      }

      const response = await axios.get('http://localhost:8000/api/ProjetApp/projets/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProjets(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
    }
  };

  const handleAddReport = () => {
    navigate('/ajout_rapport');
  };

  const handleAffiche = async (rapportId) => {
    try {
      const accessToken = Cookies.get('access_token');
      const response = await axios.get(
        `http://localhost:8000/api/RapportApp/rapports/${rapportId}/visualiser/`,
        { 
          responseType: 'blob',
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      setPdfBlob(URL.createObjectURL(pdfBlob));
      setIsPreview(true);
    } catch (error) {
      console.error('Error fetching PDF:', error);
      Swal.fire({
        title: 'Erreur',
        text: 'Impossible de charger le PDF',
        icon: 'error'
      });
    }
  };

  const handleEditModalOpen = async (rapportId) => {
    try {
      const accessToken = Cookies.get('access_token');
      const response = await axios.get(
        `http://localhost:8000/api/RapportApp/rapports/${rapportId}/afficher-et-modifier-rejet/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setRapportToEdit(response.data);
      setOpenEditModal(true);
    } catch (err) {
      setEditError('Impossible de charger le rapport pour modification.');
      Swal.fire({
        title: 'Erreur',
        text: 'Impossible de charger le rapport pour modification',
        icon: 'error'
      });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = Cookies.get('access_token');
      const formData = new FormData();

      formData.append('titre', rapportToEdit.titre);
      formData.append('description', rapportToEdit.description);
      formData.append('statut', rapportToEdit.statut === 0 ? 2 : rapportToEdit.statut);
      
      if (rapportToEdit.contenue && rapportToEdit.contenue instanceof File) {
        formData.append('contenue', rapportToEdit.contenue);
      }

      const response = await axios.patch(
        `http://localhost:8000/api/RapportApp/rapports/${rapportToEdit.id}/afficher-et-modifier-rejet/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setRapports(prevRapports =>
        prevRapports.map(r => r.id === rapportToEdit.id ? response.data : r)
      );

      Swal.fire({
        title: 'Succès!',
        text: 'Le rapport a été modifié avec succès.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      handleEditModalClose();
      fetchUserReports(); // Refresh the list
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Une erreur est survenue lors de la modification.';
      setEditError(errorMessage);
      Swal.fire({
        title: 'Erreur',
        text: errorMessage,
        icon: 'error'
      });
    }
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setRapportToEdit(null);
    setEditError(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setRapportToEdit(prev => ({
        ...prev,
        contenue: file
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRapportToEdit(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseModal = () => {
    setIsPreview(false);
    if (pdfBlob) {
      URL.revokeObjectURL(pdfBlob);
      setPdfBlob(null);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = rapports.filter((row) => {
    const isTitreMatch = row.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (row.contenue && typeof row.contenue === 'string' && 
                         row.contenue.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const isStatutMatch = selectedStatut === '' || row.statut === parseInt(selectedStatut);
    
    const isProjetMatch = !selectedProjet || 
                         row.projet_id === parseInt(selectedProjet) || 
                         projets.find(p => p.id === row.projet_id)?.nom_projet === selectedProjet;
    
    const isDateMatch = (!startDate || new Date(row.date_creation) >= new Date(startDate)) &&
                       (!endDate || new Date(row.date_creation) <= new Date(endDate));

    return isTitreMatch && isStatutMatch && isProjetMatch && isDateMatch;
  });

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddReport}
          startIcon={<GrAdd />}
        >
          Nouveau rapport
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Rechercher par titre ou contenu"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: '200px' }}
        />
        
        <FormControl variant="outlined" sx={{ minWidth: '200px' }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={selectedStatut}
            onChange={(e) => setSelectedStatut(e.target.value)}
            label="Statut"
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value={0}>Rejeté</MenuItem>
            <MenuItem value={1}>Validé</MenuItem>
            <MenuItem value={2}>En attente</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ minWidth: '200px' }}>
          <InputLabel>Projet</InputLabel>
          <Select
            value={selectedProjet}
            onChange={(e) => setSelectedProjet(e.target.value)}
            label="Projet"
          >
            <MenuItem value="">Tous</MenuItem>
            {projets.map((projet) => (
              <MenuItem key={projet.id} value={projet.id}>
                {projet.nom_projet}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Date de début"
          type="date"
          variant="outlined"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: '200px' }}
        />

        <TextField
          label="Date de fin"
          type="date"
          variant="outlined"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: '200px' }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Titre</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Projet</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Date de création</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Statut</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.titre}</TableCell>
                  <TableCell>
                    {projets.find(p => p.id === row.projet_id)?.nom_projet || 'N/A'}
                  </TableCell>
                  <TableCell>{row.description || row.contenue}</TableCell>
                  <TableCell>
                    {new Date(row.date_creation).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell
                    style={{
                      color: row.statut === 0 ? 'red' : row.statut === 1 ? 'green' : 'orange',
                      fontWeight: 'bold'
                    }}
                  >
                    {row.statut === 0 ? 'Rejeté' : row.statut === 1 ? 'Validé' : 'En attente'}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleAffiche(row.id)}
                      title="Visualiser"
                    >
                      <FaEye />
                    </IconButton>
                    {row.statut === 0 && (
                      <IconButton 
                        onClick={() => handleEditModalOpen(row.id)} 
                        color="warning"
                        title="Modifier"
                      >
                        <FaEdit />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Lignes par page:"
      />

      {isPreview && (
         <Modal open={isPreview} onClose={handleCloseModal}>
         <Box sx={{
           position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
           bgcolor: 'background.paper', padding: 2, width: '80%', height: '80%'
         }}>
           <iframe src={pdfBlob} width="100%" height="100%" />
         </Box>
       </Modal>
      )}

      {openEditModal && (
          <Modal open={openEditModal} onClose={handleEditModalClose}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper', padding: 2, width: '80%', maxWidth: '500px'
          }}>
            {rapportToEdit ? (
              <form onSubmit={handleEditSubmit} encType="multipart/form-data">
                <Typography variant="h6">Modifier le Rapport Rejeté</Typography>

                <TextField
                  label="Titre"
                  name="titre"
                  value={rapportToEdit.titre}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Description"
                  name="description"
                  value={rapportToEdit.contenue}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                />

                <TextField
                  type="file"
                  label="Contenu (Fichier)"
                  name="contenue"
                  onChange={handleFileChange}
                  fullWidth
                  margin="normal"
                />
                
                {editError && <Typography color="error">{editError}</Typography>}

                <Button type="submit" variant="contained" color="primary">Enregistrer</Button>
                <Button variant="outlined" color="secondary" onClick={handleEditModalClose} sx={{ marginLeft: '10px' }}>
                  Annuler
                </Button>
              </form>
            ) : (
              <Typography>Chargement...</Typography>
            )}
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default TableRapportUser;
