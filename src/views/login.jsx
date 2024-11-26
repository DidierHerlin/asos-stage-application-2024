import { useEffect, useState } from 'react';
import { login } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Container, Grid, Typography, TextField, Button, Box, Alert, FormControlLabel, Checkbox } from '@mui/material';
import { FaFacebookF, FaTwitter } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import myImage from '../../src/logo/Asos_img.jpg'; // Ensure this path is correct

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    // Redirect user if already logged in
    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setError('');
    };

    // Handle form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        const { data, error } = await login(username, password);
    
        if (error) {
            setError(error);
        } else {
            useAuthStore.getState().setUser(data); // Store user data in auth store
            // Redirect based on user role
            if (data.is_superuser) {
                navigate('/dashboard'); // Redirect admin to dashboard
            } else {
                navigate('/dashboard_user'); // Redirect user to user dashboard
            }
            resetForm();
        }
    };

    return (
        <div style={{ backgroundColor: '#3498db', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Container component="main" maxWidth="lg" style={{ padding: 0 }}>
                <Grid container>
                    <Grid item xs={12} md={6} style={{ backgroundColor: '#e6f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={myImage} alt="Welcome illustration" style={{ maxWidth: '100%', height: 'auto' }} />
                    </Grid>
                    <Grid item xs={12} md={6} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box 
                            component="form" 
                            onSubmit={handleLogin} 
                            noValidate 
                            style={{ backgroundColor: '#f5f5f5', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                        >
                            <Typography variant="h4" component="h1" gutterBottom align="center">
                                Se connecter
                            </Typography>
                            <Typography variant="body1" color="textSecondary" paragraph align="center">
                                Bienvenue
                            </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="username"
                                label="Nom utilisateur"
                                value={username}
                                type='email'
                                onChange={(e) => setUsername(e.target.value)}
                                margin="normal"
                                required
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="password"
                                label="Mot de passe"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                required
                            />
                            {error && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0' }}>
                                <FormControlLabel
                                    control={<Checkbox color="primary" />}
                                    label="Rester connecté"
                                />
                                <a href="#" style={{ color: '#1976d2', textDecoration: 'none' }}>Mot de passe oublié?</a>
                            </div>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                LOGIN
                            </Button>
                           
                            
                           
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default Login;
