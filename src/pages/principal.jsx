import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import imagen1 from '../Static/Banner_Ferremax_Mesa-de-trabajo-1.jpg';
import imagen2 from '../Static/Banner_Ferremax_Mesa-de-trabajo-2.jpg';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import '../style/principal.css';
import UserContext from '../components/UserContext';
import { Grid, CardActionArea, Card, CardContent, Typography, MenuItem, Select } from '@mui/material';

const ProductCard = ({ product, addToCart }) => (
    <Card onClick={() => addToCart(product)}
        variant="outlined" 
        sx={{ 
            maxWidth: 300, 
            maxHeight: 390, 
            margin: '20px auto', 
            width: '100%', 
            height: '400px', 
            borderRadius: '10px'
        }}
    >
        <CardActionArea>
            <CardContent>
                <img src={product.imagen} alt={product.nombre} style={{ width: '250px', height: '250px', borderRadius: '10px'}} />
                <Typography variant="h5" component="h2">
                    {product.nombre}
                </Typography>
                <Typography variant="h5" component="p">
                    ${product.precio}
                </Typography>
                <Typography variant="caption" component="p">
                    {product.stock} en stock
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card>
);

const Principal = ({ carrito, setCarrito }) => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const userEmail = useContext(UserContext);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/Producto/');
                const categoria = await axios.get('http://localhost:8000/Categoria/');
                if (response.status === 200) {
                    setProducts(response.data);
                    setCategories(categoria.data);
                }
            } catch (error) {
                console.error("Error getting documents: ", error);
            }
        };

        getProducts();
    }, []);

    const addToCart = async (producto, userEmail) => {
        setCarrito(prevCarrito => [...prevCarrito, producto]);
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:8000/productos-carrito/', {
                producto: {
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    stock: producto.stock,
                    marca: producto.marca,
                    categoria: producto.categoria
                },
                cantidad: 1, 
                carrito: userEmail 
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status !== 201) {
                throw new Error('Failed to add product to cart');
            }
        } catch (error) {
            console.error("Error adding product to cart: ", error.response.data);
            console.error("Error adding product to cart: ", error);
        }
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 2500
    };

    return (
        <div style={{ maxWidth: '1700px', margin: '10px auto' }}>
            <Carousel className="carousel" showThumbs={false}>
                <div>
                    <img src={imagen1} />
                </div>
                <div>
                    <img src={imagen2} />
                </div>
            </Carousel>

            <Typography variant="h5" style={{ marginTop: '40px', textAlign: 'center', width: '200px' }}>Productos Nuevos</Typography>
            <Slider {...settings}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} addToCart={addToCart} />
                ))}
            </Slider>

            <Select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                style={{ marginTop: '20px', display: 'block', width: '100px' }}
            >
                <MenuItem value="">Todas las categorías</MenuItem>
                {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>{category.nombre}</MenuItem>
                ))}
            </Select>

            <Typography variant="h5" style={{ marginTop: '40px', textAlign: 'center' }}>Catálogo</Typography>

            <Grid container>
                {products.filter(product => selectedCategory === '' || product.categoria === selectedCategory).map((product) => (
                    <ProductCard key={product.id} product={product} addToCart={addToCart} />
                ))}
            </Grid>
        </div>
    );
};

export default Principal;
