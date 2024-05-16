import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Container, Select, MenuItem } from '@mui/material';

const Edit = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchProduct = async () => {
            const response = await axios.get(`http://localhost:8000/producto/Producto/${id}/`);
            const product = response.data;
            setName(product.nombre);
            setPrice(product.precio);
            setStock(product.stock);
            setSelectedBrand(product.marca);
            setSelectedCategory(product.categoria);
            setPreviewImage(product.imagen);
        };
    
        const fetchBrands = async () => {
            const response = await axios.get('http://localhost:8000/producto/marca/');
            setBrands(response.data);
        };
    
        const fetchCategories = async () => {
            const response = await axios.get('http://localhost:8000/producto/Categoria/');
            setCategories(response.data);
        };
    
        fetchProduct();
        fetchBrands();
        fetchCategories();
    }, [id]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('nombre', name);
        formData.append('precio', price);
        formData.append('stock', stock);
        formData.append('marca', selectedBrand);
        formData.append('categoria', selectedCategory);
        if (image) {
            formData.append('imagen', image);
        }

        const response = await axios.put(`http://localhost:8000/producto/Producto/${id}/`, formData);
        if (response.status === 200) {
            navigate('/inventario');
        }
    };

    return (
        <Container>
            <Typography variant="h6" style={{ marginBottom: '20px' }}>Editar Producto</Typography>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField label="Precio" value={price} onChange={(e) => setPrice(e.target.value)} />
                <TextField label="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
                <Select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                >
                    {brands.map((brand) => (
                        <MenuItem key={brand.id} value={brand.id}>
                            {brand.nombre}
                        </MenuItem>
                    ))}
                </Select>
                <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.nombre}
                        </MenuItem>
                    ))}
                </Select>
                <input type="file" onChange={handleImageUpload} />
                {previewImage && <img src={previewImage} alt="preview" style={{ width: '100px', height: '100px' }} />}
                <Button type="submit" variant="contained" color="primary">Actualizar</Button>
            </form>
        </Container>
    );
};

export default Edit;