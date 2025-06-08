import { useState } from "react";
import FileViewer from "react-file-viewer";
import { Box, Button, Card, CardContent, Typography, TextField, Grid, Stack, IconButton, ImageListItem, Modal } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import api from "../api/axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import RenderFile from "./RenderFile";

export default function MediaItem({ item, onUpdate, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [removedFiles, setRemovedFiles] = useState([]);
    const [fileToView, setFileToView] = useState(null);
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
            // // values.removed_attachment_ids = [removedFiles]
            // // values.files = [ ...item.attachments.filter(a => !removedFiles.includes(a.id)), ...newFiles]
            // const formData = new FormData();
            // formData.append("media[title]", values.title);
            // formData.append("media[description]", values.description || "");
            
            // removedFiles.forEach((id) => { formData.append("media[removed_attachment_ids][]", id); });
            // // newFiles.forEach((file) => { formData.append("media[files][]", file); });
            // for (let file of newFiles) {
            //     formData.append("media[files][]", file);
            // }
            // // item.attachments
            // //     .filter(a => !removedFiles.includes(a.id))
            // //     .forEach(a => formData.append("media[files][]", a));
            
            // //     // Отладка: выведем содержимое FormData в консоль
            // // for (let pair of formData.entries()) {
            // //     console.log(pair[0], pair[1]);
            // // }
            
            // api.put(`/media/${item.id}`, { media: { ...values, removed_attachment_ids: removedFiles } }, { headers: { "Content-Type": "multipart/form-data" } })
            // .then((res) => { 
            //     onUpdate(res.data); 
            //     setEditing(false); 
            //     setRemovedFiles([]); 
            //     setNewFiles([]);
            //     setPreviewFiles([]);
            //     setError(null); })
            // .catch((err) => setError("Failed to save changes"));
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
                                                onPreview={() => setFileToView({ fileType: ext, filePath: fullUrl })}
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
                                                onPreview={() => setFileToView({ fileType: ext, filePath: fullUrl })}
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
                            <IconButton onClick={() => setEditing(true)}><EditIcon /></IconButton>
                        </Stack>

                        <Box mt={2}>
                            <Grid container spacing={2}>
                                {attachments.map((file, index) => { 
                                    return <RenderFile 
                                        key={file.id || `${file.name}-${index}`} 
                                        file={file} 
                                        editing={editing} 
                                        onRemove={() => { return }}
                                        onPreview={() => setFileToView({ fileType: ext, filePath: fullUrl })}
                                    />
                                })}
                            </Grid>
                        </Box>
                    </>
                )}
            </CardContent>

            {/* <Modal open={!!fileToView} onClose={() => setFileToView(null)}>
                <Box sx={{ width: "80vw", height: "80vh", margin: "auto", mt: "10vh", bgcolor: "white", p: 2 }}>
                    {fileToView && (
                        <FileViewer
                            fileType={fileToView.fileType}
                            filePath={fileToView.filePath}
                            onError={(e) => console.error("Viewer error:", e)}
                        />
                    )}
                </Box>
            </Modal> */}
        </Card>
    );
}
