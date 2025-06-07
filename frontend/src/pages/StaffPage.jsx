import { useRef, useEffect, useState, useMemo } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, TextField, MenuItem, Grid } from "@mui/material";
import debounce from 'lodash.debounce';
import Loader from "../components/Loader";
import api from "../api/axios";

export default function StaffPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
    const searchRef = useRef(null);
    const roles = ["all", ...new Set(users.map(u => u.role))];

    const debouncedSearch = useMemo(() => debounce((value) => {
        setSearchQuery(value);
    }, 1000), []);

    useEffect(() => { if (searchRef.current) searchRef.current.focus(); }, []);
    useEffect(() => { debouncedSearch(search); }, [search]);
    useEffect(() => {
        setLoading(true);
        api.get("/users", { params: {
            page: page + 1,
            per_page: rowsPerPage,
            search:  searchQuery || undefined,
            role: roleFilter !== "all" ? roleFilter : undefined,
            sort: sortConfig.key,
            direction: sortConfig.direction
        }})
        .then(res => {
            setUsers(res.data.users);
            setTotalCount(res.data.meta.total);
            setPage(res.data.meta.page - 1);
            setRowsPerPage(res.data.meta.per_page);
        })
        .catch(() => setError("Failed to load users"))
        .finally(() => setLoading(false));
    }, [page, rowsPerPage, searchQuery, roleFilter, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
        }));
    };

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    if (loading) return <Loader />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>Staff Management</Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid>
                    <TextField
                        fullWidth
                        id="search-field"
                        label="Search by name or email"
                        inputRef={searchRef}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </Grid>
                <Grid>
                    <TextField
                        select
                        fullWidth
                        id="sort-role"
                        label="Filter by role"
                        value={roleFilter}
                        onChange={e => setRoleFilter(e.target.value)}
                    >
                        {roles.map(role => (
                            <MenuItem key={role} value={role}>{role}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>

            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["surname", "name", "email", "role", "created_at"].map((key) => (
                                    <TableCell key={key}>
                                        <TableSortLabel
                                            active={sortConfig.key === key}
                                            direction={sortConfig.key === key ? sortConfig.direction : "asc"}
                                            onClick={() => handleSort(key)}
                                        >
                                            {key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.surname}</TableCell>
                                    <TableCell>{`${user.name} ${user.second_name}`}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
