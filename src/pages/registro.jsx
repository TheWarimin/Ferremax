import React, { useState } from 'react';
import '../style/Registro.css';
import logo from '../Static/Group-295.png'
import { useNavigate, Link } from 'react-router-dom';

function Registro() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username || !email || !password) {
            setError('Todos los campos son obligatorios');
            return;
        }
        let userData = {
            username: username,
            email: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:8000/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) {
                let errorMessage = 'Error al registrarse';
                if (data.email) {
                    errorMessage = data.email[0];
                } else if (data.username) {
                    errorMessage = data.username[0];
                }
                throw new Error(errorMessage);
            }
        
            navigate('/login');
            console.log('Success:', data);
        } catch (error) {
            setError(error.message);
            console.error('Error:', error);
        }
    };

    const iraLogin = () => {
        navigate('/login');
      };

    return (
        <div className="registro-container">
            <img src={logo} alt="Logo" className="logo" />
            <form onSubmit={handleSubmit} className="registro-form">
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} id="username" placeholder="Nombre de usuario" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} id="email" placeholder="Correo electrónico" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} id="password" placeholder="Contraseña" />
                {error && <p className="error-message">{error}</p>}
                <input type="submit" value="Registrarse" className="submit-button" />
                <div style={{ fontSize: 13, textAlign: 'center' }} onClick={iraLogin}>¿Ya tienes una cuenta?</div>
            </form>
        </div>
    );
}

export default Registro;