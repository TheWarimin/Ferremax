import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { FaUsers, FaUserTie, FaWarehouse, FaShoppingCart, FaTruck, FaChartLine } from 'react-icons/fa';

const SidebarComponent = () => {
    return (
        <div style={{ position: 'absolute', top: '64px', bottom: '64px', left: 30, zIndex: 1000 }}>
            <Sidebar 
                width="240px"
                style={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: '#292828' }}
            >
                <Menu
                    menuItemStyles={{
                        button: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            padding: '10px 20px',
                            backgroundColor: '#292828', 
                            color: 'white',
                            borderRadius: '5px', 
                            margin: '2px 5px',
                            [`&.active`]: {
                                backgroundColor: '#13395e',
                                color: '#b6c8d9',
                            },
                            '&:hover': {
                                backgroundColor: '#4F4F4F', 
                            },
                            svg: {
                                marginRight: '10px',
                            },
                        },
                        label: {
                            marginLeft: '10px',
                        },
                    }}
                >
                    <MenuItem icon={<FaUsers />} component={<Link to="/usuarios" />}>Usuarios</MenuItem>
                    <MenuItem icon={<FaUserTie />} component={<Link to="/empleados" />}>Empleados</MenuItem>
                    <MenuItem icon={<FaWarehouse />} component={<Link to="/inventario" />}>Inventario</MenuItem>
                    <MenuItem icon={<FaShoppingCart />} component={<Link to="/pedidos" />}>Pedidos</MenuItem>
                    <MenuItem icon={<FaTruck />} component={<Link to="/envios" />}>Envios</MenuItem>
                    <MenuItem icon={<FaChartLine />} component={<Link to="/reportes" />}>Reportes</MenuItem>
                </Menu>
            </Sidebar>
        </div>
    );
};

export default SidebarComponent;
