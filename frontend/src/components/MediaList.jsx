import MediaItem from "./MediaItem";
import { Typography, Paper } from "@mui/material";

export default function MediaList({ mediaList, setMediaList, caseId }) {
    const handleUpdate = (updatedMedia) => {
        setMediaList((prev) =>
            prev.map((item) => (item.id === updatedMedia.id ? updatedMedia : item))
        );
    };

    const handleDelete = (deletedId) => {
        setMediaList((prev) => prev.filter((item) => item.id !== deletedId));
    };

    return (
        <>
            {mediaList.map((media) => (
                <MediaItem
                    key={media.id}
                    item={media}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    caseId={caseId}
                />
            ))}
        </>
    );
}
