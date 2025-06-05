import React from "react";
import { Box, CircularProgress } from "@mui/material";

export default function Loader({ centered = true, size = 40 }) {
    return (
        <Box
            display="flex"
            justifyContent={centered ? "center" : "flex-start"}
            alignItems="center"
            minHeight={centered ? "200px" : "auto"}
        >
            <CircularProgress size={size} />
        </Box>
    );
}
