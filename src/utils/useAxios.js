import axios from 'axios';
import { getRefreshToken, isAccessTokenExpired, setAuthUser } from './auth';
import { API_BASE_URL } from './constants';
import Cookies from 'js-cookie';

// Créer une instance d'Axios
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(async (req) => {
    try {
        let accessToken = Cookies.get('access_token');
        const refreshToken = Cookies.get('refresh_token');

        if (!accessToken || isAccessTokenExpired(accessToken)) {
            if (refreshToken) {
                const { access, refresh } = await getRefreshToken(refreshToken);
                accessToken = access;
                setAuthUser(accessToken, refresh);
            } else {
                throw new Error('Pas de token de rafraîchissement disponible');
            }
        }

        if (accessToken) {
            req.headers.Authorization = `Bearer ${accessToken}`;
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du token:', error.message);
        window.location.href = '/login';
    }
    return req;
}, (error) => {

    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
    response => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Accès non autorisé, redirection vers la page de login');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
