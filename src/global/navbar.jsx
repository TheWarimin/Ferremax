import { Box, IconButton, Button, InputBase } from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';

import Logo from '../Static/Ferremax_logo_trasparente.png';
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchIcon from "@mui/icons-material/Search";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Navbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const { isLoggedIn, logOut, setUserEmail } = useContext(AuthContext);

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
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    logOut();
    setUserEmail('');
  };

  const handleButtonClick = () => {
    if (isLoggedIn) {
      handleClickOpen();
    } else {
      iraRegistro();
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box display="flex" borderRadius="3px">
        <InputBase sx={{ lm: 2, flex: 1 }} placeholder="Buscar" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      <Box>
        <IconButton type="button" onClick={irAPrincipal}>
          <img src={Logo} alt="Logo" style={{ width: '170px', height: '38px' }} />
        </IconButton>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Cerrar sesión</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres cerrar sesión?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleClose}>Cerrar sesión</Button>
        </DialogActions>
      </Dialog>

      <Box display="flex">
        <IconButton type="button" sx={{ p: 1 }} onClick={irACarrito}>
          <ShoppingCartOutlinedIcon />
        </IconButton>
        <IconButton type="button" sx={{ p: 1 }}>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton type="button" sx={{ p: 1 }}>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton type="button" sx={{ p: 1 }} onClick={handleButtonClick}>
          <PersonOutlinedIcon />
        </IconButton>
        <IconButton type="button" sx={{ p: 1 }} onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Navbar;
