import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TextField, TablePagination } from '@mui/material';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const getUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:8000/usuarios/');
            if (response.status === 200) {
                const nonEmployeeUsuarios = response.data.filter(usuario => !usuario.is_employee);
                setUsuarios(nonEmployeeUsuarios);
                setFilteredUsuarios(nonEmployeeUsuarios);
            }
        } catch (error) {
            console.error("Error getting users: ", error);
        }
    };

    useEffect(() => {
        getUsuarios();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        filterUsuarios(e.target.value);
    };

    const filterUsuarios = (query) => {
        const filtered = usuarios.filter(usuario =>
            usuario.username.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsuarios(filtered);
    };

    return (
        <div style={{ maxWidth: '80%', margin: 'auto' }}>
            <TextField
                label="Buscar usuarios"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchQuery}
                onChange={handleSearch}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Nombre de Usuario</TableCell>
                            <TableCell>Dirección</TableCell>
                            <TableCell>Teléfono</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((usuario) => (
                            <TableRow key={usuario.id}>
                                <TableCell>{usuario.id}</TableCell>
                                <TableCell>{usuario.email}</TableCell>
                                <TableCell>{usuario.username}</TableCell>
                                <TableCell>{usuario.direccion}</TableCell>
                                <TableCell>{usuario.telefono}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredUsuarios.length}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                />
            </TableContainer>
        </div>
    );
};

export default Usuarios;
