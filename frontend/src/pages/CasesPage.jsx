import { useRef, useEffect, useState, useMemo } from 'react';
import { Box, Button, TextField, Typography, Pagination, Grid, Modal } from '@mui/material';
import debounce from 'lodash.debounce';
import api from '../api/axios';
import CaseForm from '../components/CaseForm';
import CaseItem from '../components/CaseItem';
import Loader from '../components/Loader';

export default function CasesPage() {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" });
    const [formOpen, setFormOpen] = useState(false);
    const searchRef = useRef(null);

  const debouncedSearch = useMemo(() => debounce((value) => {
    setSearchQuery(value);
  }, 1000), []);

  const fetchCases = () => {
    api.get('/cases', { params: { 
      page: page,
      per_page: rowsPerPage,
      search:  searchQuery || undefined,
      sort: sortConfig.key,
      direction: sortConfig.direction
    }})
    .then((res) => {
      setCases(res.data.cases);
      setTotalCount(res.data.meta.total);
      setPage(res.data.meta.page);
      setRowsPerPage(res.data.meta.per_page);
    })
    .catch((err) => setError("Failed to load cases"))
    .finally(() => setLoading(false));
  }

  useEffect(() => { if (searchRef.current) searchRef.current.focus(); }, []);
  useEffect(() => { debouncedSearch(search); }, [search]);
  useEffect(() => { fetchCases(); }, [page, rowsPerPage, searchQuery, sortConfig])

  if (loading) return <Loader />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box className="container" sx={{ py: 4, mr: 5, ml: 5 }}>
      <Typography variant="h4" gutterBottom>List of cases</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search per title"
          id="search-field"
          value={search}
          inputRef={searchRef}
          onChange={e => setSearch(e.target.value)}
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

      {totalCount > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalCount}
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
