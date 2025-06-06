import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="80vh"
            textAlign="center"
        >
            <Typography variant="h2" color="error" gutterBottom>404</Typography>
            <Typography variant="h5" gutterBottom>Page Not Found</Typography>
            <Typography variant="body1" mb={3}>The page you're looking for doesn't exist or was moved.</Typography>
            <Button variant="contained" component={Link} to="/">Go Home</Button>
        </Box>
    );
}
