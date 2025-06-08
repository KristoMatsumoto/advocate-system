import { Box, Button, TextField, Typography, Paper, Stack, Grid } from "@mui/material";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/axios";
import RenderFile from "./RenderFile";

export default function MediaUploadForm({ caseId, onUpload, onClose }) {
    const [loadError, setLoadError] = useState(null);
    const [previewFiles, setPreviewFiles] = useState([]);

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            files: []
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Title is required"),
            description: Yup.string(),
            files: Yup.array().min(1, "Please select at least one file")
        }),
        onSubmit: (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("media[title]", values.title);
            formData.append("media[description]", values.description);
            for (let file of values.files) {
                formData.append("media[files][]", file);
            }

            api.post(`/cases/${caseId}/media`, formData, { headers: { "Content-Type": "multipart/form-data" } })
                .then((res) => { onUpload(res.data); resetForm(); setPreviewFiles([]); onClose() })
                .catch((err) => { setLoadError("Error uploading media"); });
        }
    });

    const generatePreviews = (files) => files.map(file => {
        if (file.url) return file;
        return {
            ...file,
            content_type: file.type,
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type
        };
    });

    const handleFilesChange = (e) => {
        const newFiles = Array.from(e.target.files);
        e.target.value = null;

        const updatedFileList = [...formik.values.files, ...newFiles];
        formik.setFieldValue("files", updatedFileList);

        setPreviewFiles(generatePreviews(updatedFileList));
    };
    
    const handleRemoveFile = (indexToRemove) => {
        const updatedFiles = formik.values.files.filter((_, i) => i !== indexToRemove);
        formik.setFieldValue("files", updatedFiles);

        setPreviewFiles(generatePreviews(updatedFiles));
    };

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 4, mx: 4 }}>
            <Typography variant="h6" gutterBottom>Upload Media</Typography>

            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
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

                    <Box>
                        <Button
                            variant="outlined"
                            component="label"
                        >
                            Select files
                            <input
                                type="file"
                                hidden
                                multiple
                                onChange={handleFilesChange}
                            />
                        </Button>

                        {formik.touched.files && formik.errors.files && (
                            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                {formik.errors.files}
                            </Typography>
                        )}

                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                {previewFiles.map((file, index) => (
                                    <Grid key={index}>
                                        <RenderFile
                                            file={file}
                                            editing={true}
                                            onRemove={() => handleRemoveFile(index)}
                                            onPreview={() => setPreviewFiles({ fileType: ext, filePath: fullUrl })}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    </Box>

                    {formik.touched.files && formik.errors.files && (
                        <Typography variant="body2" color="error">{formik.errors.files}</Typography>
                    )}

                    {loadError && (
                        <Typography color="error" variant="body2">{loadError}</Typography>
                    )}

                    <Stack direction="row" spacing={2}>
                        <Button onClick={() => { onClose(); }}>Cancel</Button>
                        <Button variant="contained" type="submit">Upload</Button>
                    </Stack>
                </Stack>
            </Box>
        </Paper>
    );
}
