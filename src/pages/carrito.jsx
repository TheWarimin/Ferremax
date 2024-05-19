import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ValorDolar } from '../components/bancoApi';  

const Carrito = () => {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [dollarValue, setDollarValue] = useState(null);
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchCarrito = async () => {
      try {
        const response = await axios.get('http://localhost:8000/carritos/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        const userCarrito = response.data.find(carrito => carrito.usuario === userEmail);
        if (userCarrito) {
          const productPromises = userCarrito.productos.map(item =>
            axios.get(`http://localhost:8000/Producto/${item.producto}/`, {
              headers: {
                'Authorization': `Token ${token}`
              }
            }).then(response => ({
              ...response.data, 
              cantidad: item.cantidad, 
              productoCarritoId: item.id
            }))
          );
          const productos = await Promise.all(productPromises);
          setCarrito(productos);
        } else {
          console.log('No se encontró un carrito para el usuario:', userEmail);
        }
      } catch (error) {
        console.error('Error obteniendo el carrito:', error);
      }
    };

    const fetchDollarValue = async () => {
      try {
        const value = await ValorDolar();
        setDollarValue(value);
      } catch (error) {
        console.error('Error obteniendo el valor del dólar:', error);
      }
    };

    fetchCarrito();
    fetchDollarValue();
  }, [userEmail, token]);

  const actualizarCarrito = async (productoCarritoId, nuevaCantidad) => {
    try {
      console.log('token:', token);
      const response = await axios.put(`http://localhost:8000/productos-carrito/${productoCarritoId}/`, 
        { 
          cantidad: nuevaCantidad,
          producto: productoCarritoId
        }, 
        {
          headers: {
            'Authorization': `Token ${token}`
          }
        }
      );
      console.log('Carrito actualizado:', response.data);
    } catch (error) {
      console.error('Error actualizando el carrito:', error);
    }
  };

  const eliminarDelCarrito = async (productoCarritoId) => {
    try {
      await axios.delete(`http://localhost:8000/productos-carrito/${productoCarritoId}/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setCarrito(carrito.filter(producto => producto.productoCarritoId !== productoCarritoId));
      console.log('Producto eliminado del carrito');
    } catch (error) {
      console.error('Error eliminando el producto del carrito:', error);
    }
  };

  const incrementarCantidad = (productoId) => {
    const producto = carrito.find(producto => producto.id === productoId);
    const nuevaCantidad = producto.cantidad + 1;
    setCarrito(carrito.map(producto => producto.id === productoId ? {...producto, cantidad: nuevaCantidad} : producto));
    actualizarCarrito(producto.productoCarritoId, nuevaCantidad);
  };

  const disminuirCantidad = (productoId) => {
    const producto = carrito.find(producto => producto.id === productoId);
    if (producto.cantidad > 1) {
      const nuevaCantidad = producto.cantidad - 1;
      setCarrito(carrito.map(producto => producto.id === productoId ? {...producto, cantidad: nuevaCantidad} : producto));
      actualizarCarrito(producto.productoCarritoId, nuevaCantidad);
    }
  };

  const eliminarProducto = (productoId) => {
    const producto = carrito.find(producto => producto.id === productoId);
    eliminarDelCarrito(producto.productoCarritoId);
  };

  const irAProductos = () => {
    navigate('/');
  };

  const comprar = () => {
    console.log('Comprando', carrito);
  };

  const totalCLP = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  const totalUSD = dollarValue ? (totalCLP / dollarValue).toFixed(2) : 'Calculando...';

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
                <td>
                  <button onClick={() => eliminarProducto(producto.id)} style={{ backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px' }}>Eliminar</button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="4">Total en CLP</td>
              <td>{totalCLP}</td>
            </tr>
            <tr>
              <td colSpan="4">Total en USD</td>
              <td>{totalUSD}</td>
            </tr>
          </tbody>
        </table>
      )}
      <button onClick={comprar} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', borderRadius: '5px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>Comprar</button>
    </div>
  );
}

export default Carrito;
