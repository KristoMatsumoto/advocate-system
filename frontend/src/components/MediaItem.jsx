import { useState } from "react";
import { Box, Button, Card, CardContent, Typography, TextField, Grid, Stack, IconButton, ImageListItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ClearIcon from "@mui/icons-material/Clear";
import api from "../api/axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function MediaItem({ item, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [removedFiles, setRemovedFiles] = useState([]);

  const formik = useFormik({
    initialValues: {
      title: item.title || "",
      description: item.description || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string(),
    }),
    onSubmit: async (values) => {
      api.put(`/media/${item.id}`, {
          media: {
            ...values,
            removed_attachment_ids: removedFiles,
          },
      })
        .then((res) => { onUpdate(res.data); setEditing(false); setRemovedFiles([]); })
        .catch((err) => { setError("Failed to save changes"); });
    },
  });

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this media?");
    if (!confirmed) return;
    try {
      await api.delete(`/media/${item.id}`);
      onDelete(item.id);
    } catch (err) {
      setError("Failed to delete media");
    }
  };

  const toggleRemoveFile = (attachmentId) => {
    setRemovedFiles((prev) =>
      prev.includes(attachmentId) ? prev.filter((id) => id !== attachmentId) : [...prev, attachmentId]
    );
  };

  const visibleAttachments = item.attachments?.filter(a => !removedFiles.includes(a.id)) || [];

  return (
    <Card sx={{ mt: 2 }}>
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

              <Typography variant="subtitle2">Attachments:</Typography>
              {visibleAttachments.length > 0 ? (
                <Grid container spacing={2}>
                  {visibleAttachments.map((file, idx) => {
                    const isImage = /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(file.url);
                    return (
                      <Grid item key={file.id}>
                        <Box position="relative">
                          {isImage ? (
                            <ImageListItem>
                              <img
                                src={file.url}
                                alt={file.name || `Image ${idx + 1}`}
                                style={{
                                  width: 160,
                                  height: 160,
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  border: "1px solid #ccc",
                                }}
                              />
                            </ImageListItem>
                          ) : (
                            <Typography variant="body2">
                              <a href={file.url} target="_blank" rel="noopener noreferrer">
                                {file.name || `File ${idx + 1}`}
                              </a>
                            </Typography>
                          )}

                          <Box mt={1} display="flex" alignItems="center" justifyContent="space-between">
                            <IconButton
                              href={file.url}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                            >
                              <DownloadIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => toggleRemoveFile(file.id)}
                              size="small"
                              color="error"
                            >
                              <ClearIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No files attached
                </Typography>
              )}

              {error && <Typography color="error">{error}</Typography>}

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => { setEditing(false); setRemovedFiles([]); }}
                  startIcon={<CloseIcon />}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDelete}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Stack>
            </Stack>
          </form>
        ) : (
          <>
            <Stack direction="row" justifyContent="space-between" alignItems="start">
              <Box>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2">{item.description || "No description"}</Typography>
              </Box>
              <IconButton onClick={() => setEditing(true)}>
                <EditIcon />
              </IconButton>
            </Stack>

            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Attachments:
              </Typography>
              {item.attachments?.length > 0 ? (
                <Grid container spacing={2}>
                  {item.attachments.map((file, idx) => {
                    const isImage = /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(file.url);
                    return (
                      <Grid item key={file.id}>
                        <Box>
                          {isImage ? (
                            <ImageListItem>
                              <img
                                src={file.url}
                                alt={file.name || `Image ${idx + 1}`}
                                style={{
                                  width: 160,
                                  height: 160,
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  border: "1px solid #ccc",
                                }}
                              />
                            </ImageListItem>
                          ) : (
                            <Typography variant="body2">
                              <a href={file.url} target="_blank" rel="noopener noreferrer">
                                {file.name || `File ${idx + 1}`}
                              </a>
                            </Typography>
                          )}
                          <IconButton
                            component="a"
                            href={file.url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No files uploaded
                </Typography>
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
