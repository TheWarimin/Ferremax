import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Button, IconButton, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TextField, Grid, TablePagination, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Show = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newBrand, setNewBrand] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const getCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/Categoria/');
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Error getting categories: ", error);
        }
    };

    const getBrands = async () => {
        try {
            const response = await axios.get('http://localhost:8000/marca/');
            if (response.status === 200) {
                setBrands(response.data);
            }
        } catch (error) {
            console.error("Error getting brands: ", error);
        }
    };

    const getProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/Producto/');
            if (response.status === 200) {
                setProducts(response.data);
                setFilteredProducts(response.data); // Inicializamos productos filtrados con todos los productos
            }
        } catch (error) {
            console.error("Error getting products: ", error);
        }
    };

    const fetchData = async () => {
        await getCategories();
        await getBrands();
        await getProducts();
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getBrandsAndCategories = async () => {
        try {
            const brandsResponse = await axios.get('http://localhost:8000/marca/');
            setBrands(brandsResponse.data);
            const categoriesResponse = await axios.get('http://localhost:8000/Categoria/');
            setCategories(categoriesResponse.data);
        } catch (error) {
            console.error("Error getting brands and categories: ", error);
        }
    };

    const addBrand = async () => {
        try {
            const response = await axios.post('http://localhost:8000/marca/', { nombre: newBrand });
            if (response.status === 201) {
                setNewBrand('');
                await getBrandsAndCategories();
            }
        } catch (error) {
            console.error("Error adding brand: ", error);
        }
    };

    const deleteBrand = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/marca/${id}`);
            await getBrandsAndCategories();
        } catch (error) {
            console.error("Error deleting brand: ", error);
        }
    };

    const addCategory = async () => {
        try {
            const response = await axios.post('http://localhost:8000/Categoria/', { nombre: newCategory });
            if (response.status === 201) {
                setNewCategory('');
                await getBrandsAndCategories();
            }
        } catch (error) {
            console.error("Error adding category: ", error);
        }
    };

    const deleteCategory = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/Categoria/${id}`);
            await getBrandsAndCategories();
        } catch (error) {
            console.error("Error deleting category: ", error);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        filterProducts(e.target.value);
    };

    const filterProducts = (query) => {
        const filtered = products.filter(product =>
            product.nombre.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const deleteProduct = async () => {
        if (selectedProductId) {
            try {
                const response = await axios.delete(`http://localhost:8000/Producto/${selectedProductId}/`);
                if (response.status === 204) {
                    getProducts();
                    setSelectedProductId(null);
                }
            } catch (error) {
                console.error("Error deleting product: ", error);
            }
        }
    };

    const handleSelectProduct = (productId) => {
        setSelectedProductId(productId === selectedProductId ? null : productId);
    };

    return (
        <div style={{ maxWidth: '60%', margin: 'auto' }}>
            <TextField
                label="Buscar productos"
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
                            <TableCell></TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Miniatura</TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell>Marca</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => {
                            const category = categories.find(category => category.id === product.categoria);
                            const brand = brands.find(brand => brand.id === product.marca);
                            return (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedProductId === product.id}
                                            onChange={() => handleSelectProduct(product.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{product.nombre}</TableCell>
                                    <TableCell>{product.precio}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell><img src={product.imagen} alt={product.nombre} style={{ width: '50px', height: '50px' }} /></TableCell>
                                    <TableCell>{category ? category.nombre : 'N/A'}</TableCell>
                                    <TableCell>{brand ? brand.nombre : 'N/A'}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredProducts.length}
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
            <Grid container spacing={3}>
                <Grid item xs={12} container spacing={2}>
                    <Grid item>
                        <Button
                            component={RouterLink}
                            to="/create"
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '10px' }}
                        >
                            Crear Producto
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={deleteProduct}
                            disabled={!selectedProductId}
                            style={{ marginTop: '10px' }}
                        >
                            Eliminar
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            component={RouterLink}
                            to={`/edit/${selectedProductId}`}
                            variant="contained"
                            color="primary"
                            disabled={!selectedProductId}
                            style={{ marginTop: '10px' }}
                        >
                            Editar
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Nueva Marca"
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        style={{ marginTop: '10px', width: '100%' }}
                    />
                    <Button variant="contained" color="primary" onClick={addBrand} style={{ marginTop: '10px' }}>
                        Agregar Marca
                    </Button>
                    <TableContainer style={{ maxHeight: 300, marginTop: '10px' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Marca</TableCell>
                                    <TableCell>Eliminar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {brands.map((brand) => (
                                    <TableRow key={brand.id}>
                                        <TableCell>{brand.nombre}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => deleteBrand(brand.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Nueva Categoría"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        style={{ marginTop: '10px', width: '100%' }}
                    />
                    <Button variant="contained" color="primary" onClick={addCategory} style={{ marginTop: '10px' }}>
                        Agregar Categoría
                    </Button>
                    <TableContainer style={{ maxHeight: 300, marginTop: '10px' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Categoría</TableCell>
                                    <TableCell>Eliminar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{category.nombre}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => deleteCategory(category.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </div>
    );
};

export default Show;
