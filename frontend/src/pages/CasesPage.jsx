import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Pagination, Grid, Modal } from '@mui/material';
import api from '../api/axios';
import CaseForm from '../components/CaseForm';
import CaseItem from '../components/CaseItem';

export default function CasesPage() {
  const [cases, setCases] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [meta, setMeta] = useState({ total_pages: 1 });
  const [formOpen, setFormOpen] = useState(false);

  const fetchCases = () => {
    api.get('/cases', {
      params: { query, page, per_page: perPage }
    })
    .then(res => {
      setCases(res.data.cases);
      setMeta(res.data.meta);
    })
    .catch(err => console.error(err.message))
  }

  useEffect(() => { fetchCases(); }, [query, page])

  return (
    <Box className="container" sx={{ py: 4, mr: 5, ml: 5 }}>
      <Typography variant="h4" gutterBottom>List of cases</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search per title"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setPage(1);
          }}
          size="small"
          sx={{ flex: 1, mr: 2 }}
        />
        <Button variant="contained" color="primary" onClick={() => setFormOpen(true)}>{ "Create case" }</Button>
      </Box>

      <Grid container spacing={2}>
        {cases.length > 0 ? (
          cases.map(c => (
            <Grid key={c.id}>
              <CaseItem data={c} />
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>No cases</Typography>
        )}
      </Grid>

      {meta.total_pages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={meta.total_pages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)}>
        <CaseForm
          onCreate={() => {
            setFormOpen(false);
            fetchCases();
          }}
        />
      </Modal>
    </Box>
  );
}
