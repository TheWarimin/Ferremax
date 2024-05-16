import { ColorModeContext, useMode} from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom"; 

import React from 'react';
import Navbar from "./global/navbar";
import Sidebar from "./global/Sidebar";
import index from "./pages/index";
import Productos from "./pages/productos";
import Carrito from "./pages/carrito";
import Crud from "./pages/crud";
import Principal from "./pages/principal";

import Empleados from "./pages/administracion/empleados";
import Envios from "./pages/administracion/envios";
import Inventario from "./pages/administracion/inventario";
import Pedidos from "./pages/administracion/pedidos";
import Reportes from "./pages/administracion/reportes";
import Usuarios from "./pages/administracion/usuarios";

import Show from "./components/Show";
import Edit from "./components/Edit";
import Create from "./components/Create";

function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <div className="app">
            <main className="content">
              <Navbar/>
              <Routes>
                <Route path="/index" element={<index/>}/>
                <Route path="/productos" element={<Productos/>}/>
                <Route path="/carrito" element={<Carrito/>}/>
                <Route path="/crud" element={<Crud/>}/> 
                <Route path="/principal" element={<Principal/>}/>
                <Route path="/empleados" element={<Empleados/>}/>
                <Route path="/envios" element={<Envios/>}/>
                <Route path="/inventario" element={<Inventario/>}/>
                <Route path="/pedidos" element={<Pedidos/>}/>
                <Route path="/reportes" element={<Reportes/>}/>
                <Route path="/usuarios" element={<Usuarios/>}/>
                <Route path="/show" element={<Show/>}/>
                <Route path="/edit/:id" element={<Edit/>}/>
                <Route path="/create" element={<Create/>}/>
              </Routes>
            </main>
          </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
export default App;
