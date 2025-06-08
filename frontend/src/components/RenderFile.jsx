import { Box, Typography, Grid, IconButton, ImageListItem } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ClearIcon from "@mui/icons-material/Clear";

export default function RenderFile({ file, editing, onRemove, onPreview }) {
    const ext = file.name?.split(".").pop()?.toLowerCase() || "";
    const isImage = /^image\/(jpeg|png|gif|bmp|webp|svg\+xml)$/.test(file.content_type || "");

    const getFileSrc = (file) => {
        return file.url.startsWith("blob:")
            ? file.url
            : `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}${file.url}`;
    };

    return (
        <Grid>
            <Box>
                <Box display={!isImage ? "flex" : null} mt={1}>
                    {isImage ? (
                        <ImageListItem sx={{ m: 1, py: 0.5 }}>
                            <img
                                src={getFileSrc(file)}
                                alt={file.name}
                                style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 6 }}
                            />
                        </ImageListItem>
                    ) : (
                        <Typography sx={{ mb: 1, py: 0.5, px: 1 }}>
                            <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ cursor: "pointer" }}
                            >
                                {file.name || `File (${ext})`}
                            </a>
                        </Typography>
                    )}
                
                    <IconButton href={file.url} download target="_blank">
                        <DownloadIcon />
                    </IconButton>

                    {editing && (
                        <IconButton onClick={onRemove} color="error">
                            <ClearIcon />
                        </IconButton>
                    )}
                </Box>
            </Box>
        </Grid>
    );
}
