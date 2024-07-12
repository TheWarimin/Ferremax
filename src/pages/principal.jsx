import { Grid, CardActionArea, Card, CardContent, Typography, MenuItem, Select, Button, Box } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../components/AuthContext';
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom'; 
import imagen1 from '../Static/Banner_Ferremax_Mesa-de-trabajo-1.jpg';
import imagen2 from '../Static/Banner_Ferremax_Mesa-de-trabajo-2.jpg';
import Slider from "react-slick";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import '../style/principal.css';
import UserContext from '../components/UserContext';
import axios from 'axios';

const ProductCard = ({ product, addToCart, userEmail }) => {
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);
    const navigate = useNavigate(); 

    const handleClick = async (e) => {
        e.stopPropagation();
        setLoading(true);
        await addToCart(product, userEmail);
        setLoading(false);
        setAdded(true);
        setTimeout(() => setAdded(false), 700);
    };

    return (
        <Card
            variant="outlined" 
            sx={{ 
                maxWidth: 300, 
                maxHeight: 400, 
                margin: '20px auto', 
                width: '100%', 
                height: '400px', 
                borderRadius: '10px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between' 
            }}
        >
            <CardActionArea onClick={() => navigate(`/product/${product.id}`)} sx={{ flexGrow: 1 }}>
                <CardContent>
                    <img src={product.imagen} alt={product.nombre} style={{ width: '250px', height: '220px', borderRadius: '10px' }} />
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
            <CardActionArea onClick={handleClick} sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <Button
                    onClick={handleClick}
                    disabled={loading || added}
                    fullWidth
                >
                    {added ? <CheckCircle color="success" /> : 'Añadir al carrito'}
                </Button>
            </CardActionArea>
        </Card>
    );
};

const Principal = ({ selectedCurrency, valorGeneral }) => {
    const { isLoggedIn } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        const token = localStorage.getItem('token');
        if (storedEmail) {
            setUserEmail(storedEmail);
        }

        const getProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/Producto/');
                const categoria = await axios.get('http://localhost:8000/Categoria/');
                if (response.status === 200) {
                    const updatedProducts = response.data.map(product => {
                        let newPrice;
                        switch (selectedCurrency) {
                            case 'Dolar':
                            case 'Euro':
                                newPrice = parseFloat((product.precio / valorGeneral).toFixed(2));
                                break;
                            case 'Arg':
                            case 'Peso':
                                newPrice = product.precio * valorGeneral;
                                break;
                            default:
                                return product;
                        }
                        return {
                            ...product,
                            precio: newPrice
                        };
                    });
                    setProducts(updatedProducts);
                    setCategories(categoria.data);
                }
            } catch (error) {
                console.error("Error getting products: ", error);
            }
        };
        getProducts();
    }, [selectedCurrency, valorGeneral]);

    const addToCart = async (producto, userEmail) => {
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
                producto: producto.id,
                cantidad: 1
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (response.status === 200) {
                setCarrito(prevCarrito => {
                    const productoEnCarrito = prevCarrito.find(p => p.id === producto.id);
                    if (productoEnCarrito) {
                        return prevCarrito.map(p =>
                            p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
                        );
                    } else {
                        return [...prevCarrito, { ...producto, cantidad: 1 }];
                    }
                });
                console.log('Product added to cart successfully');
            } else {
                throw new Error('Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding product to cart: ', error);
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
        <UserContext.Provider value={userEmail}>
        <div style={{ maxWidth: '1700px', margin: '10px auto' }}>
            <Carousel className="carousel" showThumbs={false}>
                <div>
                    <img src={imagen1} alt="Banner 1" />
                </div>
                <div>
                    <img src={imagen2} alt="Banner 2" />
                </div>
            </Carousel>

            <Typography variant="h5" style={{ marginTop: '40px', textAlign: 'center', width: '200px' }}>Productos Nuevos</Typography>
            <Slider {...settings}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} addToCart={addToCart} userEmail={userEmail} />
                ))}
            </Slider>

            <Select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                style={{ marginTop: '20px', display: 'block', width: '14%', minWidth: '220px', marginLeft: '30px' }}
                displayEmpty
            >
                <MenuItem value="">
                    <em>Todas las categorías</em>
                </MenuItem>
                {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>{category.nombre}</MenuItem>
                ))}
            </Select>


            <Typography variant="h5" style={{ marginTop: '40px', textAlign: 'center' }}>Catálogo</Typography>

            <Grid container>
                {products.filter(product => selectedCategory === '' || product.categoria === selectedCategory).map((product) => (
                    <ProductCard key={product.id} product={product} addToCart={addToCart} userEmail={userEmail} />
                ))}
            </Grid>
        </div>
        </UserContext.Provider>
    );
};

export default Principal;
