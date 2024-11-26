import React, { useEffect, useState } from 'react';
import { SiVirustotal } from 'react-icons/si';
import { CgSearchLoading } from 'react-icons/cg';
import { GrValidate } from 'react-icons/gr';
import { FaTrashRestore } from 'react-icons/fa';
import axios from 'axios';

const Card = () => {
  const [reportData, setReportData] = useState({
    totalReports: 0,
    pendingReports: 0,
    approvedReports: 0,
    rejectedReports: 0,
  });

  useEffect(() => {
    const fetchReportStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/rapports/stats/');
        setReportData({
          totalReports: response.data.total_count,
          pendingReports: response.data.statut_2,
          approvedReports: response.data.statut_1,
          rejectedReports: response.data.statut_0,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques des rapports:", error);
      }
    };
  
    const fetchNotifications = async () => {
      try {
        const accessToken = Cookies.get('access_token'); // Récupération du token d'accès
    
        if (!accessToken) {
          console.error("Token d'accès non trouvé.");
          return;
        }
    
        const response = await axios.get('http://localhost:8000/api/notifications/', {
          headers: { Authorization: `Bearer ${accessToken}` }, // Ajout de l'en-tête d'autorisation
        });
        
        setNotifications(response.data); // Assurez-vous que les données sont dans le bon format
        
        // Afficher les notifications dans la console
        console.log("Notifications récupérées:", response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications:", error);
      }
    };
    
    fetchReportStats();
    fetchNotifications();
  }, []);

  return (
    <div className="flex items-center justify-center text-gray-800 p-10 bg-gray-200">
      <div className="flex flex-wrap justify-between w-full max-w-6xl">
        {/* Card 1: Total Rapports */}
        <div className="flex items-center p-4 bg-white rounded w-full sm:w-[320px] lg:w-[280px] h-[80px]">
          <div className="flex flex-shrink-0 items-center justify-center bg-blue-400 h-12 w-12 rounded">
            <svg className="w-6 h-6 fill-current text-white-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <SiVirustotal />
            </svg>
          </div>
          <div className="flex-grow flex flex-col ml-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Total Rapports</span>
              <span className="text-blue-500 text-sm font-semibold ml-2">{reportData.totalReports}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Rapport en cours */}
        <div className="flex items-center p-4 bg-white rounded w-full sm:w-[320px] lg:w-[280px] h-[80px]">
          <div className="flex flex-shrink-0 items-center justify-center bg-yellow-200 h-12 w-12 rounded">
            <svg className="w-6 h-6 fill-current text-yellow-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <CgSearchLoading />
            </svg>
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Rapport en cours</span>
              <span className="text-yellow-500 text-sm font-semibold ml-2">{reportData.pendingReports}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Rapports validés */}
        <div className="flex items-center p-4 bg-white rounded w-full sm:w-[320px] lg:w-[280px] h-[80px]">
          <div className="flex flex-shrink-0 items-center justify-center bg-green-200 h-12 w-12 rounded">
            <svg className="w-6 h-6 fill-current text-green-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <GrValidate />
            </svg>
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Rapports validés</span>
              <span className="text-green-500 text-sm font-semibold ml-2">{reportData.approvedReports}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Rapports rejetés */}
        <div className="flex items-center p-4 bg-white rounded w-full sm:w-[320px] lg:w-[280px] h-[80px]">
          <div className="flex flex-shrink-0 items-center justify-center bg-red-200 h-12 w-12 rounded">
            <svg className="w-6 h-6 fill-current text-red-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <FaTrashRestore />
            </svg>
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Rapports rejetés</span>
              <span className="text-red-500 text-sm font-semibold ml-2">{reportData.rejectedReports}</span> {/* Remplacez ceci par la valeur si disponible */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
