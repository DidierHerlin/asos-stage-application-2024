import React, { useEffect, useState } from 'react';
import { Search, Bell, User, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from '../utils/auth';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, Toaster } from 'sonner';

export default function HorizontalNavbar({ isDarkMode, toggleDarkMode }) {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false); // Controls notifications tooltip
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchNotifications = async () => {
        try {
            const accessToken = Cookies.get('access_token');
            if (!accessToken) {
                console.error("Token d'accès non trouvé.");
                return;
            }

            const response = await axios.get('http://localhost:8000/api/notifications/', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Identifiez les nouvelles notifications non lues
            const newNotifications = response.data.filter(notification => !notification.is_read);

            // Affichez chaque nouvelle notification non lue avec `toast`
            if (newNotifications.length > notifications.filter(n => !n.is_read).length) {
                newNotifications.forEach(notification => {
                    toast(notification.message); // Affichez le message de notification dans un toast
                });
            }

            setNotifications(response.data);
            console.log("Notifications récupérées:", response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleClickOpen = () => {
        fetchNotifications(); // Refresh notifications on open
        setOpen(!open);
    };

    const markNotificationAsRead = async (id) => {
        const accessToken = Cookies.get('access_token');
        if (!accessToken) {
            console.error("Token d'accès non trouvé.");
            return;
        }

        try {
            await axios.post(`http://localhost:8000/api/notifications/${id}/mark-as-read/`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            setNotifications((prevNotifications) =>
                prevNotifications.map(notification =>
                    notification.id === id ? { ...notification, is_read: true } : notification
                )
            );
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la notification:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Erreur de déconnexion:', error);
        }
    };

    const unreadNotifications = notifications.filter(notification => !notification.is_read);

    return (
        <>
            {/* Toaster pour afficher les notifications toast */}
            <Toaster />
            <div className={`w-full h-16 flex justify-between items-center px-4 ${isDarkMode ? "bg-gray-900" : "bg-gray-300"} text-white`}>
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${isDarkMode ? "text-gray-400" : "text-gray-500"} w-5 h-5`} />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className={`pl-8 pr-2 py-1 rounded-md w-full ${isDarkMode ? "bg-gray-700 text-gray-300 placeholder-gray-400" : "bg-white text-gray-700 placeholder-gray-500"} focus:outline-none`}
                    />
                </div>

                {/* Icons on the right side */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <div className="relative cursor-pointer hover:text-gray-200" onClick={handleClickOpen}>
                        <div className={`relative ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} p-2 rounded-lg`}>
                            <Bell className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-gray-800"}`} />
                            {unreadNotifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {unreadNotifications.length}
                                </span>
                            )}
                        </div>

                        {/* Tooltip */}
                        {open && (
                            <div className={`absolute right-0 top-full mt-2 w-48 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"} rounded-md shadow-lg py-1 z-10`}>
                                {unreadNotifications.length === 0 ? (
                                    <div className="px-4 py-2 text-center">Aucune nouvelle notification</div>
                                ) : (
                                    unreadNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                            onClick={() => markNotificationAsRead(notification.id)}
                                        >
                                            {notification.message}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* User Profile */}
                    <div className="relative cursor-pointer hover:text-gray-200 group">
                        <div className={`w-8 h-8 ${isDarkMode ? "bg-blue-500" : "bg-gray-300"} rounded-full flex items-center justify-center`}>
                            <User className={`w-5 h-5 ${isDarkMode ? "text-white" : "text-gray-800"}`} />
                        </div>
                        {/* Dropdown Menu */}
                        <div className={`absolute right-0 top-full mt-2 w-48 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"} rounded-md shadow-lg py-1 hidden group-hover:block`}>
                            <a href="/profil" className="block px-4 py-2 hover:bg-gray-100">Mon Profile</a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100">Paramètres</a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLogout}>Déconnexion</a>
                        </div>
                    </div>

                    {/* Dark/Light Mode Toggle */}
                    <div className="cursor-pointer hover:text-gray-200" onClick={toggleDarkMode}>
                        {isDarkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-gray-500" />}
                    </div>
                </div>
            </div>
        </>
    );
}
