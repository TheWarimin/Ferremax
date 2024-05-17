import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import imagen1 from '../Static/Banner_Ferremax_Mesa-de-trabajo-1.jpg';
import imagen2 from '../Static/Banner_Ferremax_Mesa-de-trabajo-2.jpg';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import '../style/principal.css';
import { Grid, CardActionArea, Card, CardContent, Typography, MenuItem, Select } from '@mui/material';
import Carrito from './carrito';

const ProductCard = ({ product , addToCart}) => (
    <Card onClick={() => addToCart(product)}
        variant="outlined" 
        sx={{ 
            maxWidth: 300, 
            maxHeight: 390, 
            margin: '20px auto', 
            width: '100%', 
            height: '400px', 
        }}
    >
        <CardActionArea>
            <CardContent>
                <img src={product.imagen} alt={product.nombre} style={{ width: '250px', height: '250px' }} />
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


  

const Principal = () => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [cart, setCart] = useState([]);

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

    const addToCart = (product) => {
        setCart(prevCart => [...prevCart, product]);
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
                    <img src={imagen1}/>
                </div>
                <div>
                    <img src={imagen2}/>
                </div>
            </Carousel>

            <Typography variant="h5" style={{ marginTop: '40px', textAlign: 'center', width: '200px' }}>Productos Nuevos</Typography>
            <Slider {...settings}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} addToCart={addToCart}/>
                ))}
            </Slider>
                
            <Select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                style={{ marginTop: '20px', display: 'block', width: '100px' }}
            >
                <MenuItem value="">Todas las categorías</MenuItem>
                {categories.map((category) => (
                    <MenuItem value={category.id}>{category.nombre}</MenuItem>
                ))}
            </Select>

            <Carrito cart={cart} /> 

            <Typography variant="h5" style={{ marginTop: '40px', textAlign: 'center' }}>Catalogo</Typography>
        
            <Grid container>
                {products.filter(product => selectedCategory === '' || product.categoria === selectedCategory).map((product) => (
                    <ProductCard key={product.id} product={product} addToCart={addToCart}/>
                ))}
            </Grid>
        </div>
    );
}

export default Principal;
