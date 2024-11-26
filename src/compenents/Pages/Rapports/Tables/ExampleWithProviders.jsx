import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton
} from '@mui/material';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import Cookies from 'js-cookie';
import { fetchRapport, fetchProjets, fetchUsers } from '../../../../utils/Rapport';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const columns = [
  { id: 'titre', label: <span style={{ fontWeight: 'bold' }}>Titre</span>, minWidth: 20 },
  { id: 'contenue', label: <span style={{ fontWeight: 'bold' }}>Description</span>, minWidth: 20 },
  { id: 'date_creation', label: <span style={{ fontWeight: 'bold' }}>Date</span>, minWidth: 20 },
  { id: 'statut', label: <span style={{ fontWeight: 'bold' }}>Status</span>, minWidth: 20 },
  { id: 'user', label: <span style={{ fontWeight: 'bold' }}>Auteur</span>, minWidth: 20 },
  { id: 'nom_projet', label: <span style={{ fontWeight: 'bold' }}>Projet</span>, minWidth: 20 },
  { id: 'actions', label: <span style={{ fontWeight: 'bold' }}>Actions</span>, minWidth: 20 },
];

const AffichageRapport = () => {
  const [rapports, setRapports] = useState([]);
  const [projets, setProjets] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [selectedProjet, setSelectedProjet] = useState('');
  const [selectedStatut, setSelectedStatut] = useState('');
  const [filteredRapports, setFilteredRapports] = useState([]);

  const getStatusText = (statut) => {
    switch (statut) {
      case 0:
        return 'Rejeté';
      case 1:
        return 'Validé';
      case 2:
        return 'En Attente';
      default:
        return 'Inconnu';
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 0:
        return 'red';
      case 1:
        return 'green';
      case 2:
        return 'yellow';
      default:
        return 'grey';
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [rapportData, projetData, usersData] = await Promise.all([
          fetchRapport(),
          fetchProjets(),
          fetchUsers()
        ]);
        setRapports(rapportData);
        setProjets(projetData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    loadData();
  }, []);

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

  useEffect(() => {
    const results = rapports.filter((rapport) => {
      const matchesSearchTerm = searchTerm === '' || rapport.titre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProjet = selectedProjet === '' || rapport.nom_projet === selectedProjet;
      const matchesStatut = selectedStatut === '' || rapport.statut.toString() === selectedStatut;
      const matchesDate =
        (!dateStart || new Date(rapport.date_creation) >= new Date(dateStart)) &&
        (!dateEnd || new Date(rapport.date_creation) <= new Date(dateEnd));

      return matchesSearchTerm && matchesProjet && matchesStatut && matchesDate;
    });

    setFilteredRapports(results);
    setPage(0);
  }, [searchTerm, dateStart, dateEnd, selectedProjet, selectedStatut, rapports]);

  const handleReportStatus = async (id, action) => {
    const actionText = action === 'accept' ? 'accepter' : 'rejeter';
    const status = action === 'accept' ? 1 : 0;
    const apiUrl = `http://localhost:8000/api/RapportApp/rapports/${id}/${action}/`;

    try {
      const result = await Swal.fire({
        title: `Êtes-vous sûr de vouloir ${actionText} ce rapport?`,
        text: `Vous êtes sur le point de ${actionText} ce rapport.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Oui, ${actionText}!`,
      });

      if (result.isConfirmed) {
        await axios.post(apiUrl, {}, {
          headers: { Authorization: `Bearer ${Cookies.get('access_token')}` }
        });

        setRapports((prevRapports) =>
          prevRapports.map((rapport) =>
            rapport.id === id ? { ...rapport, statut: status } : rapport
          )
        );
        Swal.fire(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)}!`, `Le rapport a été ${actionText}.`, 'success');
      }
    } catch (error) {
      Swal.fire('Erreur', `Erreur lors du ${actionText} du rapport.`, 'error');
    }
  };

  const handleAffiche = async (rapportId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/RapportApp/rapports/${rapportId}/visualiser/`,
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${Cookies.get('access_token')}` },
        }
      );
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      setPdfBlob(URL.createObjectURL(pdfBlob));
      setIsPreview(true);
    } catch (error) {
      console.error('Erreur lors de la récupération du PDF :', error);
    }
  };

  const handleClose = () => {
    setIsPreview(false);
    setPdfBlob(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* Filtres */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <TextField
          label="Recherche"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
        <TextField
          label="Date de début"
          type="date"
          value={dateStart}
          onChange={(e) => setDateStart(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Date de fin"
          type="date"
          value={dateEnd}
          onChange={(e) => setDateEnd(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth variant="outlined">
            <InputLabel>Projet</InputLabel>
            <Select
              value={selectedProjet}
              onChange={(e) => setSelectedProjet(e.target.value)}
              label="Projet"
            >
              <MenuItem value="">Tous</MenuItem>
              {projets.map((projet) => (
                <MenuItem key={projet.id} value={projet.nom_projet}>
                  {projet.nom_projet}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel>Statut</InputLabel>
            <Select
              value={selectedStatut}
              onChange={(e) => setSelectedStatut(e.target.value)}
              label="Statut"
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="0">Rejeté</MenuItem>
              <MenuItem value="1">Validé</MenuItem>
              <MenuItem value="2">En Attente</MenuItem>
            </Select>
          </FormControl>

      </Box>

      {/* Tableau des rapports */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRapports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell>{row.titre}</TableCell>
                    <TableCell>{row.contenue}</TableCell>
                    <TableCell>{row.date_creation.split('T')[0]}</TableCell>
                    <TableCell style={{ color: getStatusColor(row.statut), fontWeight: 'bold' }}>
                      {getStatusText(row.statut)}
                    </TableCell>
                    <TableCell>{getUserNameById(row.user)}</TableCell>
                    <TableCell>{row.nom_projet}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleReportStatus(row.id, 'accept')} color="primary">
                        <FaCheck />
                      </IconButton>
                      <IconButton onClick={() => handleReportStatus(row.id, 'reject')} color="error">
                        <FaTimes />
                      </IconButton>
                      <IconButton onClick={() => handleAffiche(row.id)} color="info">
                        <FaEye />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRapports.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Modal open={isPreview} onClose={handleClose}>
        <Box sx={style}>
          <embed src={pdfBlob} width="100%" height="100%" type="application/pdf" />
        </Box>
      </Modal>
    </Box>
  );
};

export default AffichageRapport;
