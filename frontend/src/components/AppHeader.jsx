import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function AppHeader() {
    return (
        <AppBar position="static" color="primary" sx={{ mb: 4 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>LegalDesk</Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button component={Link} to="/" color="inherit">Home</Button>
                    <Button component={Link} to="/cases" color="inherit">Cases</Button>
                    <Button component={Link} to="/staff" color="inherit">Staff</Button>
                    <Button component={Link} to="/profile" color="inherit">Profile</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
