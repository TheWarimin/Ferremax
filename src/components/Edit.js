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
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/Producto/${id}/`);
                const product = response.data;
                setName(product.nombre);
                setPrice(product.precio);
                setStock(product.stock);
                setSelectedBrand(product.marca);
                setSelectedCategory(product.categoria);
                setPreviewImage(product.imagen);
            } catch (error) {
                console.error('Error fetching product', error);
            }
        };

        const fetchBrands = async () => {
            try {
                const response = await axios.get('http://localhost:8000/marca/');
                setBrands(response.data);
            } catch (error) {
                console.error('Error fetching brands', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/Categoria/');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };

        fetchProduct();
        fetchBrands();
        fetchCategories();
    }, [id]);

    const validate = () => {
        let tempErrors = {};
        tempErrors.name = name ? "" : "El nombre es requerido.";
        tempErrors.price = price && !isNaN(price) ? "" : "El precio es requerido y debe ser un número.";
        tempErrors.stock = stock && !isNaN(stock) ? "" : "El stock es requerido y debe ser un número.";
        tempErrors.selectedBrand = selectedBrand ? "" : "La marca es requerida.";
        tempErrors.selectedCategory = selectedCategory ? "" : "La categoría es requerida.";
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

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
        if (validate()) {
            const formData = new FormData();
            formData.append('nombre', name);
            formData.append('precio', price);
            formData.append('stock', stock);
            formData.append('marca', selectedBrand);
            formData.append('categoria', selectedCategory);
            if (image) {
                formData.append('imagen', image);
            }

            try {
                const response = await axios.put(`http://localhost:8000/Producto/${id}/`, formData);
                if (response.status === 200) {
                    navigate('/inventario');
                }
            } catch (error) {
                console.error('Error updating product', error);
            }
        }
    };

    return (
        <Container>
            <Typography variant="h6" style={{ marginBottom: '20px' }}>Editar Producto</Typography>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField 
                    label="Nombre" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    {...(errors.name && { error: true, helperText: errors.name })}
                />
                <TextField 
                    label="Precio" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    {...(errors.price && { error: true, helperText: errors.price })}
                />
                <TextField 
                    label="Stock" 
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)} 
                    {...(errors.stock && { error: true, helperText: errors.stock })}
                />
                <Select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    displayEmpty
                    {...(errors.selectedBrand && { error: true })}
                >
                    <MenuItem value="">
                        <em>Selecciona una marca</em>
                    </MenuItem>
                    {brands.map((brand) => (
                        <MenuItem key={brand.id} value={brand.id}>
                            {brand.nombre}
                        </MenuItem>
                    ))}
                </Select>
                {errors.selectedBrand && <Typography color="error">{errors.selectedBrand}</Typography>}
                <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    displayEmpty
                    {...(errors.selectedCategory && { error: true })}
                >
                    <MenuItem value="">
                        <em>Selecciona una categoría</em>
                    </MenuItem>
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.nombre}
                        </MenuItem>
                    ))}
                </Select>
                {errors.selectedCategory && <Typography color="error">{errors.selectedCategory}</Typography>}
                <input type="file" onChange={handleImageUpload} />
                {previewImage && <img src={previewImage} alt="preview" style={{ width: '100px', height: '100px' }} />}
                <Button type="submit" variant="contained" color="primary">Actualizar</Button>
            </form>
        </Container>
    );
};

export default Edit;
