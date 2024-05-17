import React from 'react';

const Carrito = ({ cart }) => {
    console.log(cart);
    return (
        <div>
            {cart && cart.map((product, index) => (
                <div key={index}>
                    <h2>{product.nombre}</h2>
                    <p>{product.descripcion}</p>
                    <p>{product.precio}</p>
                </div>
            ))}
        </div>
    );
};

export default Carrito;