import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Select, MenuItem, Button } from '@mui/material';
import api from '../api/axios';
import Loader from '../components/Loader';
import Forbidden from "./Forbidden";

export default function CollaborationsPage() {
    const caseId = useParams().id;
    const [collaborators, setCollaborators] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [error, setError] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [forbidden, setForbidden] = useState(null);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [owner, setOwner] = useState({}); 

    const fetchCollaborators = () => {
        setLoading(true);
        setError(null);
        api.get(`/cases/${caseId}/collaboration`)
            .then((res) => {
                setOwner(res.data.owner);
                setCollaborators(res.data.collaborators);
                setError(null);
            })
            .catch((err) => {
                if (err.response?.status === 403) setForbidden(true);
                else setError('Error loading data');
            });
        api.get(`/cases/${caseId}/collaboration/available_users`)
            .then((res) => { setAvailableUsers(res.data.available_users); })
            .catch((err) => {
                if (err.response?.status === 403) setForbidden(true);
                else setError('Error loading data');
            })
            .finally(() => setLoading(false));
    }
    useEffect(() => fetchCollaborators(), [caseId]);

    const handleAdd = () => {
        api.post(`/cases/${caseId}/collaboration`, { user_ids: selected })
        .then(() => { setSelected([]); fetchCollaborators(); setUpdateError(null); setSuccess("Collaborators are added succesfuly."); })
        .catch((err) => { setUpdateError('Such get wrong.'); setSuccess(null); })
    };
    const handleRemove = (userId) => {
        api.delete(`/cases/${caseId}/collaboration`, { data: { user_id: userId } })
        .then((res) => { fetchCollaborators(); setUpdateError(null); setSuccess("Collaborators are removed succesfuly"); })
        .catch((err) => { setUpdateError('Such get wrong.'); setSuccess(null); })
    };

    if (forbidden) return <Forbidden />;
    if (loading) return <Loader />;
    if (error) return <Typography color="error">{error}</Typography>

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>Manage Case Collaborators</Typography>

            {success && <Typography color="success.main" mt={2}>{success}</Typography>}
            {updateError && <Typography color="error.main" mt={2}>{updateError}</Typography>}
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Surname</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                            <TableCell>{owner.surname}</TableCell>
                            <TableCell>{owner.name} {owner.second_name}</TableCell>
                            <TableCell>{owner.email}</TableCell>
                            <TableCell>{owner.role}</TableCell>
                            <TableCell>Owner</TableCell>
                        </TableRow>
                        {collaborators.map(user => (
                            <TableRow key={user.id} sx={user.id === owner?.id ? { backgroundColor: '#f5f5f5' } : {}}>
                                <TableCell>{user.surname}</TableCell>
                                <TableCell>{user.name} {user.second_name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button color="error" onClick={() => handleRemove(user.id)}>Remove</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Box mt={4} display="flex" alignItems="center" gap={2}>
                <Select
                    multiple
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    displayEmpty
                    sx={{ minWidth: 300 }}
                >
                    {availableUsers.map(user => (
                        <MenuItem key={user.id} value={user.id}>
                            {user.surname} {user.name} ({user.email})
                        </MenuItem>
                    ))}
                </Select>
                <Button variant="contained" onClick={handleAdd} disabled={!selected.length}>Add</Button>
            </Box>
        </Box>
    );
}
