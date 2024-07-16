import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#212121',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#cf6b31',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#cf6b31',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#cf6b31',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  pedidosContainer: {
    marginTop: '20px',
    backgroundColor: '#333',
    padding: '10px',
    borderRadius: '4px',
  },
  pedido: {
    borderBottom: '1px solid #444',
    padding: '10px 0',
  },
  voucherLink: {
    color: '#cf6b31',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  verMasButton: {
    marginTop: '10px',
    backgroundColor: '#cf6b31',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 15px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const Perfil = () => {
  const [perfil, setPerfil] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: ''
  });
  const [pedidos, setPedidos] = useState([]);
  const [buttonHover, setButtonHover] = useState(false);
  const [mostrarPedidos, setMostrarPedidos] = useState(4);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    axios.get('http://127.0.0.1:8000/usuarios/me/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(response => {
      setPerfil(response.data);
    })
    .catch(error => {
      console.error("Hubo un error al obtener los datos del perfil:", error);
    });

    axios.get('http://127.0.0.1:8000/pedidos/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(response => {
      const sortedPedidos = response.data.sort((a, b) => new Date(b.fecha_pedido) - new Date(a.fecha_pedido));
      setPedidos(sortedPedidos);
    })
    .catch(error => {
      console.error("Hubo un error al obtener los pedidos:", error);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios.patch('http://127.0.0.1:8000/usuarios/me/', perfil, {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(response => {
      alert("Perfil actualizado correctamente");
    })
    .catch(error => {
      console.error("Hubo un error al actualizar el perfil:", error);
    });
  };

  const handleVerMas = () => {
    setMostrarPedidos(prevMostrarPedidos => prevMostrarPedidos + 4);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Perfil de Usuario</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Nombre:</label>
          <input 
            type="text" 
            name="nombre" 
            value={perfil.username} 
            onChange={handleChange} 
            style={styles.input} 
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Dirección:</label>
          <input 
            type="text" 
            name="direccion" 
            value={perfil.direccion} 
            onChange={handleChange} 
            style={styles.input} 
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Teléfono:</label>
          <input 
            type="text" 
            name="telefono" 
            value={perfil.telefono} 
            onChange={handleChange} 
            style={styles.input} 
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={perfil.email} 
            onChange={handleChange} 
            style={styles.input} 
          />
        </div>
        <button 
          type="submit" 
          style={buttonHover ? { ...styles.button, ...styles.buttonHover } : styles.button}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          Actualizar Perfil
        </button>
      </form>
      
      <div style={styles.pedidosContainer}>
        <h3 style={styles.header}>Mis Pedidos</h3>
        {pedidos.slice(0, mostrarPedidos).map((pedido, index) => (
          <div key={index} style={styles.pedido}>
            <p>ID del Pedido: {pedido.id}</p>
            <p>Fecha: {formatDate(pedido.fecha_pedido)}</p>
            <p>Estado: {pedido.estado}</p>
            <p>Productos:</p>
            <ul>
              {pedido.productos.map((producto, index) => (
                <li key={index}>{producto.nombre_producto} - Cantidad: {producto.cantidad}</li>
              ))}
            </ul>
            <p>Total: {pedido.total}</p>
            {pedido.voucher && (
              <a 
                href={pedido.voucher} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={styles.voucherLink}
              >
                Ver Voucher
              </a>
            )}
          </div>
        ))}
        {mostrarPedidos < pedidos.length && (
          <button 
            onClick={handleVerMas} 
            style={styles.verMasButton}
          >
            Ver Más
          </button>
        )}
      </div>
    </div>
  );
};

export default Perfil;
