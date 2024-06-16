import React, { useState, useContext } from 'react';
import '../style/Login.css';
import logo from '../Static/Group-295.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';

const Login = () => {
    const { logIn, setUserEmail } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const response = await fetch('http://localhost:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token); 
                const usersResponse = await fetch('http://localhost:8000/usuarios/', {
                    headers: {
                        'Authorization': `Token ${data.token}`,
                    },
                });
                const users = await usersResponse.json();
                const user = users.find(user => user.email === email);
                localStorage.setItem('user_id', user.id);
                logIn();
                setUserEmail(email);
                navigate('/');
            } else {
                throw new Error(data.error || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error de red:', error);
            setError(error.message);
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
