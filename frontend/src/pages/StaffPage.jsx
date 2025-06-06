import { useEffect, useState, useMemo } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, TextField, MenuItem, Grid } from "@mui/material";
import Loader from "../components/Loader";
import api from "../api/axios";

export default function StaffPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
    const roles = ["all", ...new Set(users.map(u => u.role))];

    useEffect(() => {
        api.get("/users")
            .then(res => setUsers(res.data))
            .catch(() => setError("Failed to load users"))
            .finally(() => setLoading(false));
    }, []);

    const filteredAndSortedUsers = useMemo(() => {
        let filtered = users;

        if (roleFilter !== "all") 
            filtered = filtered.filter(u => u.role === roleFilter);
        
        if (search) {
            const s = search.toLowerCase();
            filtered = filtered.filter(u =>
                u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s)
            );
        }

        filtered.sort((a, b) => {
            const aVal = a[sortConfig.key]?.toLowerCase?.() || "";
            const bVal = b[sortConfig.key]?.toLowerCase?.() || "";
            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [users, search, roleFilter, sortConfig]);

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
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Search by name or email"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        select
                        fullWidth
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
                            {filteredAndSortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
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
                    count={filteredAndSortedUsers.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
