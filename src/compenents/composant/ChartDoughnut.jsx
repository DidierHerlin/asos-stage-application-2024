import React, { useEffect, useState } from "react";
import { TEChart } from "tw-elements-react";
import { ResponsiveContainer } from "recharts";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

export default function ChartDoughnut() {
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);


  const isAccessTokenExpired = (token) => {
    try {
      const { exp } = jwt_decode(token);
      return exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const getRefreshToken = async () => {
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) throw new Error("No refresh token available");

    try {
      const response = await axios.post("http://localhost:8000/api/token/refresh/", {
        refresh: refreshToken,
      });
      const { access, refresh } = response.data;

      Cookies.set("access_token", access, { expires: 1, secure: true });
      Cookies.set("refresh_token", refresh, { expires: 7, secure: true });

      return access;
    } catch (error) {
      console.error("Token refresh error:", error);
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      throw error;
    }
  };

  const getValidToken = async () => {
    let accessToken = Cookies.get("access_token");
    if (!accessToken || isAccessTokenExpired(accessToken)) {
      accessToken = await getRefreshToken();
    }
    return accessToken;
  };

  const fetchStatusData = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getValidToken();
      const response = await axios.get("http://localhost:8000/api/rapports/statut-count/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setStatusData(response.data);
    } catch (error) {
      console.error("Error fetching status data:", error);
      setError("Failed to load status data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  const chartLabels = statusData.map((data) => {
    switch (data.statut) {
      case 1:
        return "Validé";
      case 0:
        return "Rejeté";
      case 2:
        return "En attente";
      default:
        return data.statut;
    }
  });

  const counts = statusData.map((data) => data.nombre_rapports);

  const backgroundColors = statusData.map((data) => {
    switch (data.statut) {
      case 1:
        return "rgba(0, 128, 0, 0.5)"; // Vert pour Validé
      case 0:
        return "rgba(255, 0, 0, 0.5)"; // Rouge pour Rejeté
      case 2:
        return "rgba(255, 193, 7, 0.5)"; // Jaune pour En attente
      default:
        return "rgba(128, 128, 128, 0.5)"; // Gris par défaut
    }
  });

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Nombre de statuts",
        data: counts,
        backgroundColor: backgroundColors,
      },
    ],
  };

  return (
    <div className="w-1/3 p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-gray-200">
      <ResponsiveContainer width="100%" height="100%">
        <TEChart
          type="doughnut"
          data={chartData}
          options={{
            plugins: {
              legend: {
                labels: {
                  color: isDarkMode ? "#D1D5DB" : "#374151", // Gris clair pour sombre, gris foncé pour clair
                },
              },
            },
            maintainAspectRatio: false,
            backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF", // Fond sombre ou clair
            borderColor: isDarkMode ? "#4B5563" : "#E5E7EB", // Bordure adaptée
          }}
        />
      </ResponsiveContainer>
    </div>
  );
}
