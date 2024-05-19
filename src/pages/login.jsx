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
  
          if (response.ok) {
              const data = await response.json();
              localStorage.setItem('token', data.token); // Guarda el token en el almacenamiento local
              logIn();
              setUserEmail(email);
              navigate('/');
          } else {
              setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
          }
      } catch (error) {
          console.error('Error de red:', error);
          setError('Error de conexión. Por favor, intenta de nuevo.');
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
