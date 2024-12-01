// src/components/CardUser.js
import React, { useEffect, useState } from 'react';
import { SiVirustotal } from 'react-icons/si';
import { CgSearchLoading } from 'react-icons/cg';
import { GrValidate } from 'react-icons/gr';
import { FaTrashRestore } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie'; // Assurez-vous d'importer js-cookie

export default function CardUser() {
  const [stats, setStats] = useState({
    total_rapports: 0,
    validés_count: 0,
    rejetés_count: 0,
    en_attente_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // État pour gérer les erreurs

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = Cookies.get('access_token'); // Récupération du token depuis les cookies
        const response = await axios.get('http://127.0.0.1:8000/api/RapportApp/rapports/stats/', {
          headers: { 'Authorization': `Bearer ${token}` }, // Ajout de l'en-tête d'autorisation
        });
        setStats(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
        setError('Erreur lors de la récupération des statistiques.'); // Gestion de l'erreur
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
                {stats.total_rapports}
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
                {stats.en_attente_count}
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
                {stats.validés_count}
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
                {stats.rejetés_count}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
