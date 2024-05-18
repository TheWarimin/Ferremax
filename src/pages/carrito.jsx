import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios'; 

const Carrito = ({}) => {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);

  const comprar = () => {
    console.log('Comprando', carrito);
  };

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    axios.get(`http://localhost:8000/carritos`)
      .then(response => {
        const userCarrito = response.data.find(carrito => carrito.usuario === userEmail);
        if (userCarrito) {
          const productPromises = userCarrito.productos.map(item =>
            axios.get(`http://localhost:8000/productos/${item.producto}/`)
              .then(response => ({...response.data, cantidad: item.cantidad}))
          );
          Promise.all(productPromises)
            .then(productResponses => {
              const productos = productResponses;
              setCarrito(productos);
              console.log('Carrito:', productos);
            })
            .catch(error => {
              console.error('Error obteniendo los productos:', error);
            });
        } else {
          console.log('No se encontró un carrito para el usuario:', userEmail);
        }
      })
      .catch(error => {
        console.error('Error obteniendo el carrito:', error);
      });
  }, []);

  const irAProductos = () => {
    navigate('/');
  };

  const eliminarProducto = (productoId) => {
    setCarrito(carrito.filter(producto => producto.id !== productoId));
  };
  
  const incrementarCantidad = (productoId) => {
    setCarrito(carrito.map(producto => producto.id === productoId ? {...producto, cantidad: producto.cantidad + 1} : producto));
  };
  
  const disminuirCantidad = (productoId) => {
    setCarrito(carrito.map(producto => producto.id === productoId && producto.cantidad > 1 ? {...producto, cantidad: producto.cantidad - 1} : producto));
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {carrito.length === 0 ? (
        <div onClick={irAProductos}>Agregue Productos</div>
      ) : (
        <table style={{ margin: 'auto', textAlign: 'center', border: '1px solid black' }}>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((producto, index) => (
              <tr key={index}>
                <td><img src={producto.imagen} alt={producto.nombre} style={{ width: '100px', height: '100px' }} /></td>
                <td>{producto.nombre}</td>
                <td>{producto.precio}</td>
                <td>
                  <button onClick={() => disminuirCantidad(producto.id)} style={{ marginRight: '5px', backgroundColor: '#f0ad4e', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px' }}>-</button>
                  {producto.cantidad}
                  <button onClick={() => incrementarCantidad(producto.id)} style={{ marginLeft: '5px', backgroundColor: '#5cb85c', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px' }}>+</button>
                </td>
                <td><button onClick={() => eliminarProducto(producto.id)} style={{ backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px' }}>Eliminar</button></td>
              </tr>
            ))}
            <tr>
              <td colSpan="4">Total</td>
              <td>{carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0)}</td>
            </tr>
          </tbody>
        </table>
      )}
      <button onClick={comprar} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', borderRadius: '5px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>Comprar</button>
    </div>
  );
};

export default Carrito;
