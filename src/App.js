import React, { useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes } from "react-router-dom"; 
import { ColorModeContext, useMode } from "./theme";

import Navbar from "./global/navbar";
import Sidebar from "./global/Sidebar";
import Principal from "./pages/principal";
import {Productos} from "./pages/productos";
import Carrito from "./pages/carrito";
import Crud from "./pages/crud";
import Registro from "./pages/registro";
import Login from "./pages/login";
import Empleados from "./pages/administracion/empleados";
import Envios from "./pages/administracion/envios";
import Inventario from "./pages/administracion/inventario";
import Pedidos from "./pages/administracion/pedidos";
import Reportes from "./pages/administracion/reportes";
import Usuarios from "./pages/administracion/usuarios";
import Show from "./components/Show";
import Edit from "./components/Edit";
import Create from "./components/Create";
import UserContext from '../src/components/UserContext';
import { AuthProvider } from '../src/components/AuthContext';
import axios from 'axios';

function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [theme, colorMode] = useMode();
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Recupera el token del almacenamiento local
  
    axios.get('http://localhost:8000/carritos/1/', {
      headers: {
        'Authorization': `Token ${token}` // Usa el token recuperado
      }
    })
    .then(response => {
      setCarrito(response.data.productos);
    })
    .catch(error => {
      console.error('Error fetching carrito:', error);
    });
  }, []);
  
  const addToCarrito = (producto) => {
    const token = localStorage.getItem('token'); // Recupera el token del almacenamiento local
  
    axios.post('http://localhost:8000/productos-carrito/', {
      carrito: 1, 
      producto: producto.id,
      cantidad: 1
    }, {
      headers: {
        'Authorization': `Token ${token}` // Usa el token recuperado
      }
    })
    .then(response => {
      setCarrito([...carrito, response.data]);
    })
    .catch(error => {
      console.error('Error adding to carrito:', error);
    });
  };

  return (
    <AuthProvider>
      <UserContext.Provider value={userEmail}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app">
              <Navbar />
              <main className="content">
                <Routes>
                  <Route path="/" element={<Principal carrito={carrito} setCarrito={setCarrito} addToCarrito={addToCarrito} />} />
                  <Route path="/productos" element={<Productos />} />
                  <Route path="/carrito" element={<Carrito carrito={carrito} />} />
                  <Route path="/crud" element={<Crud />} /> 
                  <Route path="/empleados" element={<Empleados />} />
                  <Route path="/envios" element={<Envios />} />
                  <Route path="/inventario" element={<Inventario />} />
                  <Route path="/pedidos" element={<Pedidos />} />
                  <Route path="/reportes" element={<Reportes />} />
                  <Route path="/usuarios" element={<Usuarios />} />
                  <Route path="/show" element={<Show />} />
                  <Route path="/edit/:id" element={<Edit />} />
                  <Route path="/create" element={<Create />} />
                  <Route path="/registro" element={<Registro />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </main>
            </div>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </UserContext.Provider>
    </AuthProvider>
  );
}

export default App;
