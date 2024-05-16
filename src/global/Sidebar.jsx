import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import React from 'react';

const SidebarComponent = () => (
    <Sidebar>
        <Menu
            menuItemStyles={{
                button: {
                    [`&.active`]: {
                        backgroundColor: '#13395e',
                        color: '#b6c8d9',
                    },
                },
            }}
        >
            <MenuItem component={<Link to="/usuarios" />}> Usuarios</MenuItem>
            <MenuItem component={<Link to="/empleados" />}> Empleados</MenuItem>
            <MenuItem component={<Link to="/inventario" />}> Inventario</MenuItem>
            <MenuItem component={<Link to="/pedidos" />}> Pedidos</MenuItem>
            <MenuItem component={<Link to="/envios" />}> Envios</MenuItem>
            <MenuItem component={<Link to="/reportes" />}> Reportes</MenuItem>
        </Menu>
    </Sidebar>
);

export default SidebarComponent;