import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function AppHeader() {
    return (
        <AppBar position="static" color="primary" sx={{ mb: 4 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>LegalDesk</Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button component={RouterLink} to="/" color="inherit">Home</Button>
                    <Button component={RouterLink} to="/cases" color="inherit">Cases</Button>
                    <Button component={RouterLink} to="/staff" color="inherit">Staff</Button>
                    <Button component={RouterLink} to="/profile" color="inherit">Profile</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
