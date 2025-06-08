import { Box, Typography} from "@mui/material";

export default function ViewField({ label, value }) {
    return (
        <Box>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="body1">{value}</Typography>
        </Box>
    );
}
