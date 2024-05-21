import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Productos = () => {
  const location = useLocation();
  const [transactionDetail, setTransactionDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token_ws = searchParams.get('token_ws');
    
    if (token_ws) {
      fetch(`http://localhost:8000/webpay/?token_ws=${token_ws}`)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
          } else {
            setTransactionDetail(data);
            console.log('Transaction details:', data);
          }
        })
        .catch(error => {
          console.error('Error fetching transaction details:', error);
          setError('Error al obtener los detalles de la transacción.');
        });
    }
  }, [location.search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2>Detalle del Producto</h2>
      {error ? (
        <p>{error}</p>
      ) : transactionDetail ? (
        <>
          <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '10px' }}>Estado de la transacción</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Monto</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Orden</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid black', padding: '10px' }}>{transactionDetail.status}</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{transactionDetail.amount}</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{transactionDetail.order_id}</td>
              </tr>
            </tbody>
          </table>
          <h2>Productos comprados</h2>
          <ul>
            {transactionDetail.items && transactionDetail.items.length > 0 ? (
              transactionDetail.items.map((item, index) => (
                <li key={index}>
                  Producto: {item.product_name}, Precio: ${item.product_price}, Cantidad: {item.quantity}
                </li>
              ))
            ) : (
              <p>No se encontraron productos.</p>
            )}
          </ul>
          <p>Para volver al inicio, <Link to="/">presione aquí</Link>.</p>
        </>
      ) : (
        <p>Cargando detalles de la transacción...</p>
      )}
    </div>
  );
};

export default Productos;
