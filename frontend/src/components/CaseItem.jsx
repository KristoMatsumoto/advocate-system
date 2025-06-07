import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom'
import { useContext } from "react";
import { AuthContext } from '../context/AuthContext'

export default function CaseItem({ data }) {
    const { user } = useContext(AuthContext);

    return (
        <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>{data.title}</Typography>
                <Typography variant="body2" color="text.secondary">{data.description || 'No description provided.'}</Typography>
            </CardContent>
            <CardActions>                
                {user?.role === 'admin' && (
                    <Button component={Link} to={`/case/${data.id}/collaborations`} size="small" variant="outlined">Collaborations</Button>
                )}
                {user?.role != 'admin' && (
                    <Button component={Link} to={`/case/${data.id}`} size="small" variant="outlined">View details</Button>
                )}
            </CardActions>
        </Card>
    );
};
