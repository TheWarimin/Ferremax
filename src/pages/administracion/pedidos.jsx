import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    TextField,
    Select,
    MenuItem,
    TablePagination
} from '@mui/material';

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [usuarios, setUsuarios] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPedidos, setFilteredPedidos] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [transactionItems, setTransactionItems] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const getPedidos = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/pedidos/');
            if (response.status === 200) {
                const sortedPedidos = response.data.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
                setPedidos(sortedPedidos);
                setFilteredPedidos(sortedPedidos);
            }
        } catch (error) {
            console.error("Error getting orders: ", error);
        }
    };

    const getUsuarios = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/usuarios/');
            if (response.status === 200) {
                const usuariosMap = response.data.reduce((map, user) => {
                    map[user.id] = user;
                    return map;
                }, {});
                setUsuarios(usuariosMap);
            }
        } catch (error) {
            console.error("Error getting users: ", error);
        }
    };

    useEffect(() => {
        getPedidos();
        getUsuarios();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        filterPedidos(e.target.value);
    };

    const filterPedidos = (query) => {
        const filtered = pedidos.filter(pedido =>
            usuarios[pedido.usuario]?.email.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredPedidos(filtered);
    };

    const handleEstadoChange = async (id, estado) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/pedidos/${id}/`, { estado });
            getPedidos();
        } catch (error) {
            console.error("Error updating order status: ", error);
        }
    };

    const handleOpenTransactionModal = async (transactionId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/WebpayItems/?transaction_id=${transactionId}`);
            if (response.status === 200) {
                setTransactionItems(response.data);
                setItems(response.data); // Actualiza el estado de items
                setIsTransactionModalOpen(true);
            }
        } catch (error) {
            console.error("Error getting transaction items: ", error);
        }
    };

    const handleOpenUserModal = (userId) => {
        setSelectedUser(usuarios[userId]);
        setIsUserModalOpen(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div style={{ maxWidth: '60%', margin: 'auto' }}>
            <TextField
                label="Buscar pedidos por correo"
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
                            <TableCell>Correo del Usuario</TableCell>
                            <TableCell>Transacción</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Fecha de Creación</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPedidos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pedido) => (
                            <TableRow key={pedido.id}>
                                <TableCell>
                                    <Button onClick={() => handleOpenUserModal(pedido.usuario)}>
                                        {usuarios[pedido.usuario]?.email || 'Desconocido'}
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpenTransactionModal(pedido.webpay_transaction)}>
                                        {pedido.webpay_transaction}
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={pedido.estado}
                                        onChange={(e) => handleEstadoChange(pedido.id, e.target.value)}
                                    >
                                        <MenuItem value="preparando">Preparando</MenuItem>
                                        <MenuItem value="enviado">Enviado</MenuItem>
                                        <MenuItem value="entregado">Entregado</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>{formatDate(pedido.fecha_creacion)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredPedidos.length}
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

            {/* Modal para mostrar items de transacción */}
            <Dialog open={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)}>
                <DialogTitle>Items de la Transacción</DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Producto</TableCell>
                                <TableCell>Precio</TableCell>
                                <TableCell>Cantidad</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactionItems.map((item, index) => ( // Utiliza transactionItems
                                <TableRow key={index}>
                                    <TableCell>{item.product_name}</TableCell>
                                    <TableCell>{item.product_price}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsTransactionModalOpen(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal para mostrar datos del usuario */}
            <Dialog open={isUserModalOpen} onClose={() => setIsUserModalOpen(false)}>
                <DialogTitle>Datos del Usuario</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <div>
                            <p>Email: {selectedUser.email}</p>
                            <p>Dirección: {selectedUser.direccion}</p>
                            <p>Teléfono: {selectedUser.telefono}</p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsUserModalOpen(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Pedidos;