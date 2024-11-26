import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, TextField, Button, Card, CardContent, MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const FormeAjoutRapports = () => {
  const [titre, setTitre] = useState('');
  const [contenue, setContenue] = useState(null);
  const [dateCreation, setDateCreation] = useState('');
  const [statut] = useState('en attente');
  const [error, setError] = useState(null);
  const [projets, setProjets] = useState([]);
  const [projetId, setProjetId] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjets = async () => {
      try {
        const token = Cookies.get('access_token');
        const response = await axios.get('http://localhost:8000/api/ProjetApp/projets/', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setProjets(response.data);
      } catch (error) {
        setError('Erreur lors de la récupération des projets.');
      }
    };
    fetchProjets();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!titre || !contenue || !projetId) {
      setError('Tous les champs sont requis.');
      return;
    }

    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('contenue', contenue);
    formData.append('projet', projetId);

    try {
      const token = Cookies.get('access_token');
      await axios.post('http://localhost:8000/api/RapportApp/rapports/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setTitre('');
      setDateCreation('');
      setContenue(null);
      setProjetId('');
      setError(null);

      Swal.fire({
        title: 'Succès!',
        text: 'Le rapport a été ajouté avec succès!',
        icon: 'success',
        confirmButtonText: 'Ok',
      }).then(() => {
        navigate('/rapport_user');
      });
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Erreur lors de l’ajout du rapport.';
      setError(errorMessage);
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, padding: 3, marginTop: '64px' }}>
      <Container>
        <Card style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <CardContent>
            <Typography variant="h5" style={{ textAlign: 'center' }}>Ajouter un Rapport</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Titre"
                variant="outlined"
                fullWidth
                margin="normal"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
              />
              <TextField
                label="Date"
                type="date"
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={dateCreation}
                onChange={(e) => setDateCreation(e.target.value)}
                required
              />
              <TextField
                select
                label="Sélectionner un projet"
                variant="outlined"
                fullWidth
                margin="normal"
                value={projetId}
                onChange={(e) => setProjetId(e.target.value)}
                required
              >
                {projets.map((projet) => (
                  <MenuItem key={projet.id} value={projet.id}>
                    {projet.nom_projet}
                  </MenuItem>
                ))}
              </TextField>
              <Button variant="outlined" component="label" fullWidth>
                Choisir un fichier
                <input type="file" hidden onChange={(e) => setContenue(e.target.files[0])} required />
              </Button>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button variant="contained" color="primary" type="submit">Ajouter</Button>
                <Button variant="outlined" color="error" onClick={() => navigate('/rapport_user')}>Annuler</Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default FormeAjoutRapports;
