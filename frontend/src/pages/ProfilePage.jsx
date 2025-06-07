import { useState, useEffect, useContext } from "react";
import { Box, Typography, TextField, Button, Paper, Stack, Divider } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/axios";
import { AuthContext } from '../context/AuthContext'

export default function ProfilePage() {
    const { user, setUser } = useContext(AuthContext);
    const [error, setError] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [success, setSuccess] = useState("");
    const [successPassword, setSuccessPassword] = useState("");
    const [isUnchanged, setIsUnchanged] = useState(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: user.name || "",
            second_name: user.second_name || "",
            surname: user.surname || "",
            email: user.email || "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("First name is required"),
            second_name: Yup.string(),
            surname: Yup.string().required("Last name is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
        }),
        onSubmit: (values) => {
            if (isUnchanged) {
                setSuccess("");
                setError("No changes to save.");
                return;
            }
            api.put(`/users/${user.id}`, { user: values })
                .then((res) => { setUser(res.data); setSuccess("Profile updated successfully!"); setError(""); })
                .catch((err) => { setError("Failed to update profile."); setSuccess(""); });
        }
    });

    useEffect(() => {
        setIsUnchanged(JSON.stringify(formik.values) === JSON.stringify(formik.initialValues))
    }, [formik.values, formik.initialValues])

    const passwordFormik = useFormik({
        initialValues: {
            current_password: "",
            new_password: "",
            confirm_password: "",
        },
        validationSchema: Yup.object({
            current_password: Yup.string().required("Current password is required"),
            new_password: Yup.string().min(6, "Min 6 characters").required("New password is required"),
            confirm_password: Yup.string()
                .oneOf([Yup.ref("new_password")], "Passwords must match")
                .required("Confirm password is required"),
        }),
        onSubmit: (values) => {
            api.put(`/users/${user.id}/change_password`, {
                current_password: values.current_password,
                password: values.new_password,
            })
                .then((res) => { setSuccessPassword("Password changed successfully!"); setErrorPassword(""); passwordFormik.resetForm(); })
                .catch((err) => { setErrorPassword("Failed to change password."); setSuccessPassword(""); });
        }
    });

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>Your Profile</Typography>

            {success && <Typography color="success.main" mt={2}>{success}</Typography>}
            {error && <Typography color="error.main" mt={2}>{error}</Typography>}

            <Paper sx={{ p: 3, mb: 4 }}>
                <Box component="form" onSubmit={formik.handleSubmit}>{/*noValidate*/}
                    <Stack spacing={2}>
                        <Typography variant="h6">Basic Information</Typography>

                        <TextField
                            label="Name"
                            name="name"
                            fullWidth
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            label="Second Name"
                            name="second_name"
                            fullWidth
                            value={formik.values.second_name}
                            onChange={formik.handleChange}
                        />
                        <TextField
                            label="Surname"
                            name="surname"
                            fullWidth
                            value={formik.values.surname}
                            onChange={formik.handleChange}
                            error={formik.touched.surname && Boolean(formik.errors.surname)}
                            helperText={formik.touched.surname && formik.errors.surname}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            fullWidth
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />

                        <Button type="submit" variant="contained" disabled={isUnchanged}>Save Changes</Button>
                    </Stack>
                </Box> 
            </Paper>

            <Divider sx={{ mb: 4 }} />

            {successPassword && <Typography color="success.main" mt={2}>{successPassword}</Typography>}
            {errorPassword && <Typography color="error.main" mt={2}>{errorPassword}</Typography>}

            <Paper sx={{ p: 3 }}>
                <Box component="form" onSubmit={passwordFormik.handleSubmit}>{/*noValidate*/}
                    <Stack spacing={2}>
                        <Typography variant="h6">Change Password</Typography>

                        <TextField
                            label="Current Password"
                            name="current_password"
                            type="password"
                            fullWidth
                            value={passwordFormik.values.current_password}
                            onChange={passwordFormik.handleChange}
                            error={passwordFormik.touched.current_password && Boolean(passwordFormik.errors.current_password)}
                            helperText={passwordFormik.touched.current_password && passwordFormik.errors.current_password}
                        />
                        <TextField
                            label="New Password"
                            name="new_password"
                            type="password"
                            fullWidth
                            value={passwordFormik.values.new_password}
                            onChange={passwordFormik.handleChange}
                            error={passwordFormik.touched.new_password && Boolean(passwordFormik.errors.new_password)}
                            helperText={passwordFormik.touched.new_password && passwordFormik.errors.new_password}
                        />
                        <TextField
                            label="Confirm New Password"
                            name="confirm_password"
                            type="password"
                            fullWidth
                            value={passwordFormik.values.confirm_password}
                            onChange={passwordFormik.handleChange}
                            error={passwordFormik.touched.confirm_password && Boolean(passwordFormik.errors.confirm_password)}
                            helperText={passwordFormik.touched.confirm_password && passwordFormik.errors.confirm_password}
                        />

                        <Button type="submit" variant="contained">Change Password</Button>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}
