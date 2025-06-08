import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Button, Stack, TextField, Typography, Autocomplete } from "@mui/material";
import Loader from "./Loader";

export default function CollaborationsForm({ caseData }) {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleSave = () => {
        setError(null);
        setSuccess(null);
        setLoading(true);
        Promise.all([
            api.patch(`/cases/${caseData.id}/collaboration`, { user_ids: selectedUsers.map(u => u.id) }), 
            api.get(`/cases/${caseData.id}/collaboration/available_users`)
        ])
            .then((res) => { setSelectedUsers(res[0].data.collaborators); setAvailableUsers(res[1].data.available_users); setSuccess("Collaborators are added successfuly."); })
            .catch((err) => { setError("Cannot save collaborators."); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { if (user.id === caseData.lawyer.id || user.role === "admin") {
        setError(null);
        setSuccess(null);
        setLoading(true);
        Promise.all([
            api.get(`/cases/${caseData.id}/collaboration`), 
            api.get(`/cases/${caseData.id}/collaboration/available_users`)
        ])
            .then((res) => { setSelectedUsers(res[0].data.collaborators); setAvailableUsers(res[1].data.available_users); })
            .catch((err) => { setError("Cannot load collaborators."); })
            .finally(() => setLoading(false));
        
    }}, [caseData.id, user.id, user.role]);

    return (
        <>
            {success && <Typography color="success.main" mt={2}>{success}</Typography>}
            {error && <Typography color="error.main" mt={2}>{error}</Typography>}

            {loading ? (
                <Loader />
            ) : (
                <Stack spacing={2} sx={{ py: 4, mt: 2, mb: 2 }}>
                    <Autocomplete
                        sx={{ mt: 4 }}
                        multiple
                        options={availableUsers.concat(selectedUsers).filter((value, index, array) => { return array.indexOf(value) === index })}
                        getOptionLabel={(option) => `${option.name} ${option.surname} (${option.email})`}
                        value={selectedUsers}
                        onChange={(_, newValue) => setSelectedUsers(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Collaborators" placeholder="Add users" />
                        )}
                    />
                    <Button onClick={handleSave} variant="contained">Save collaboration</Button>
                </Stack>
            )}
        </>
    );
}
