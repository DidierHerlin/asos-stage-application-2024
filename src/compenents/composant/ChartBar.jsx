import React, { useEffect, useState } from "react";
import { TEChart } from "tw-elements-react";
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
import axios from "axios";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

export default function ChartBar() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the access token has expired
  const isAccessTokenExpired = (token) => {
    try {
      const { exp } = jwt_decode(token);
      return exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // Fetch new access token using refresh token
  const getRefreshToken = async () => {
    const refreshToken = Cookies.get('refresh_token');
    if (!refreshToken) throw new Error('No refresh token available');

    try {
      const response = await axios.post('http://localhost:8000/api/token/refresh/', {
        refresh: refreshToken,
      });
      const { access, refresh } = response.data;

      // Update cookies with new tokens
      Cookies.set('access_token', access, { expires: 1, secure: true });
      Cookies.set('refresh_token', refresh, { expires: 7, secure: true });

      return access;
    } catch (error) {
      console.error("Error refreshing token:", error);
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      throw error;
    }
  };

  // Retrieve a valid access token
  const getValidToken = async () => {
    let accessToken = Cookies.get('access_token');
    if (!accessToken || isAccessTokenExpired(accessToken)) {
      accessToken = await getRefreshToken();
    }
    return accessToken;
  };

  // Fetch report data from API
  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getValidToken();
      const response = await axios.get("http://localhost:8000/api/rapports/monthly-count/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Transform the response data for the chart
      const formattedData = Object.entries(response.data).map(([month, count]) => ({
        month,
        count,
      }));

      setReportData(formattedData);
    } catch (error) {
      console.error("Error fetching report data:", error);
      setError("Failed to load report data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  // Prepare data for the chart
  const labels = reportData.map(data => data.month);
  const counts = reportData.map(data => data.count);

  return (
    <div className="w-2/3
     h-[480px] me-4 p-4 bg-white rounded-lg shadow-lg">
  <h2 className="text-xl font-semibold mb-4 text-gray-800">Monthly Reports Analysis</h2>
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
      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
      <XAxis 
        dataKey="month" 
        className="text-sm"
      />
      <YAxis 
        className="text-sm"
        tickFormatter={(value) => Math.round(value)}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      />
      <Legend />
      <Bar
        dataKey="count"
        fill="#6366f1"
        radius={[4, 4, 0, 0]}
        name="Number of Reports"
      />
    </BarChart>
  </ResponsiveContainer>
</div>

  );
}
