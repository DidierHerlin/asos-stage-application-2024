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
  IconButton,
  Modal,
  Box,
} from '@mui/material';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { setAuthUser, getRefreshToken, isAccessTokenExpired } from '../utils/auth';

const AfficheRpUSer = () => {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserReports();
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

      setRapports(response.data);
    } catch (error) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleAffiche = async (rapportId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/RapportApp/rapports/${rapportId}/visualiser/`,
        { responseType: 'blob', headers: { Authorization: `Bearer ${Cookies.get('access_token')}` } }
      );
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      setPdfBlob(URL.createObjectURL(pdfBlob));
      setIsPreview(true);
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };

  const handleCloseModal = () => {
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
    <div>
      {/* Suppression du bouton "Nouvelle rapport" */}
      {/* <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleAddReport}>
          <GrAdd style={{ fontSize: '20px', cursor: 'pointer' }} />
          Nouvelle rapport
        </Button>
      </Box> */}

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
            {rapports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.titre}</TableCell>
                <TableCell>{row.nom_projet}</TableCell>
                <TableCell>{row.contenue}</TableCell>
                <TableCell>{new Date(row.date_creation).toLocaleDateString()}</TableCell>
                <TableCell
                  style={{
                    color: row.statut === 0 ? 'red' : row.statut === 1 ? 'green' : 'orange',
                  }}
                >
                  {row.statut === 0 ? 'Rejeté' : row.statut === 1 ? 'Validé' : 'En attente'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleAffiche(row.id)}>
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
        count={rapports.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
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
    </div>
  );
};

export default AfficheRpUSer;
