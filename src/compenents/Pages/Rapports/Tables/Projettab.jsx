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
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { fetchProjets, deleteProjet, editProjet,addProjet } from '../../../../utils/api'; // Import API functions
import Swal from 'sweetalert2'; // Ensure Swal is imported for alerts

const TableProjet = () => {
  const [projets, setProjets] = useState([]);
  const [filteredProjets, setFilteredProjets] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProjet, setCurrentProjet] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProjets();
        setProjets(data);
        setFilteredProjets(data); // Initialize filteredProjets with fetched data
      } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = projets.filter((projet) =>
      projet.nom_projet.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjets(results); // Update filtered projects based on search term
  }, [searchTerm, projets]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Correctly set the search term
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
        setProjets(projets.filter((projet) => projet.id !== id));
        Swal.fire('Supprimé!', 'Le projet a été supprimé.', 'success');
      } catch (error) {
        Swal.fire('Erreur!', 'Une erreur est survenue.', 'error');
      }
    }
  };
  const handleClose = () => {
    setIsCreating(false);
  };


  const handleOpenEditModal = (projet) => {
    setCurrentProjet(projet);
    setIsEditing(true);
  };

  const handleCloseEditModal = () => {
    setCurrentProjet(null);
    setIsEditing(false);
  };

  const handleEditSubmit = async () => {
    try {
      await editProjet(currentProjet.id, currentProjet);
      setProjets((prev) =>
        prev.map((projet) =>
          projet.id === currentProjet.id ? currentProjet : projet
        )
      );
      handleCloseEditModal();
      Swal.fire('Succès!', 'Le projet a été modifié.', 'success');
    } catch (error) {
      Swal.fire('Erreur!', 'Une erreur est survenue lors de la modification.', 'error');
    }
  };

  const addProjet = (projet) => {
    const errors = {};
    if (!projet.nom_projet) errors.nom_projet = 'Nom requis'; // Adjust based on your Projet model
    // Add more validations as necessary
    return errors;
  };

  const handleCreateProjet = () => {
    const newProjet = { ...currentProjet, id: Math.random().toString(36).substring(7) };
    const errors = validateProjet(newProjet);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    // Ajouter le projet à la liste
    setProjets((prev) => [...prev, newProjet]);
    setIsCreating(false); // Fermer la modal après ajout
    setCurrentProjet({ nom_projet: '' }); // Réinitialiser l'état du projet
  };

  const validateProjet = (projet) => {
    const errors = {};
    if (!projet.nom_projet) errors.nom_projet = 'Nom requis';
    // Vous pouvez ajouter plus de validations ici
    return errors;
  };

  const handleUpdateProjet = () => {
    const errors = validateProjet(currentProjet);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setProjets((prev) =>
      prev.map((projet) => (projet.id === currentProjet.id ? currentProjet : projet))
    );
    setIsEditing(false);
    setCurrentProjet(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedProjets = filteredProjets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Function to download as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Projet Report", 20, 10);
    paginatedProjets.forEach((projet, index) => {
      doc.text(`${index + 1}. ${projet.nom_projet}`, 20, 20 + (index * 10)); // Adjust according to your model fields
    });
    doc.save("projets.pdf");
  };

  // Function to download as Excel
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredProjets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Projets");
    XLSX.writeFile(wb, "projets.xlsx");
  };

  // Function to download as CSV
  const downloadCSV = () => {
    const csv = Papa.unparse(filteredProjets);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'projets.csv');
  };


  const handleOpen = () => {
    setIsCreating(true);
  };
  return (
    <Box sx={{ padding: 2 }}>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        InputLabelProps={{ shrink: true, className: 'dark:text-gray-400' }}
          className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
          sx={{ flexGrow: 1, minWidth: '200px' }}
      />
      <Box sx={{ marginBottom: 2 ,mt :4}}>
        <Button onClick={downloadPDF} variant="contained" color="primary" sx={{ marginRight: 1 }}>
          Download PDF
        </Button>
        <Button onClick={downloadExcel} variant="contained" color="success" sx={{ marginRight: 1 }}>
          Download Excel
        </Button>
        <Button onClick={downloadCSV} variant="contained" color="secondary">
          Download CSV
        </Button>
      </Box>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Ajouter un projet
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }} className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-500">
        <Table>
      
        <TableHead >
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }} className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">Actions</TableCell>
          </TableRow>
        </TableHead>

          <TableBody className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">
            {paginatedProjets.map((projet) => (
              <TableRow key={projet.id}>
                <TableCell className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">{projet.id}</TableCell>
                <TableCell className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">{projet.nom_projet}</TableCell>
                <TableCell className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">
                  <Tooltip title="Edit" className='dark:text-blue-500'>
                    <IconButton onClick={() => handleOpenEditModal(projet)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(projet.id)}>
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
        count={filteredProjets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
      />

      <Dialog open={isCreating} onClose={handleClose}>
      <DialogTitle className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">Create New Projet</DialogTitle>
      <DialogContent className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">
          <TextField
            label="Nom du projet"
            fullWidth
            value={currentProjet?.nom_projet || ''}
            onChange={(e) => setCurrentProjet({ ...currentProjet, nom_projet: e.target.value })}
            error={!!validationErrors.nom_projet}
            helperText={validationErrors.nom_projet}
            onFocus={() => setValidationErrors({})}
            className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
          />
        </DialogContent>
        <DialogActions className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">
          <Button onClick={() => setIsCreating(false)} className="dark:bg-gray-600 dark:text-red-500 dark:border-gray-500">Cancel</Button>
          <Button onClick={handleCreateProjet} className="dark:bg-gray-600 dark:text-blue-500 dark:border-gray-500">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditing} onClose={handleCloseEditModal} >
        <DialogTitle className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">Edit Projet</DialogTitle>
        <DialogContent className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">
          <TextField
            label="Name"
            fullWidth
            value={currentProjet?.nom_projet || ''}
            onChange={(e) => setCurrentProjet({ ...currentProjet, nom_projet: e.target.value })}
            error={!!validationErrors.nom_projet}
            helperText={validationErrors.nom_projet}
            onFocus={() => setValidationErrors({})}
            InputLabelProps={{ shrink: true, className: 'dark:text-gray-200' }}
          className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
          />
        </DialogContent >
        <DialogActions  className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">
          <Button onClick={handleCloseEditModal} className="dark:bg-gray-600 dark:text-red-500 dark:border-gray-500">Cancel</Button>
          <Button onClick={handleEditSubmit} className="dark:bg-gray-600 dark:text-green-500 dark:border-gray-500">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableProjet;
