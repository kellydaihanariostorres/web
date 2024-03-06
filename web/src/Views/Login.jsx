import React, { useState } from 'react';
import axios from 'axios';
import '../Views/Login.css';
import storage from '../Storage/storage';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const login = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:7284/api/authentication/login', { userName, password });
      const userRole = response.data.role;

      // Almacenar el token de autenticación en el almacenamiento local
      storage.set('authToken', response.data.token);

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
    <div className="container-fluid d-flex flex-column h-100 bg-dark text-white">
      <div className="row mt-5 flex-grow-1">
        <div className="col-md-4 offset-md-4">
          <div className="card border">
            <div className="card-header bg-danger text-white text-center">Iniciar Sesión</div>
            <div className="card-body bg-danger">
              <form onSubmit={login}>
                <input type="text" className="form-control mb-3" placeholder="Nombre de usuario" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <input type="password" className="form-control mb-3" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="btn btn-primary btn-block">Iniciar Sesión</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
