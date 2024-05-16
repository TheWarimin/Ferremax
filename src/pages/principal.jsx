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
import { Grid, CardActionArea, Card, CardContent, Typography } from '@mui/material';


const ProductCard = ({ product }) => (
    <Grid item xs={6} sm={6} md={4} lg={3}>    
        <Grid container direction="row"
              justifyContent="center"
              alignItems="center">
        <Card variant="outlined" sx={{ maxWidth: 300, maxHeight: 390 }}> 
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
        </Grid>
    </Grid>
);

const Principal = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/producto/Producto/');
                if (response.status === 200) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error("Error getting documents: ", error);
            }
        };
    
        getProducts();
    }, []);

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
        <div>
            <Carousel className="carousel" showThumbs={false}>
                <div>
                    <img src={imagen1}/>
                </div>
                <div>
                    <img src={imagen2}/>
                </div>
            </Carousel>

            <Slider {...settings} spacing={1} style={{ marginTop: '40px' }}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
             </Slider>

            <Grid container spacing={2} style={{ marginTop: '40px' }}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </Grid>
        </div>
    );
}

export default Principal;