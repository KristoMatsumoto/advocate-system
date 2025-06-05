import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';

export default function CaseItem({ data }) {
  return (
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>{data.title}</Typography>
        <Typography variant="body2" color="text.secondary">{data.description || 'No description provided.'}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="outlined">View details</Button>
      </CardActions>
    </Card>
  );
};
