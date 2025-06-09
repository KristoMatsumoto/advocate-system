import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import ViewField from "../components/ViewField";
import Loader from "../components/Loader";
import CaseFormEdit from "../components/CaseFormEdit";
import CollaborationsForm from "../components/CollaborationsForm";
import MediaList from "../components/MediaList";
import MediaItem from "../components/MediaItem";
import Forbidden from "./Forbidden";

export default function CasePage() {
    const { user } = useContext(AuthContext);
    const id = useParams().id;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [forbidden, setForbidden] = useState(null);
    const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
    const [mediaList, setMediaList] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const handleNewMedia = (newMedia) => {
        setMediaList((prev) => [...prev, newMedia]);
    };

    useEffect(() => {
        setLoading(true);
        api.get(`/cases/${id}`)
            .then((res) => { setData(res.data); setMediaList(res.data.media); })
            .catch((err) => {
                if (err.response?.status === 403) setForbidden(true);
                else setError("Failed to load case data.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (forbidden) return <Forbidden />;
    if (loading) return <Loader />;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!data) return null;

    return (
        <>            
            <Box sx={{ mx: 5, mt: 4 }}>
                {editMode ? (
                    <CaseFormEdit caseData={data} onSuccess={(updated) => { setData(updated); setEditMode(false); }} />
                ) : (
                    <Stack spacing={2} sx={{ pt: 4 }}>
                        <Typography variant="h6">Case Information</Typography>
                        <ViewField label="Title" value={data.title} />
                        <ViewField label="Lawyer" value={`${data.lawyer.name} ${data.lawyer.surname} (${data.lawyer.email})`} />
                        <ViewField label="Case Number" value={data.case_number} />
                        <ViewField label="Client Name" value={data.client_name} />
                        <ViewField label="Court" value={data.court} />
                        <ViewField label="Start Date" value={data.start_date} />
                        <ViewField label="End Date" value={data.end_date || "—"} />
                        <ViewField label="Description" value={data.description || "—"} />
                    </Stack>
                )}
                {(user.id === data.lawyer.id) && (
                    <Stack spacing={2} sx={{ pb: 4, my: 2 }}>
                        <Button onClick={() => setEditMode(!editMode)} variant="outlined">
                            {editMode ? "Cancel" : "Edit Case"}
                        </Button>
                    </Stack>
                )}
                
                {(user.id === data.lawyer.id || user.role === "admin") && (<CollaborationsForm caseData={data}/>)}
            </Box>
            
            <Box className="container" sx={{ py: 4, mx: 5 }}>
                <Button onClick={() => setMediaDialogOpen(true)} variant="outlined">
                    New media
                </Button>
            </Box>
            
            {mediaDialogOpen && (
                <Box sx={{ mx: "auto" }}>
                    <MediaItem
                        isNew
                        caseId={data.id}
                        item={{ attachments: [] }}
                        onUpdate={handleNewMedia}
                        onClose={() => setMediaDialogOpen(false)}
                    />
                </Box>
            )}

            <MediaList mediaList={mediaList} setMediaList={setMediaList} />
        </>
    );
}
