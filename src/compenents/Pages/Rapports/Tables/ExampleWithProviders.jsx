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
  
  { id: 'user', label: <span style={{ fontWeight: 'bold' }}>Auteur</span>, minWidth: 20 },
  { id: 'titre', label: <span style={{ fontWeight: 'bold' }}>Titre</span>, minWidth: 20 },
  { id: 'nom_projet', label: <span style={{ fontWeight: 'bold' }}>Projet</span>, minWidth: 20 },
  { id: 'contenue', label: <span style={{ fontWeight: 'bold' }}>Description</span>, minWidth: 20 },
  { id: 'statut', label: <span style={{ fontWeight: 'bold' }}>Status</span>, minWidth: 20 },
  { id: 'date_creation', label: <span style={{ fontWeight: 'bold' }}>Date</span>, minWidth: 20 },  
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
          className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:focus-within:border-gray-300"
          sx={{ flexGrow: 1, minWidth: '200px' }}
          InputLabelProps={{
            className: 'dark:text-gray-400',  // Applique le texte blanc pour le label en mode sombre
          }}
        />

        <TextField
          label="Date de début"
          type="date"
          value={dateStart}
          onChange={(e) => setDateStart(e.target.value)}
          InputLabelProps={{ shrink: true, className: 'dark:text-gray-400' }}  // Applique le texte blanc pour le label en mode sombre
          sx={{ flexGrow: 1, minWidth: '200px' }}
          className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:focus-within:border-gray-300"
        />

        <TextField
          label="Date de fin"
          type="date"
          value={dateEnd}
          onChange={(e) => setDateEnd(e.target.value)}
          InputLabelProps={{ shrink: true, className: 'dark:text-gray-400' }}
          className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
          sx={{ flexGrow: 1, minWidth: '200px' }}
        />
       <FormControl fullWidth variant="outlined" className="dark:bg-gray-700 dark:text-gray-200">
          <InputLabel className="dark:text-gray-400">Projet</InputLabel>
          <Select
            value={selectedProjet}
            onChange={(e) => setSelectedProjet(e.target.value)}
            label="Projet"
            className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
          >
            <MenuItem value="">Tous</MenuItem>
            {projets.map((projet) => (
              <MenuItem key={projet.id} value={projet.nom_projet}>
                {projet.nom_projet}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

          <FormControl fullWidth variant="outlined" className=" dark:bg-gray-400 dark:text-gray-200">
          <InputLabel className="dark:text-gray-400">Statut</InputLabel>
            <Select
              value={selectedStatut}
              onChange={(e) => setSelectedStatut(e.target.value)}
              label="Statut"
               className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="0">Rejeté</MenuItem>
              <MenuItem value="1">Validé</MenuItem>
              <MenuItem value="2">En Attente</MenuItem>
            </Select>
          </FormControl>

      </Box>

      {/* Tableau des rapports */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }} className='dark:bg-slate-800 dark:text-gray-200'>
      <TableContainer sx={{ maxHeight: 300 }} className='dark:bg-slate-800 dark:text-gray-200'>
  <Table 
    stickyHeader 
    aria-label="sticky table" 
    className='dark:bg-slate-800 dark:text-gray-200' 
    size="small" // Réduit la taille des cellules
  >
    <TableHead className="bg-gray-50 dark:bg-gray-700 dark:text-gray-200">
      <TableRow className="bg-gray-50 dark:bg-gray-700 dark:text-gray-200">
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.align}
            style={{ minWidth: column.minWidth, padding: '6px 8px' }} // Réduction des paddings
            className="bg-gray-50 dark:bg-gray-700 dark:text-gray-200 text-sm" // Taille de police réduite
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>

    <TableBody>
      {filteredRapports
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row) => (
          <TableRow 
            hover 
            role="checkbox" 
            tabIndex={-1} 
            key={row.id} 
            className='dark:bg-slate-800 dark:text-gray-200'
            style={{ height: '30px' }} // Réduction de la hauteur des lignes
          >
            <TableCell className='dark:bg-slate-800 dark:text-gray-200 text-sm' style={{ padding: '6px 8px' }}>
              {getUserNameById(row.user)}
            </TableCell>
            <TableCell className='dark:bg-slate-800 dark:text-gray-200 text-sm' style={{ padding: '6px 8px' }}>
              {row.titre}
            </TableCell>
            <TableCell className='dark:bg-slate-800 dark:text-gray-200 text-sm' style={{ padding: '6px 8px' }}>
              {row.nom_projet}
            </TableCell>
            <TableCell 
              className='dark:bg-slate-800 dark:text-gray-200 text-sm' 
              style={{ padding: '6px 8px', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {row.contenue}
            </TableCell>

            <TableCell 
              style={{ color: getStatusColor(row.statut), fontWeight: 'bold', padding: '6px 8px' }} 
              className='dark:bg-slate-800 dark:text-gray-200 text-sm'
            >
              {getStatusText(row.statut)}
            </TableCell>
            <TableCell className='dark:bg-slate-800 dark:text-gray-200 text-sm' style={{ padding: '6px 8px' }}>
              {row.date_creation.split('T')[0]}
            </TableCell>
            <TableCell className='dark:bg-slate-800 dark:text-gray-200 text-sm' style={{ padding: '6px 8px' }}>
              <IconButton onClick={() => handleAffiche(row.id)} color="info">
                <FaEye />
              </IconButton>
              <IconButton onClick={() => handleReportStatus(row.id, 'accept')} color="primary">
                <FaCheck />
              </IconButton>
              <IconButton onClick={() => handleReportStatus(row.id, 'reject')} color="error">
                <FaTimes />
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
          className='dark:bg-slate-800 dark:text-gray-200'
        />
</Paper>


      <Modal open={isPreview} onClose={handleClose} >
        <Box sx={style} className='dark:bg-slate-800 dark:text-gray-200'>
          <embed src={pdfBlob} width="100%" height="100%" type="application/pdf" />
        </Box>
      </Modal>
    </Box>
  );
};

export default AffichageRapport;
