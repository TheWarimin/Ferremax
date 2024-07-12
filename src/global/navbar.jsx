import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, IconButton, InputBase, Popover, List, ListItem, ListItemText, Select, MenuItem } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { ColorModeContext, tokens } from "../theme";
import { AuthContext } from '../components/AuthContext';
import Logo from '../Static/Ferremax_logo_trasparente.png';
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from '@mui/icons-material/People';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Navbar = ({ onCurrencyChange }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(localStorage.getItem('selectedCurrency') || 'Peso');
  const { isLoggedIn, logOut, userEmail, isEmployee } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [productos, setProductos] = useState([]);
  const [tablaProductos, setTablaProductos] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [users, setUsers] = useState([]);

  const peticionGet = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/Producto/');
      setProductos(response.data);
      setTablaProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };
  
  const handleSearch = () => {
    filtrar(searchQuery);
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    filtrar(e.target.value);
    setAnchorEl(e.currentTarget);
  };

  const filtrar = (terminoBusqueda) => {
    const resultadosBusqueda = tablaProductos.filter((elemento) => 
      elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
    );
    setResults(resultadosBusqueda);
  };

  useEffect(() => {
    peticionGet();
  }, []);

  const irACarrito = () => {
    navigate('/carrito');
  };

  const irAPrincipal = () => {
    navigate('/');
  };

  const iraRegistro = () => {
    navigate('/registro');
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleLogout = () => {
    logOut();
    navigate('/');
    handleClose(); 
  };

  const handleButtonClick = () => {
    if (isLoggedIn) {
      handleClickOpen();
    } else {
      iraRegistro();
    }
  };

  const handleSelectChange = async (event) => {
    const selectedCurrency = event.target.value;
    setSelectedCurrency(selectedCurrency);

    let url;
    let valorGeneral;
    switch (selectedCurrency) {
        case 'Dolar':
            url = 'http://localhost:8000/valor-dolar/';
            break;
        case 'Euro':
            url = 'http://localhost:8000/valor-euro/';
            break;
        case 'Arg':
            url = 'http://localhost:8000/valor-arg/';
            break;
        case 'Peso':
            valorGeneral = 1;
            localStorage.setItem('valorGeneral', valorGeneral);
            localStorage.setItem('selectedCurrency', 'Peso');
            onCurrencyChange('Peso', valorGeneral);
            return;
        default:
            return;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        valorGeneral = data.valor;
        localStorage.setItem('valorGeneral', valorGeneral);
        localStorage.setItem('selectedCurrency', selectedCurrency);
        onCurrencyChange(selectedCurrency, valorGeneral);
    } catch (error) {
        console.error("Error getting currency value: ", error);
    }
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const irAUsuarios = () => {
    navigate('/usuarios');
  };

  const handleResultClick = (productId) => {
    navigate(`/product/${productId}`);
    handleClosePopover();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" p={2}>
        <Box display="flex" borderRadius="3px">
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Buscar"
            value={searchQuery}
            onChange={handleChange}
            onFocus={(e) => setAnchorEl(e.currentTarget)}
          />
          <IconButton type="button" sx={{ p: 1 }} onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            disableAutoFocus
            disableEnforceFocus
            disableRestoreFocus
          >
            <Box sx={{ maxHeight: '300px', overflowY: 'scroll'}}>
              <List>
                {results.map((producto) => (
                  <ListItem key={producto.id} button onClick={() => handleResultClick(producto.id)}>
                    <ListItemText primary={producto.nombre} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Popover>
        </Box>

        <Box>
          <IconButton type="button" onClick={irAPrincipal}>
            <img src={Logo} alt="Logo" style={{ width: '170px', height: '38px' }} />
          </IconButton>
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Cerrar sesión</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que quieres cerrar sesión?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleLogout}>Cerrar sesión</Button>
          </DialogActions>
        </Dialog>

        <Box display="flex">
          <Select
            value={selectedCurrency}
            onChange={handleSelectChange}
            sx={{ p: 1 }}
          >
            <MenuItem value={'Dolar'}>Dolar</MenuItem>
            <MenuItem value={'Euro'}>Euro</MenuItem>
            <MenuItem value={'Arg'}>Peso Argentino</MenuItem>
            <MenuItem value={'Peso'}>Peso Chileno</MenuItem>
          </Select>
          <IconButton type="button" sx={{ p: 1 }} onClick={irACarrito}>
            <ShoppingCartOutlinedIcon />
          </IconButton>
          <IconButton type="button" sx={{ p: 1 }}>
            <NotificationsOutlinedIcon />
          </IconButton>
          {isLoggedIn && isEmployee && (
            <IconButton type="button" sx={{ p: 1 }} onClick={irAUsuarios}>
              <PeopleIcon />
            </IconButton>
          )}
          <IconButton type="button" sx={{ p: 1 }} onClick={handleButtonClick}>
            <PersonOutlinedIcon />
          </IconButton>
          <IconButton type="button" sx={{ p: 1 }} onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
