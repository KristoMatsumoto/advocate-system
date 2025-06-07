import React from "react";
import { Box, Button, TextField, Stack, Typography} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/axios";

const validationSchema = Yup.object({
    title: Yup.string().required("Please indicate the title"),
    case_number: Yup.string().required("Please indicate the case number"),
    client_name: Yup.string().required("Please indicate the client name"),
    court: Yup.string().required("Please indicate the court"),
    start_date: Yup.date()
        .typeError("Start date must be a valid date")
        .required("Start date is required"),
    end_date: Yup.date()
        .typeError("End date must be a valid date")
        .min(Yup.ref("start_date"), "End date cannot be before start date")
        .nullable(),
});

export default function CaseFormEdit({ caseData, onSuccess }) {
    const formik = useFormik({
        initialValues: {
            title: caseData?.title || "",
            description: caseData?.description || "",
            case_number: caseData?.case_number || "",
            client_name: caseData?.client_name || "",
            court: caseData?.court || "",
            start_date: caseData?.start_date || "",
            end_date: caseData?.end_date || "",
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            api.patch(`/cases/${caseData.id}`, values)
                .then((res) => onSuccess?.(res.data))
                .catch((err) => console.error(err));
        },
    });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>Edit Case</Typography>
      <Stack spacing={2}>
        <TextField
          label="Title"
          name="title"
          fullWidth
          required
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
        <TextField
          label="Case number"
          name="case_number"
          fullWidth
          required
          value={formik.values.case_number}
          onChange={formik.handleChange}
          error={formik.touched.case_number && Boolean(formik.errors.case_number)}
          helperText={formik.touched.case_number && formik.errors.case_number}
        />
        <TextField
          label="Client name"
          name="client_name"
          fullWidth
          required
          value={formik.values.client_name}
          onChange={formik.handleChange}
          error={formik.touched.client_name && Boolean(formik.errors.client_name)}
          helperText={formik.touched.client_name && formik.errors.client_name}
        />
        <TextField
          label="Court"
          name="court"
          fullWidth
          required
          value={formik.values.court}
          onChange={formik.handleChange}
          error={formik.touched.court && Boolean(formik.errors.court)}
          helperText={formik.touched.court && formik.errors.court}
        />
        <TextField
          label="Start date"
          name="start_date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          required
          value={formik.values.start_date}
          onChange={formik.handleChange}
          error={formik.touched.start_date && Boolean(formik.errors.start_date)}
          helperText={formik.touched.start_date && formik.errors.start_date}
        />
        <TextField
          label="End date"
          name="end_date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formik.values.end_date || ""}
          onChange={formik.handleChange}
          error={formik.touched.end_date && Boolean(formik.errors.end_date)}
          helperText={formik.touched.end_date && formik.errors.end_date}
        />
        <TextField
          label="Description"
          name="description"
          multiline
          rows={3}
          fullWidth
          value={formik.values.description}
          onChange={formik.handleChange}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting}
        >
          Save changes
        </Button>
      </Stack>
    </Box>
  );
}
