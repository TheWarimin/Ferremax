import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, TextField, Grid, Box, Select, MenuItem, Button, Input, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Create = () => {
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
    const fileInput = useRef();

    useEffect(() => {
        const fetchBrandsAndCategories = async () => {
            const brandsResponse = await axios.get('http://localhost:8000/producto/marca/');
            const categoriesResponse = await axios.get('http://localhost:8000/producto/Categoria/');
            setBrands(brandsResponse.data);
            setCategories(categoriesResponse.data);
        };

        fetchBrandsAndCategories();
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
    
        // Comprobar el tamaño del archivo (max 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB en bytes
        if (file.size > maxSize) {
            alert('El archivo es demasiado grande. El tamaño máximo permitido es de 2MB.');
            return;
        }
    
        // Comprobar el tipo de archivo (sólo jpeg o png)
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Tipo de archivo no válido. Sólo se permiten archivos JPEG o PNG.');
            return;
        }
    
        setImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('nombre', name);
        formData.append('precio', price);
        formData.append('stock', stock);
        formData.append('marca', selectedBrand);
        formData.append('categoria', selectedCategory);
        
        // Comprobar si la imagen existe antes de añadirla a los datos del formulario
        if (image) {
            formData.append('imagen', image, image.name);
        } else {
            console.error('No se seleccionó ninguna imagen');
            return;
        }
    
        try {
            console.log({
              //  nombre: name,
              //  precio: price,
              //  stock: stock,
              //  marca: selectedBrand,
              //  categoria: selectedCategory,
              //  imagen: image
            });
            const response = await axios.post('http://localhost:8000/producto/Producto/', formData);
            if (response.status === 201) {
                navigate('/inventario');
            }
        } catch (error) {
            console.error('Error al crear el producto: ', error);
        }
    };

    return (
        <Container>
            <Typography variant="h6" component="h2" gutterBottom>
                Crear un nuevo producto
            </Typography>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField label="Nombre" required fullWidth onChange={(e) => setName(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Precio" required fullWidth onChange={(e) => setPrice(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Stock" required fullWidth onChange={(e) => setStock(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <Box sx={{ minWidth: 120 }}>
                    <Select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        fullWidth
                    >
                        {brands.map((brand) => (
                            <MenuItem key={brand.id} value={brand.id}>
                                {brand.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ minWidth: 120 }}>
                    <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        fullWidth
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <input 
                        accept="image/*" 
                        type="file" 
                        ref={fileInput} 
                        style={{ display: 'none' }} 
                        onChange={handleImageUpload} 
                        id="upload-button-file"
                    />
                    <label htmlFor="upload-button-file">
                        <Button variant="contained" color="primary" component="span">
                            Subir imagen
                        </Button>
                    </label>
                    {previewImage && (
                        <Paper elevation={2} style={{ marginTop: '1em', width: '80px', height: '80px' }}>
                            <img 
                                src={previewImage} 
                                alt="Vista previa" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        </Paper>
                    )}
                </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit">
                            Crear
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default Create;