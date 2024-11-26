import { useEffect, useState } from 'react';
import { register } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Container, Grid, Typography, TextField, Button, Box, Alert } from '@mui/material';
import myImage from '../../src/logo/Asos_img.jpg';


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setPassword2('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            setError('Passwords do not match');
            return;
        }
        const { error } = await register(username, password, password2);
        if (error) {
            setError(JSON.stringify(error));
        } else {
            navigate('/');
            resetForm();
        }
    };

    return (
        <div style={{ 
            backgroundColor: '#3498db', 
            width: '100vw', 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
        }}>
            <Container component="main" maxWidth="lg" style={{ padding: 0 }}>
                <Grid container>
                    <Grid item xs={12} md={6} style={{ backgroundColor: '#e6f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={myImage} alt="Welcome illustration" style={{ maxWidth: '100%', height: 'auto' }} />

                        <img src="/placeholder.svg?height=400&width=400" alt="Welcome illustration" style={{ maxWidth: '100%', height: 'auto' }} />
                    </Grid>
                    <Grid item xs={12} md={6} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box 
                            component="form" 
                            onSubmit={handleSubmit} 
                            noValidate 
                            style={{ backgroundColor: '#f5f5f5', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                        >
                            <Typography variant="h4" component="h1" gutterBottom align="center">
                                Register
                            </Typography>
                            <Typography variant="body1" color="textSecondary" paragraph align="center">
                                Create your account
                            </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="username"
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                margin="normal"
                                required
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="confirm-password"
                                label="Confirm Password"
                                type="password"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                margin="normal"
                                required
                            />
                            {password2 !== password && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    Passwords do not match
                                </Alert>
                            )}
                            {error && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Register
                            </Button>
                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <Typography variant="body1" color="textSecondary">
                                    Already have an account? <a href="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>Log in</a>
                                </Typography>
                            </div>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default Register;
