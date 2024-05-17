import React, { useState } from 'react';
import '../style/Login.css';
import logo from '../Static/Group-295.png';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setError('Todos los campos son obligatorios');
            return;
        }

        const userData = {
            email: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al iniciar sesión');
            }

            const data = await response.json();
            console.log('Success:', data);
            navigate('/');
            // Aquí podrías redirigir al usuario a otra página, etc.
        } catch (error) {
            setError(error.message);
            console.error('Error:', error);
        }
    };

    return (
        <div className="login-container">
            <img src={logo} alt="Logo" className="logo" />
            <form onSubmit={handleSubmit} className="login-form">
                <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    id="email" 
                    placeholder="Correo electrónico" 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    id="password" 
                    placeholder="Contraseña" 
                />
                {error && <p className="error-message">{error}</p>}
                <input type="submit" value="Iniciar sesión" className="submit-button" />
            </form>
        </div>
    );
}

export default Login;
