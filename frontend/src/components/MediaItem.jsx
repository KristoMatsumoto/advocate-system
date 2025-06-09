import { useState, useContext } from "react";
import { Box, Button, Card, CardContent, Typography, TextField, Grid, Stack, IconButton, ImageListItem, Modal } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AddCommentIcon from '@mui/icons-material/AddComment';
import api from "../api/axios";
import { useFormik } from "formik";
import { AuthContext } from "../context/AuthContext";
import * as Yup from "yup";
import RenderFile from "./RenderFile";

export default function MediaItem({ item, onUpdate, onDelete }) {
    const { user } = useContext(AuthContext);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [removedFiles, setRemovedFiles] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [previewFiles, setPreviewFiles] = useState([]);

    const formik = useFormik({
        initialValues: {
            title: item.title || "",
            description: item.description || "",
            files: []
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Title is required"),
            description: Yup.string()
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("media[title]", values.title);
            formData.append("media[description]", values.description || "");
            
            item.attachments
                .filter(a => !removedFiles.includes(a.id))
                .forEach(a => {
                    if (a.signed_id)  formData.append("media[files][]", a.signed_id);
                });
            newFiles.forEach((file) => { formData.append("media[files][]", file); });
            
            api.patch(`/media/${item.id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
            .then((res) => { 
                onUpdate(res.data); 
                setEditing(false); 
                setRemovedFiles([]); 
                setNewFiles([]);
                setPreviewFiles([]);
                setError(null); })
            .catch((err) => setError("Failed to save changes"));
        }
    });

    const handleDelete = () => {
        api.delete(`/media/${item.id}`)
            .then((res) => { onDelete(item.id); setError(null); })
            .catch((err) => { setError("Failed to delete media"); });
    };

    const toggleRemoveFile = (id) => {
        setRemovedFiles((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleFilesChange = (e) => {
        const selected = Array.from(e.target.files);

        const updatedFiles = [...newFiles, ...selected];
        setNewFiles(updatedFiles);

        const updatedPreviews = updatedFiles.map((file) => ({
            ...file,
            content_type: file.type,
            name: file.name,
            url: URL.createObjectURL(file),
        }));
        setPreviewFiles(updatedPreviews);
    };

    const handleRemoveNewFile = (index) => {
        const updated = newFiles.filter((_, i) => i !== index);
        setNewFiles(updated);

        const updatedPreviews = updated.map((file) => ({
            ...file,
            content_type: file.type,
            name: file.name,
            url: URL.createObjectURL(file),
        }));
        setPreviewFiles(updatedPreviews);
    };

    const attachments = item.attachments?.filter(a => !removedFiles.includes(a.id)) || [];

    return (
        <Card sx={{ my: 2 }}>
            <CardContent>
                {editing ? (
                    <form onSubmit={formik.handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                label="Title"
                                name="title"
                                fullWidth
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                fullWidth
                                multiline
                                rows={3}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                            />

                            <Box mt={2}>
                                <Button variant="outlined" component="label">
                                    Select files
                                    <input type="file" hidden multiple onChange={handleFilesChange} />
                                </Button>

                                <Grid container spacing={2} mt={1}>
                                    {previewFiles.map((file, index) => (
                                        <Grid key={`new-${index}`}>
                                            <RenderFile
                                                file={file}
                                                editing={true}
                                                onRemove={() => handleRemoveNewFile(index)}
                                            />
                                        </Grid>
                                    ))}
                                    {attachments && (
                                        <Grid container spacing={2}>{attachments.map((file, index) => { 
                                            return <RenderFile 
                                                key={file.id || `${file.name}-${index}`} 
                                                file={file} 
                                                editing={editing} 
                                                onRemove={() => { toggleRemoveFile(file.id) }}
                                            /> 
                                        })}</Grid>
                                    )}
                                </Grid>
                            </Box>

                            {error && <Typography color="error">{error}</Typography>}

                            <Stack direction="row" spacing={2}>
                                <Button type="submit" variant="contained" startIcon={<SaveIcon />}>Save</Button>
                                <Button onClick={() => { setEditing(false); setRemovedFiles([]); }} startIcon={<CloseIcon />}>Cancel</Button>
                                <Button onClick={handleDelete} color="error" variant="outlined" startIcon={<DeleteIcon />}>Delete</Button>
                            </Stack>
                        </Stack>
                    </form>
                ) : (
                    <>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ top: 8, right: 16 }}
                        >
                            {item.user ? `${item.user.name} ${item.user.surname}` : "Unknown author"}
                        </Typography>
                        <Stack direction="row" justifyContent="space-between">
                            <Box>
                                <Typography variant="h6">{item.title}</Typography>
                                <Typography variant="body2">{item.description || "No description"}</Typography>
                            </Box>
                            {user.id === item.user.id && <IconButton onClick={() => setEditing(true)}><EditIcon /></IconButton>}
                        </Stack>

                        <Box mt={2}>
                            <Grid container spacing={2}>
                                {attachments.map((file, index) => { 
                                    return <RenderFile 
                                        key={file.id || `${file.name}-${index}`} 
                                        file={file} 
                                        editing={editing} 
                                        onRemove={() => { return }}
                                    />
                                })}
                            </Grid>
                        </Box>
                    </>
                )}
            </CardContent>            
        </Card>
    );
}
