import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { 
    Button, 
    IconButton, 
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody, 
    TableContainer, 
    Paper, 
    TextField, 
    Grid, 
    TablePagination, 
    Checkbox, 
    Typography, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    width: '600px', 
    height: '400px',
}));

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
    const [brandError, setBrandError] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
    const [currentDescription, setCurrentDescription] = useState('');
    const [currentProductId, setCurrentProductId] = useState(null);

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
                setFilteredProducts(response.data);
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

    const validateBrand = () => {
        if (!newBrand.trim()) {
            setBrandError("La marca es requerida.");
            return false;
        }
        setBrandError('');
        return true;
    };

    const addBrand = async () => {
        if (validateBrand()) {
            try {
                const response = await axios.post('http://localhost:8000/marca/', { nombre: newBrand });
                if (response.status === 201) {
                    setNewBrand('');
                    await getBrandsAndCategories();
                }
            } catch (error) {
                console.error("Error adding brand: ", error);
            }
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

    const validateCategory = () => {
        if (!newCategory.trim()) {
            setCategoryError("La categoría es requerida.");
            return false;
        }
        setCategoryError('');
        return true;
    };

    const addCategory = async () => {
        if (validateCategory()) {
            try {
                const response = await axios.post('http://localhost:8000/Categoria/', { nombre: newCategory });
                if (response.status === 201) {
                    setNewCategory('');
                    await getBrandsAndCategories();
                }
            } catch (error) {
                console.error("Error adding category: ", error);
            }
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

    const openDescriptionModal = (productId, description = false) => {
        setCurrentProductId(productId);
        setCurrentDescription(description);
        setDescriptionModalOpen(true);
    };

    const closeDescriptionModal = () => {
        setDescriptionModalOpen(false);
        setCurrentDescription('');
        setCurrentProductId(null);
    };

    const handleDescriptionChange = (e) => {
        setCurrentDescription(e.target.value);
    };

    const addDescription = async () => {
        if (!currentDescription.trim()) {
            alert('La descripción no puede estar vacía.');
            return;
        }
        if (!currentProductId) {
            alert('No se ha seleccionado ningún producto.');
            return;
        }
        try {
            const response = await axios.patch(`http://localhost:8000/Producto/${currentProductId}/`, { descripcion: currentDescription });
            if (response.status === 200) { // 200 OK indica que la actualización fue exitosa
                getProducts();
                closeDescriptionModal();
            }
        } catch (error) {
            console.error("Error adding description: ", error);
        }
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
                            <TableCell>Descripción</TableCell>
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
                                    <TableCell>{category ? category.nombre : ''}</TableCell>
                                    <TableCell>{brand ? brand.nombre : ''}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => openDescriptionModal(product.id, product.descripcion)}>
                                            Añadir Descripción
                                        </Button>
                                    </TableCell>
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
                />
            </TableContainer>
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
                
            <Grid container spacing={3} style={{ marginTop: '5%', marginBottom: '10%' }}>
                <Grid item xs={6}>
                    <Typography variant="h6">Administrar Marcas</Typography>
                    <TextField
                        label="Nueva Marca"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        error={!!brandError}
                        helperText={brandError}
                    />
                    <Button onClick={addBrand} variant="contained" color="primary" fullWidth>Agregar Marca</Button>
                    <div style={{ height: '300px', overflowY: 'scroll' }}>
                    {brands.map((brand) => (
                        <div key={brand.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            {brand.nombre}
                            <IconButton onClick={() => deleteBrand(brand.id)} color="secondary">
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    ))}
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6">Administrar Categorías</Typography>
                    <TextField
                        label="Nueva Categoría"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        error={!!categoryError}
                        helperText={categoryError}
                    />
                    <Button onClick={addCategory} variant="contained" color="primary" fullWidth>Agregar Categoría</Button>
                    <div style={{ height: '300px', overflowY: 'scroll' }}>
                    {categories.map((category) => (
                        <div key={category.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            {category.nombre}
                            <IconButton onClick={() => deleteCategory(category.id)} color="secondary">
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    ))}
                    </div>
                </Grid>
            </Grid>

            <Dialog open={descriptionModalOpen} onClose={closeDescriptionModal}>
                <DialogTitle>Añadir Descripción</DialogTitle>
                <StyledDialogContent>
                    <TextField
                        label="Descripción"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={14}
                        value={currentDescription}
                        onChange={handleDescriptionChange}
                    />
                </StyledDialogContent>
                <DialogActions>
                    <Button onClick={closeDescriptionModal} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={addDescription} color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Show;