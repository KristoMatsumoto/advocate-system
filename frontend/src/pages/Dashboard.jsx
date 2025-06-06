import { useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext'
import { Box, Typography, Button } from "@mui/material";
import Loader from "../components/Loader";

export default function Dashboard() {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) return <Loader />;
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Welcome, {user?.name}</Typography>
      <Typography variant="body1" mb={4}>You are logged in as: <strong>{user?.role}</strong></Typography>

      <Button variant="outlined" color="secondary" onClick={logout}>Logout</Button>
    </Box>
  );
}