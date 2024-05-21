import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ValorDolar } from '../components/bancoApi';  

const Carrito = () => {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [dollarValue, setDollarValue] = useState(null);
  const [tokenWs, setTokenWs] = useState(null);
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

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

  useEffect(() => {
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

  const incrementarCantidad = (producto) => {
    axios.put(`http://localhost:8000/productos-carrito/${producto.productoCarritoId}/`, {
      producto: producto.id,
      cantidad: Math.max(0, producto.cantidad + 1),
    }, {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(() => {
      fetchCarrito();
    })
    .catch(error => {
      console.error('Error incrementing quantity:', error);
    });
  };
  
  const disminuirCantidad = (producto) => {
    axios.put(`http://localhost:8000/productos-carrito/${producto.productoCarritoId}/`, {
      producto: producto.id,
      cantidad: Math.max(0, producto.cantidad - 1),
    }, {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(() => {
      fetchCarrito();
    })
    .catch(error => {
      console.error('Error decreasing quantity:', error);
    });
  };
  
  const eliminarDelCarrito = (producto) => {
    axios.delete(`http://localhost:8000/productos-carrito/${producto.productoCarritoId}/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(() => {
      setCarrito(carrito.filter(item => item.id !== producto.id));
    })
    .catch(error => {
      console.error('Error deleting product:', error);
    });
  };

  const irAProductos = () => {
    navigate('/');
  };

  const comprar = async () => {
    const user_id = localStorage.getItem('user_id');
    const products = carrito.map(producto => ({ id: producto.id, quantity: producto.cantidad }));
    const return_url = 'http://localhost:3000/PProducto/';
    try {
        const response = await fetch('http://localhost:8000/webpay/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                user_id: user_id,
                amount: totalCLP,
                products: products,
                return_url: return_url,
            })
        });
        const data = await response.json();
        console.log('Success:', data);
        setTokenWs(data.retorno_webpay.token);
        let div = document.createElement('div');
        div.innerHTML = `
            <form method="post" action="${data.retorno_webpay.url}">
                <input type="hidden" name="token_ws" value="${data.retorno_webpay.token}" />
                <input type="submit" value="Ir a pagar" />
            </form>
        `;
        document.body.appendChild(div);
        div.querySelector('form').submit();
    } catch (error) {
        console.error('Error:', error);
    }
  };
  

  const totalCLP = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  const totalUSD = dollarValue ? (totalCLP / dollarValue).toFixed(2) : 'Calculando...';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {carrito.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <ul>
          {carrito.map(producto => (
            <li key={producto.id}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                  <img src={producto.imagen} alt={producto.nombre} width="50" height="50" />
                </div>
                <div style={{ marginLeft: '10px' }}>
                  <h4>{producto.nombre}</h4>
                  <p>Cantidad: {producto.cantidad}</p>
                  <p>Precio: {producto.precio}</p>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 24px', margin: '8px 0', border: 'none', cursor: 'pointer', borderRadius: '4px', margin: '4px 2px' }} onClick={() => incrementarCantidad(producto)}>+</button>
                    <button style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 24px', margin: '8px 0', border: 'none', cursor: 'pointer', borderRadius: '4px', margin: '4px 2px' }} onClick={() => disminuirCantidad(producto)}>-</button>
                    <button style={{ backgroundColor: '#F1C70B', color: 'black', padding: '10px 24px', margin: '8px 0', border: 'none', cursor: 'pointer', borderRadius: '4px', margin: '4px 2px' }} onClick={() => eliminarDelCarrito(producto)}>Eliminar</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div>
        <h3>Total: {totalCLP} CLP / {totalUSD} USD</h3>
        <button style={{ backgroundColor: '#4CAF50', color: 'white', padding: '15px 32px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '16px', margin: '4px 2px', cursor: 'pointer', borderRadius: '10px' }} onClick={comprar}>Comprar</button>
        <button style={{ backgroundColor: '#008CBA', color: 'white', padding: '15px 32px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '16px', margin: '4px 2px', cursor: 'pointer', borderRadius: '10px' }} onClick={irAProductos}>Volver a Producto</button>
      </div>
    </div>
  );
};

export default Carrito;
