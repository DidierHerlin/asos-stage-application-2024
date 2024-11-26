import { Box, Typography, Container } from '@mui/material';

const LoggedOutView = ({ title }) => {
    return (
        <Container maxWidth="xs">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    You have successfully logged out.
                </Typography>
            </Box>
        </Container>
    );
};

export default LoggedOutView;
