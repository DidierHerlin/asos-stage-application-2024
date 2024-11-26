import { useAuthStore } from '../store/auth';
import axios from './axios';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';
const TOKEN_URL = 'token/';
const REFRESH_TOKEN_URL = 'token/refresh/';
const REGISTER_URL = 'register/';
const cookieOptions = {
    access: { expires: 1, secure: true },
    refresh: { expires: 7, secure: true }
};
const removeTokens = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
};

const getTokenExpiration = (token) => {
    const decodedToken = jwt_decode(token);
    return decodedToken.exp;
};

const handleError = (error) => ({
    data: null,
    error: error.response?.data?.detail || 'Something went wrong',
});




export const login = async (username, password) => {
    try {
      // Effectuer la requête pour obtenir le token
      const { data, status } = await axios.post(TOKEN_URL, { username, password });
  
      // Vérifier si le statut est 200
      if (status === 200) {
        // Enregistrer les tokens et logguer l'access token
        setAuthUser(data.access, data.refresh);
        console.log('Access Token:', data.access);  // Log access token
  
        // Obtenir les détails de l'utilisateur
        const userDetails = await axios.get('http://localhost:8000/api/users/me/', {
          headers: { Authorization: `Bearer ${data.access}` },
        });
  
        return { data: userDetails.data, error: null };
      }
  
      // Retourner une erreur si le statut n'est pas 200
      return { data: null, error: 'Login failed' };
  
    } catch (error) {
      // Gérer les erreurs et logguer le message d'erreur
      console.error('Error during login:', error);
      return handleError(error);
    }
  };
  



export const register = async (username, password, password2) => {
    try {
        const { data } = await axios.post(REGISTER_URL, { username, password, password2 });
        await login(username, password);
        return { data, error: null };
    } catch (error) {
        return handleError(error);
    }
};

export const logout = () => {
    removeTokens();
    useAuthStore.getState().setUser(null);
};

// Manage user and tokens
export const setAuthUser = (accessToken, refreshToken) => {
    Cookies.set('access_token', accessToken, cookieOptions.access);
    Cookies.set('refresh_token', refreshToken, cookieOptions.refresh);

    const user = jwt_decode(accessToken) ?? null;
    useAuthStore.getState().setUser(user);
    useAuthStore.getState().setLoading(false);
};

export const setUser = async () => {
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');

    if (!accessToken || !refreshToken) return;

    if (isAccessTokenExpired(accessToken)) {
        const response = await getRefreshToken();
        setAuthUser(response.access, response.refresh);
    } else {
        setAuthUser(accessToken, refreshToken);
    } 
};

export const getRefreshToken = async () => {
    const refreshToken = Cookies.get('refresh_token');
    const { data } = await axios.post(REFRESH_TOKEN_URL, { refresh: refreshToken });
    return data;
};

export const isAccessTokenExpired = (accessToken) => {
    try {
        return getTokenExpiration(accessToken) < Date.now() / 1000;
    } catch {
        return true;
    }
};

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await getRefreshToken();
                setAuthUser(response.access, response.refresh);
                return axios(originalRequest);
            } catch (err) {
                console.error('Failed to refresh token:', err);
                logout();
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);
