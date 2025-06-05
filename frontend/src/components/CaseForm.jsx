import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Grid, Stack } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import api from "../api/axios";
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function CaseForm({ onCreate }) {
    const validationSchema = Yup.object({
        title: Yup.string().required('Please indicate the title'),
        case_number: Yup.string().required('Please indicate the number of the case'),
        client_name: Yup.string().required('Please indicate the client name'),
        start_date: Yup.date().required('Start date is mandatory'),
        end_date: Yup.date()
            .nullable()
            .transform((value, originalValue) => originalValue === '' ? null : value )
            .min(Yup.ref('start_date'), 'The end date cannot be before the start date')
    });

    const formik = useFormik({
            initialValues: {
            title: '',
            description: '',
            court: '',
            case_number: '',
            start_date: '',
            end_date: '',
            client_name: '',
            file: null,
        },
        validationSchema,
        onSubmit: (data, { resetForm }) => {
            api.post('/cases', data)
            .then(() => {
                resetForm();
                if (onCreate) onCreate();
            })
            .catch(err => console.error(err.message));
        },
    });

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 4, mr: 4, ml: 4 }}>
            <Typography variant="h6" gutterBottom>
                Create new case
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2}>
                    <TextField 
                        label="Case title" 
                        name="title" 
                        value={formik.values.title} 
                        onChange={formik.handleChange}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                        fullWidth 
                        required 
                    />
                    <TextField
                        label="Number of case"
                        name="case_number"
                        value={formik.values.case_number}
                        onChange={formik.handleChange}
                        error={formik.touched.case_number && Boolean(formik.errors.case_number)}
                        helperText={formik.touched.case_number && formik.errors.case_number}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        multiline
                        rows={3}
                        fullWidth
                    />

                    <TextField
                        label="Court"
                        name="court"
                        value={formik.values.court}
                        onChange={formik.handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Client"
                        name="client_name"
                        value={formik.values.client_name}
                        onChange={formik.handleChange}
                        error={formik.touched.client_name && Boolean(formik.errors.client_name)}
                        helperText={formik.touched.client_name && formik.errors.client_name}
                        fullWidth
                        required
                    />

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Start date"
                                name="start_date"
                                type="date"
                                value={formik.values.start_date}
                                onChange={formik.handleChange}
                                error={formik.touched.start_date && Boolean(formik.errors.start_date)}
                                helperText={formik.touched.start_date && formik.errors.start_date}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="End date"
                                name="end_date"
                                type="date"
                                value={formik.values.end_date}
                                onChange={formik.handleChange}
                                error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                                helperText={formik.touched.end_date && formik.errors.end_date}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>

                    {/* <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFileIcon />}
                    >
                        Загрузить PDF
                        <input
                            type="file"
                            accept=".pdf"
                            hidden
                            onChange={e => formik.setFieldValue('file', e.currentTarget.files[0])}
                        />
                    </Button>
                    {formik.values.file && (
                        <Typography variant="body2" color="text.secondary">
                            📎 {formik.values.file.name}
                        </Typography>
                    )} */}

                    <Button type="submit" variant="contained" color="success">
                        Create
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
};
