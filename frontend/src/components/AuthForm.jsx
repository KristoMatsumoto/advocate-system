import React, { useState } from "react";
import api from '../api/axios';
import { Box, Button, TextField, Typography, Paper, Link, Stack, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function AuthForm({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const validationSchema = Yup.object({
    email: Yup.string().email('Not valid email').required('Mandatory'),
    password: Yup.string().min(8, 'Minimum 8 symbols').required('Mandatory'),
    passwordConfirmation: Yup.string().when([], {
      is: () => isRegister,
      then: () => Yup.string()
        .required('Confirm password')
        .oneOf([Yup.ref('password')], 'Passwords do not match'),
      otherwise: () => Yup.string().notRequired(),
    }),
    name: Yup.string().when([], {
      is: () => isRegister,
      then: () => Yup.string().required('The field is mandatory'),
      otherwise: () => Yup.string().notRequired(),
    }),
    surname: Yup.string().when([], {
      is: () => isRegister,
      then: () => Yup.string().required('The field is mandatory'),
      otherwise: () => Yup.string().notRequired(),
    }),
    secondName: Yup.string(),
    role: Yup.string().when([], {
      is: () => isRegister,
      then: () => Yup.string().required('The field is mandatory'),
      otherwise: () => Yup.string().notRequired(),
    }),
  });
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
      name: '',
      secondName: '',
      surname: '',
      role: '0',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setError("");
      const endpoint = isRegister ? 'signup' : 'login';
      const payload = isRegister
        ? {
            user: {
              email: values.email,
              password: values.password,
              password_confirmation: values.passwordConfirmation,
              name: values.name,
              second_name: values.secondName,
              surname: values.surname,
              role: Number(values.role),
            }
          }
        : {
            email: values.email,
            password: values.password,
          };

      try {
        api.post(endpoint, payload)
        .then(response => { onAuthSuccess(response.data.token, response.data.user); })
        .catch((e) => { setError(e.message || "Something went wrong"); });
      } catch (e) {
        setError(e.response?.data?.error || e.message || "Network error");
      }
    },
  });

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: "auto", p: 4, mt: 8 }}>
      <Typography variant="h5" gutterBottom align="center">
        {isRegister ? "Регистрация" : "Вход"}
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
            fullWidth
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
            fullWidth
            required
          />

          {isRegister && (
            <>
              <TextField
                label="Confirm password"
                name="passwordConfirmation"
                type="password"
                value={formik.values.passwordConfirmation}
                onChange={formik.handleChange}
                error={formik.touched.passwordConfirmation && !!formik.errors.passwordConfirmation}
                helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                fullWidth
                required
              />
              <TextField
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && !!formik.errors.name}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
                required
              />
              <TextField
                label="Second name"
                name="secondName"
                value={formik.values.secondName}
                onChange={formik.handleChange}
                fullWidth
              />
              <TextField
                label="Surname"
                name="surname"
                value={formik.values.surname}
                onChange={formik.handleChange}
                error={formik.touched.surname && !!formik.errors.surname}
                helperText={formik.touched.surname && formik.errors.surname}
                fullWidth
                required
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  label="Role"
                  required
                >
                  <MenuItem value="0">Rzecznik</MenuItem>
                  <MenuItem value="1">Sekretarz</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button variant="contained" type="submit" fullWidth>
            {isRegister ? "Register here" : "Login me"}
          </Button>
        </Stack>
      </Box>

      <Typography align="center" variant="body2" sx={{ mt: 2 }}>
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link component="button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Login" : "Register"}
        </Link>
      </Typography>
    </Paper>
  );
}
