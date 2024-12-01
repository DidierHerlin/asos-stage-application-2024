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
    <div className="flex items-center justify-center text-gray-800 p-10 bg-White dark:bg-gray-800 dark:text-gray-200">
      <div className="flex flex-wrap justify-between w-full max-w-6xl">
        {/* Card 1: Total Rapports */}
        <div className="flex items-center p-4 bg-gray-200 rounded w-full sm:w-[320px] lg:w-[280px] h-[80px] dark:bg-gray-600 dark:text-gray-200 shadow">
          <div className="flex flex-shrink-0 items-center justify-center bg-blue-400 h-12 w-12 rounded">
            <SiVirustotal className="w-6 h-6 text-white" />
          </div>
          <div className="flex-grow flex flex-col ml-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-300">Total Rapports</span>
              <span className="text-blue-500 text-sm font-semibold ml-2">
                {reportData.totalReports}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Rapport en cours */}
        <div className="flex items-center p-4 bg-gray-200 rounded w-full sm:w-[320px] lg:w-[280px] h-[80px] dark:bg-slate-600 dark:text-gray-200 shadow">
          <div className="flex flex-shrink-0 items-center justify-center bg-yellow-200 h-12 w-12 rounded">
            <CgSearchLoading className="w-6 h-6 text-yellow-700" />
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-300">Rapport en cours</span>
              <span className="text-yellow-500 text-sm font-semibold ml-2">
                {reportData.pendingReports}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Rapports validés */}
        <div className="flex items-center p-4 bg-gray-200 rounded w-full sm:w-[320px] lg:w-[280px] h-[80px] dark:bg-slate-600 dark:text-gray-200 shadow">
          <div className="flex flex-shrink-0 items-center justify-center bg-green-200 h-12 w-12 rounded">
            <GrValidate className="w-6 h-6 text-green-700" />
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-300">Rapports validés</span>
              <span className="text-green-500 text-sm font-semibold ml-2">
                {reportData.approvedReports}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Rapports rejetés */}
        <div className="flex items-center p-4 bg-gray-200 rounded w-full sm:w-[320px] lg:w-[280px] h-[80px] dark:bg-slate-600 dark:text-gray-200 shadow">
          <div className="flex flex-shrink-0 items-center justify-center bg-red-200 h-12 w-12 rounded">
            <FaTrashRestore className="w-6 h-6 text-red-700" />
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-300">Rapports rejetés</span>
              <span className="text-red-500 text-sm font-semibold ml-2">
                {reportData.rejectedReports}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
