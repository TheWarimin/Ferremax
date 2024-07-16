import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Carrito = () => {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [dollarValue, setDollarValue] = useState(null);
  const [tokenWs, setTokenWs] = useState(null);
  const [metodosPago, setMetodosPago] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [envio, setEnvio] = useState('domicilio');
  const [sucursal, setSucursal] = useState(null);
  const [metodoPago, setMetodoPago] = useState(null);
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    fetchCarrito();
    fetchMetodosPago();
    fetchSucursales();
    fetchDollarValue();
    fetchUserDetails();
  }, []);

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

  const fetchMetodosPago = async () => {
    try {
      const response = await axios.get('http://localhost:8000/metodos-pago/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setMetodosPago(response.data);
    } catch (error) {
      console.error('Error obteniendo los métodos de pago:', error);
    }
  };

  const fetchSucursales = async () => {
    try {
      const response = await axios.get('http://localhost:8000/sucursales/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setSucursales(response.data);
    } catch (error) {
      console.error('Error obteniendo las sucursales:', error);
    }
  };

  const fetchDollarValue = async () => {
    try {
      const response = await axios.get('http://localhost:8000/valor-dolar/');
      setDollarValue(response.data.valor);
    } catch (error) {
      console.error(`Hubo un problema con la solicitud: ${error.message}`);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:8000/usuarios/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      const users = response.data;
      const userDetails = users.find(user => user.email === userEmail);
      if (userDetails) {
        setDireccion(userDetails.direccion || '');
        setTelefono(userDetails.telefono || '');
      } else {
        console.error('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error obteniendo los detalles del usuario:', error);
    }
  };

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
      console.error('Error incrementando la cantidad:', error);
    });
  };

  const disminuirCantidad = (producto) => {
    axios.put(`http://localhost:8000/productos-carrito/${producto.productoCarritoId}/`, {
      producto: producto.id,
      cantidad: Math.max(1, producto.cantidad - 1),
    }, {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(() => {
      fetchCarrito();
    })
    .catch(error => {
      console.error('Error disminuyendo la cantidad:', error);
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
      console.error('Error eliminando el producto:', error);
    });
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
          amount: totalCLP + (envio === 'domicilio' ? 3000 : 0),
          products: products,
          return_url: return_url,
        })
      });

      const data = await response.json();
      console.log('Success:', data);
      setTokenWs(data.retorno_webpay.token);
      let div = document.createElement('div');
      div.innerHTML = 
        `<form method="post" action="${data.retorno_webpay.url}">
          <input type="hidden" name="token_ws" value="${data.retorno_webpay.token}" />
          <input type="submit" value="Ir a pagar" />
        </form>`;
      document.body.appendChild(div);
      div.querySelector('form').submit();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCompra = async () => {
    const user_id = localStorage.getItem('user_id');
    const totalCLP = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
    const products = carrito.map(producto => ({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: producto.cantidad,
    }));
  
    try {
      const response = await axios.post('http://localhost:8000/pedidos/', {
        metodo_pago: metodoPago,
        envio: envio,
        sucursal: sucursal,
        direccion: direccion,
        telefono: telefono,
        total: totalCLP,
        usuario: user_id,
        productos: products,
      }, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      navigate('/');
    } catch (error) {
      console.error('Error realizando la compra:', error);
    }
  };

  const realizarCompra = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío. Añade productos al carrito antes de realizar la compra.');
      return;
    }
    if (!metodoPago) {
      alert('Seleccione un método de pago antes de realizar la compra.');
      return;
    }
    if (!direccion || !telefono) {
      alert('Debe ingresar una dirección y número de contacto antes de realizar la compra.');
      return;
    }
    
    if (metodoPago === '1') {
      comprar();
      handleCompra();
    } else {
      handleCompra();
    }
  };
  
  const totalCLP = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  const totalUSD = dollarValue ? ((totalCLP + (envio === 'domicilio' ? 3000 : 0)) / dollarValue).toFixed(2) : 'Calculando...';

  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ flex: 1, paddingLeft: '38%' }}>
        <h2>Carrito de Compras</h2>
        {carrito.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <ul>
            {carrito.map(producto => (
              <li key={producto.id} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div>
                    <img src={producto.imagen} alt={producto.nombre} style={{width: '160px',height:'160px', borderRadius: '6px' }} />
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <h4>{producto.nombre}</h4>
                    <p>Cantidad: {producto.cantidad}</p>
                    <p>Precio: {producto.precio}</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 24px', margin: '8px 0', border: 'none', cursor: 'pointer', borderRadius: '4px', margin: '5px' }} onClick={() => incrementarCantidad(producto)}>+</button>
                      <button style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 24px', margin: '8px 0', border: 'none', cursor: 'pointer', borderRadius: '4px', margin: '5px' }} onClick={() => disminuirCantidad(producto)}>-</button>
                      <button style={{ backgroundColor: '#008CBA', color: 'white', padding: '10px 24px', margin: '8px 0', border: 'none', cursor: 'pointer', borderRadius: '4px', margin: '5px' }} onClick={() => eliminarDelCarrito(producto)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ flex: 1, paddingLeft: '5%' }}>
        <h2>Resumen de la compra</h2>
        <p>Total CLP: ${totalCLP + (envio === 'domicilio' ? 3000 : 0)}</p>
        <p>Total USD: ${totalUSD}</p>

        <h3>Métodos de Pago</h3>
        <select onChange={(e) => setMetodoPago(e.target.value)} style={{ width: '45%', padding: '12px', border: '1px solid #ccc', borderRadius: '10px'}}>
          <option value="">Seleccione un método de pago</option>
          {metodosPago.map(metodo => (
            <option key={metodo.id} value={metodo.id}>{metodo.nombre}</option>
          ))}
        </select>

        <h3>Tipo de Envío</h3>
        <select onChange={(e) => setEnvio(e.target.value)} style={{ width: '45%', padding: '12px', border: '1px solid #ccc', borderRadius: '10px' }}>
          <option value="domicilio">Envío a Domicilio</option>
          <option value="sucursal">Retiro en Sucursal</option>
        </select>

        {envio === 'domicilio' ? (
          <div>
            <h3>Dirección de Envío</h3>
            <input 
              type="text" 
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ingrese su dirección"
              style={{ width: '60%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <h3>Teléfono de Contacto</h3>
            <input 
              type="text" 
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ingrese su teléfono"
              style={{ width: '60%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
        ) : (
          <div>
            <h3>Seleccione una Sucursal</h3>
            <select onChange={(e) => setSucursal(e.target.value)} style={{ width: '45%', padding: '12px', border: '1px solid #ccc', borderRadius: '10px' }}>
              <option value="">Seleccione una sucursal</option>
              {sucursales.map(sucursal => (
                <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre} - {sucursal.direccion}</option>
              ))}
            </select>
          </div>
        )}

        <button onClick={realizarCompra} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '15px 32px', margin: '20px 0', border: 'none', cursor: 'pointer', width: '50%', borderRadius: '6px', fontSize: '16px' }}>
          Realizar Compra
        </button>
      </div>
    </div>
  );
};

export default Carrito;