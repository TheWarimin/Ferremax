import React from 'react';
import { useNavigate } from 'react-router-dom';

const Carrito = ({ carrito }) => {
  const navigate = useNavigate();

  const comprar = () => {
    // Aquí podrías enviar una solicitud a un servidor para realizar la compra
    console.log('Comprando', carrito);
  };

  const irAProductos = () => {
    navigate('/');
  };

  return (
    <div>
      {carrito.length === 0 ? (
        <div onClick={irAProductos}>Agregue Productos</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((producto, index) => (
              <tr key={index}>
                <td><img src={producto.imagen} alt={producto.nombre} style={{ width: '100px', height: '100px' }} /></td>
                <td>{producto.nombre}</td>
                <td>{producto.precio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={comprar}>Comprar</button>
    </div>
  );
};

export default Carrito;
