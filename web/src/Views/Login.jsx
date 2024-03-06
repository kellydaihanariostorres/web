import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const login = async (e) => {
    e.preventDefault();

    try {
      // Hacer una solicitud al servidor para iniciar sesión
      const response = await axios.post('https://localhost:7284/api/authentication/login', { userName, password });
      // Si la solicitud tiene éxito, redirigir al usuario a la página correspondiente
      const userRole = response.data.role;
      switch (userRole) {
        case 'Administrador':
          window.location.href = '/administradorv';
          break;
        case 'Bodega':
          window.location.href = '/bodegav';
          break;
        case 'Caja':
          window.location.href = '/cajav';
          break;
        default:
          window.location.href = '/'; // Redirigir a la página de inicio por defecto
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={login}>
        <input type="text" placeholder="Nombre de usuario" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
