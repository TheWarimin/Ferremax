import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Grid, Container, Box, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';

const DetalleProducto = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isLoggedIn } = useContext(AuthContext);
    const userEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/Producto/${productId}/`);
                if (response.status === 200) {
                    setProduct(response.data);
                }
            } catch (error) {
                console.error("Error fetching product details: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            alert('Para agregar productos debe loguearse o en consecuencia registrarse');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token is missing');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/add-to-cart/', {
                producto: product.id,
                cantidad: 1
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (response.status === 200) {
                alert('Producto añadido al carrito');
            } else {
                throw new Error('Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding product to cart: ', error);
            alert('Error al añadir producto al carrito');
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (!product) {
        return <Typography>No se encontró el producto.</Typography>;
    }

    return (
        <Container>
            <Grid container spacing={2} sx={{ maxWidth: 900, margin: '20px auto', textAlign: 'center', alignItems: 'center' }}>
                {/* Columna de imagen */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ width: '100%', padding: '20px' }}>
                        <img src={product.imagen} alt={product.nombre} style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
                    </Box>
                </Grid>
                {/* Columna de nombre, stock, precio y botón */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Typography variant="h4" component="h2" sx={{ marginBottom: '20px' }}>
                        {product.nombre}
                    </Typography>
                    <Typography variant="caption" component="p" sx={{ marginBottom: '20px' }}>
                        Stock: {product.stock}
                    </Typography>
                    <Typography variant="h5" component="p" sx={{ marginBottom: '20px' }}>
                        ${product.precio}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleAddToCart}>
                        Añadir al carrito
                    </Button>
                </Grid>
            </Grid>
            {/* Descripción abajo */}
            <Grid container spacing={2} sx={{ maxWidth: 900, margin: '20px auto', marginTop: '2%' }}>
                <Grid item xs={12}>
                    <Typography variant="body1" component="p">
                        {product.descripcion}
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DetalleProducto;
