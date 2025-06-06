import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Button, Modal} from "@mui/material";
import api from "../api/axios";
import { CaseContext } from '../context/CaseContext'
import Loader from "../components/Loader";
import CaseFormEdit from "../components/CaseFormEdit";
import MediaUploadForm from "../components/MediaUploadForm";
import MediaList from "../components/MediaList";

export default function CasePage() {
    // const { caseData, loading, error } = useContext(CaseContext);

    const id = useParams().id;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
    const [mediaList, setMediaList] = useState([]);
    const navigate = useNavigate();

    const handleNewMedia = (newMedia) => {
        setMediaList((prev) => [...prev, newMedia]);
    };

    useEffect(() => {
        api.get(`/cases/${id}`)
            .then((res) => { setData(res.data); setMediaList(res.data.media); })
            .catch(() => setError("Could not load case data"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Loader />;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!data) return null;

    return (
        <>
            {/* <h2>{data.title}</h2>
            <p><strong>Number:</strong> {data.case_number}</p>
            <p><strong>Client:</strong> {data.client_name}</p>
            <p><strong>Start:</strong> {data.start_date}</p>
            <p><strong>End:</strong> {data.end_date || "—"}</p>
            <p><strong>Court:</strong> {data.court}</p>
            <p><strong>Description:</strong> {data.description}</p>
            */}

            <CaseFormEdit caseData={data} onSuccess={() => navigate('/cases')} />
            
            <Button onClick={() => setMediaDialogOpen(true)} variant="outlined">
                New media
            </Button>

            <MediaList mediaList={mediaList} setMediaList={setMediaList} />
            
            <Modal open={mediaDialogOpen} onClose={() => setMediaDialogOpen(false)}>
                <MediaUploadForm
                    caseId={data.id}
                    onUpload={handleNewMedia}
                />
            </Modal>
        </>
    );
}