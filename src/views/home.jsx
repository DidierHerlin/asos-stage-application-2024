import { Container, Box, Typography, Button } from '@mui/material';
import { useAuthStore } from '../store/auth';
import { Link } from 'react-router-dom';

const Home = () => {
    const [isLoggedIn, user] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user,
    ]);

    return (
        <Container maxWidth="md">
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                {isLoggedIn() ? (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Welcome {user().username}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Button
                                component={Link}
                                to="/private"
                                variant="contained"
                                color="primary"
                                sx={{ mr: 2 }}
                            >
                                Private
                            </Button>
                            <Button
                                component={Link}
                                to="/logout"
                                variant="contained"
                                color="secondary"
                            >
                                Logout
                            </Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Home
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Button
                                component={Link}
                                to="/login"
                                variant="contained"
                                color="primary"
                                sx={{ mr: 2 }}
                            >
                                Login
                            </Button>
                            <Button
                                component={Link}
                                to="/register"
                                variant="contained"
                                color="secondary"
                            >
                                Register
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default Home;
