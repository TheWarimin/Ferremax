import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Button, IconButton, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TextField, Grid, TablePagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Show = () => {
    const [products, setProducts] = useState([]);
    const [newBrand, setNewBrand] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchData = async () => {
            await getCategories();
            await getBrands();
            await getProducts();
            getBrandsAndCategories();
        };
    
        fetchData();
    }, []);

    const getBrandsAndCategories = async () => {
        try {
            const brandsResponse = await axios.get('http://localhost:8000/producto/marca/');
            setBrands(brandsResponse.data);
            const categoriesResponse = await axios.get('http://localhost:8000/producto/Categoria/');
            setCategories(categoriesResponse.data);
        } catch (error) {
            console.error("Error getting brands and categories: ", error);
        }
    };
    
    const addBrand = async () => {
        try {
            const response = await axios.post('http://localhost:8000/producto/marca/', { nombre: newBrand });
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
            await axios.delete(`http://localhost:8000/producto/marca/${id}`);
            await getBrandsAndCategories();
        } catch (error) {
            console.error("Error deleting brand: ", error);
        }
    };

    const addCategory = async () => {
        try {
            const response = await axios.post('http://localhost:8000/producto/Categoria/', { nombre: newCategory });
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
            await axios.delete(`http://localhost:8000/producto/Categoria/${id}`);
            await getBrandsAndCategories();
        } catch (error) {
            console.error("Error deleting category: ", error);
        }
    };

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

    const getCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/producto/Categoria/');
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Error getting categories: ", error);
        }
    };
    
    const getBrands = async () => {
        try {
            const response = await axios.get('http://localhost:8000/producto/marca/');
            if (response.status === 200) {
                setBrands(response.data);
            }
        } catch (error) {
            console.error("Error getting brands: ", error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8000/producto/Producto/${id}/`);
            if (response.status === 204) {
                getProducts();
            }
        } catch (error) {
            console.error("Error deleting product: ", error);
        }
    };

    

    return (
        <div style={{ maxWidth: '60%', margin: 'auto' }}>
        <TableContainer component={Paper}>
        <Table>
    <TableHead>
        <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Miniatura</TableCell>
            <TableCell>Categoría</TableCell> 
            <TableCell>Marca</TableCell> 
            <TableCell>Acciones</TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => {
            const category = categories.find(category => category.id === product.categoria);
            const brand = brands.find(brand => brand.id === product.marca);
            return (
                <TableRow key={product.id}>
                    <TableCell>{product.nombre}</TableCell>
                    <TableCell>{product.precio}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell><img src={product.imagen} alt={product.nombre} style={{ width: '50px', height: '50px' }} /></TableCell>
                    <TableCell>{category ? category.nombre : 'N/A'}</TableCell>
                    <TableCell>{brand ? brand.nombre : 'N/A'}</TableCell>
                    <TableCell>
                        <Button variant="contained" color="secondary" onClick={() => deleteProduct(product.id)}>
                            Eliminar
                        </Button>
                        <Button 
                            component={RouterLink} 
                            to={`/edit/${product.id}`} 
                            variant="contained" 
                            color="primary" 
                            style={{marginLeft: '10px'}}
                        >
                            Editar
                        </Button>
                    </TableCell>
                </TableRow>
            );
        })}
    </TableBody>
</Table>
<TablePagination
    component="div"
    count={products.length}
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
    <Grid item xs={12}>
        <Button 
            component={RouterLink} 
            to="/create" 
            variant="contained" 
            color="primary" 
            style={{marginTop: '10px'}}
        >
            Crear Producto
        </Button>
    </Grid>
    <Grid item xs={6}>
        <Button variant="contained" color="primary" onClick={addBrand}>
            Agregar Marca
        </Button>
        <TextField
            label="Nueva Marca"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            style={{marginLeft: '20px'}}
        />
    </Grid>
    <Grid item xs={6}>
        <Button variant="contained" color="primary" onClick={addCategory}>
            Agregar Categoría
        </Button>
        <TextField
            label="Nueva Categoría"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={{marginLeft: '20px'}}
        />
    </Grid>

    <Grid item xs={6} > 
    <TableContainer style={{ maxHeight: 300, marginBottom: '100px' }}>
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
    <TableContainer style={{ maxHeight: 300, marginBottom: '100px' }}>
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


)
}
export default Show;