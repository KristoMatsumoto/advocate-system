import { useState } from "react";
import FileViewer from "react-file-viewer";
import { Box, Typography, Grid, IconButton, ImageListItem, Modal } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ClearIcon from "@mui/icons-material/Clear";

export default function RenderFile({ file, editing, onRemove }) {
    const [fileToView, setFileToView] = useState(null);
    const ext = file.name?.split(".").pop()?.toLowerCase() || "";
    const isImage = /^image\/(jpeg|png|gif|bmp|webp|svg\+xml)$/.test(file.content_type || "");

    const getFileSrc = (file) => {
        return file.url.startsWith("blob:")
            ? file.url
            : `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}${file.url}`;
    };

    const handlePreview = () => {
        setFileToView({
            fileType: ext,
            filePath: getFileSrc(file),
        });
    };

    return (
        <Grid>
            <Box>
                <Box display={!isImage ? "flex" : null} mt={1}>
                    {isImage ? (
                        <ImageListItem sx={{ m: 1, py: 0.5 }} onClick={handlePreview} style={{ cursor: "pointer" }}>
                            <img
                                src={getFileSrc(file)}
                                alt={file.name}
                                style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 6 }}
                            />
                        </ImageListItem>
                    ) : (
                        <Typography sx={{ mb: 1, py: 0.5, px: 1 }} onClick={handlePreview} style={{ cursor: "pointer" }}>
                            <a>{file.name || `File (${ext})`}</a>
                        </Typography>
                    )}

                    <IconButton href={getFileSrc(file)} download target="_blank">
                        <DownloadIcon />
                    </IconButton>

                    {editing && (
                        <IconButton onClick={onRemove} color="error">
                            <ClearIcon />
                        </IconButton>
                    )}
                </Box>
            </Box>

            <Modal open={!!fileToView} onClose={() => setFileToView(null)}>
                <Box sx={{ width: "80vw", height: "80vh", margin: "auto", mt: "10vh", bgcolor: "white", p: 2 }}>
                    {fileToView && (
                        <FileViewer
                            fileType={fileToView.fileType}
                            filePath={fileToView.filePath}
                            onError={(e) => console.error("Viewer error:", e)}
                        />
                    )}
                </Box>
            </Modal>
        </Grid>
    );
}
