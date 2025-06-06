import { Box, Button, TextField, Typography, Paper, Stack,  IconButton} from "@mui/material";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import api from "../api/axios";

export default function MediaUploadForm({ caseId, onUpload }) {
    const [loadError, setLoadError] = useState(null);

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
        onSubmit: async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("media[title]", values.title);
            formData.append("media[description]", values.description);
            for (let file of values.files) {
                formData.append("media[files][]", file);
            }

            api.post(`/cases/${caseId}/media`, formData, { headers: { "Content-Type": "multipart/form-data" } })
                .then((res) => { onUpload(res.data); resetForm(); })
                .catch((err) => { setLoadError("Error uploading media"); });
        }
    });

    const handleClose = () => {
        if (formik.values.title || formik.values.description || formik.values.files.length > 0) {
            const confirmed = window.confirm("Are you sure you want to close without saving?");
            if (!confirmed) return;
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 4, mr: 4, ml: 4, position: "relative" }}>
            <Typography variant="h6" gutterBottom>{"Upload Media"}
                {/* <IconButton
                    onClick={handleClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton> */}
            </Typography>

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

                    <input
                        type="file"
                        multiple
                        name="files"
                        onChange={(e) => formik.setFieldValue("files", Array.from(e.target.files)) }
                        style={{ marginTop: "8px" }}
                    />

                    {formik.touched.files && formik.errors.files && (
                        <Typography variant="body2" color="error">{formik.errors.files}</Typography>
                    )}

                    {formik.values.files.length > 0 && (
                        <Typography variant="body2">{formik.values.files.length} file(s) selected</Typography>
                    )}

                    {loadError && (
                        <Typography color="error" variant="body2">{loadError}</Typography>
                    )}

                    <Stack direction="row" spacing={2}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button variant="contained" type="submit">
                            Upload
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Paper>
    );
}
