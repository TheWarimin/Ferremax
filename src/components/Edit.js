import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Container } from '@mui/material';

const Edit = () => {
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const update = async (e) => {
        if (e) e.preventDefault();
        const data = {nombre: name, descripcion: description, precio: price, stock: stock};
        try {
            const response = await axios.put(`http://localhost:8000/api/productos/${id}/`, data);
            if (response.status === 200) {
                navigate('/inventario');
            }
        } catch (error) {
            console.error('Error al actualizar el producto: ', error);
        }
    };

    const getProductById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/productos/${id}/`);
            if (response.status === 200) {
                const data = response.data;
                setName(data.nombre);
                setDescription(data.descripcion);
                setPrice(data.precio);
                setStock(data.stock);
            }
        } catch (error) {
            console.error('Error al obtener el producto: ', error);
        }
    };

    useEffect(() => {
        getProductById(id);
    }, [id]);

        return (
            <Container maxWidth="sm">
            <Typography variant="h4" align="center">Modificar Producto</Typography>
            <form onSubmit={(e) => {
                e.preventDefault();
                update();
            }}>
                <TextField 
                    fullWidth 
                    margin="normal" 
                    label="Nombre" 
                    variant="outlined" 
                    onChange={(e) => setName(e.target.value)} 
                />
                <TextField 
                    fullWidth 
                    margin="normal" 
                    label="Descripción" 
                    variant="outlined" 
                    onChange={(e) => setDescription(e.target.value)} 
                />
                <TextField 
                    fullWidth 
                    margin="normal" 
                    label="Precio" 
                    variant="outlined" 
                    type="number" 
                    onChange={(e) => setPrice(e.target.value)} 
                />
                <TextField 
                    fullWidth 
                    margin="normal" 
                    label="Stock" 
                    variant="outlined" 
                    type="number" 
                    onChange={(e) => setStock(e.target.value)} 
                />
                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                >
                    Guardar
                </Button>
            </form>
        </Container>
        )

}
export default Edit