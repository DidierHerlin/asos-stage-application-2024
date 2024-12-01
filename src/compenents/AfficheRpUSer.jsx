import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import Cookies from 'js-cookie';

const AfficheRpUSer = () => {
  const [reportData, setReportData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false); // Assurez-vous de gérer le mode sombre
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = Cookies.get('access_token'); // Récupération du token depuis les cookies
        if (!token) throw new Error("Token non trouvé.");

        const response = await axios.get('http://127.0.0.1:8000/api/RapportApp/rapports/stats/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Transformation des données API pour le graphique
        const stats = response.data;
        const chartData = [
          { month: 'Total', count: stats.total_rapports },
          { month: 'Validés', count: stats.validés_count },
          { month: 'Rejetés', count: stats.rejetés_count },
          { month: 'En attente', count: stats.en_attente_count },
        ];

        setReportData(chartData);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
        setError("Erreur lors de la récupération des statistiques.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-white dark:bg-gray-800 rounded">
        <p className="text-gray-800 dark:text-gray-200">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[480px] me-4 p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-gray-200" >
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
        Statistiques des Rapports
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={reportData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? '#4B5563' : '#E5E7EB'}
            className="opacity-30"
          />
          <XAxis
            dataKey="month"
            tick={{ fill: isDarkMode ? '#D1D5DB' : '#374151' }}
            className="text-sm"
          />
          <YAxis
            tick={{ fill: isDarkMode ? '#D1D5DB' : '#374151' }}
            className="text-sm"
            tickFormatter={(value) => Math.round(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#1F2937' : 'white',
              color: isDarkMode ? '#D1D5DB' : '#374151',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            itemStyle={{
              color: isDarkMode ? '#D1D5DB' : '#374151',
            }}
          />
          <Legend
            wrapperStyle={{
              color: isDarkMode ? '#D1D5DB' : '#374151',
            }}
          />
          <Bar
            dataKey="count"
            fill={isDarkMode ? '#4F46E5' : '#6366F1'}
            radius={[4, 4, 0, 0]}
            name="Nombre de Rapports"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AfficheRpUSer;
