import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ValorDolar } from '../components/bancoApi';  

const Carrito = () => {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [dollarValue, setDollarValue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tokenWs, setTokenWs] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);
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
    const user_id = localStorage.getItem('user_id');  // Obtener el ID del usuario del localStorage
    const products = carrito.map(producto => ({id: producto.id, quantity: producto.cantidad}));  // Crear una lista de productos con 'id' y 'quantity'
    const return_url = 'http://localhost:3000/';  // URL de retorno después de la compra
    console.log('Comprando:', user_id, products, totalCLP, return_url, token);
    fetch('http://localhost:8000/webpay/', {  // Reemplaza esta URL con la URL de tu vista `WebpayView`
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`  // Enviar el token en el encabezado de la solicitud
        },
        body: JSON.stringify({
            user_id: user_id,
            amount: totalCLP,
            products: products,
            return_url: return_url, 
        })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setTokenWs(data.retorno_webpay.token); 
      setShowModal(true);
  
      // Crear un nuevo div para contener el formulario
      let div = document.createElement('div');
  
      // Generar el formulario HTML con los datos recibidos
      div.innerHTML = `
          <form method="post" action="${data.retorno_webpay.url}">
              <input name="token_ws" value="${data.retorno_webpay.token}" />
              <input type="submit" value="Ir a pagar" />
          </form>
      `;
  
      // Agregar el div al cuerpo del documento
      document.body.appendChild(div);
  
      // Enviar el formulario automáticamente
      div.querySelector('form').submit();
  })
  .catch((error) => {
      console.error('Error:', error);
  });
  };

  const confirmarTransaccion = () => {
    if (tokenWs) {
      console.log('tokenWS:', tokenWs);
      fetch('http://localhost:8000/webpayreturn/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token_ws: tokenWs
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Confirmación:', data);
        setTransactionStatus(data.detail);
        setShowModal(false);  // Oculta el modal
      })
      .catch((error) => {
        console.error('Error:', error);
        setTransactionStatus('Error al confirmar el pago.');
      });
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
                    <button onClick={() => incrementarCantidad(producto.id)}>+</button>
                    <button onClick={() => disminuirCantidad(producto.id)}>-</button>
                    <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div>
        <h3>Total: {totalCLP} CLP / {totalUSD} USD</h3>
        <button onClick={comprar}>Comprar</button>
      </div>
      <button onClick={irAProductos}>Volver a productos</button>

      {/* Modal de Confirmación */}
      {showModal && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'grey', padding: '20px', borderRadius: '10px', zIndex: 1000 }}>
          <h2>Confirmación de Pago</h2>
          <p>¿Desea confirmar la transacción?</p>
          <button onClick={confirmarTransaccion}>Confirmar</button>
          <button onClick={() => setShowModal(false)}>Cancelar</button>
        </div>
      )}

      {/* Mensaje de Estado de la Transacción */}
      {transactionStatus && (
        <div style={{ marginTop: '20px', color: transactionStatus === 'Transacción autorizada.' ? 'green' : 'red' }}>
          {transactionStatus}
        </div>
      )}
    </div>
  );
};

export default Carrito;
