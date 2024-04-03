import React, { useState } from 'react';
import axios from 'axios';
import '../Views/Login.css';
import storage from '../Storage/storage';
import '../../public/logo.jpg';
import { Colors } from 'chart.js';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Estado para manejar el mensaje de error

  const login = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:7284/api/authentication/login', { userName, password });
      const userRole = response.data.role;
      const loggedInUserName = response.data.userName;

      storage.set('authToken', response.data.token);
      storage.set('authUser', userName);
      storage.set('selectedCargo', userRole); // Almacena el cargo en el almacenamiento local

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
          window.location.href = '/';
      }
    } catch (error) {
      setError('Nombre de usuario o contraseña incorrectos'); // Establecer el mensaje de error
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div className="full-height d-flex justify-content-center align-items-center text-white">
      <div className="row mt-5 flex-grow-1">
        <div className="col-md-4 offset-md-4">
          <div className="cardt ">
            <div className="card-header text-white text-center">Iniciar Sesión</div>
            <img src='../../public/logo.jpg' alt="Imagen Descriptiva" className="logo-imgt mt-3"/>
            <div className="card-body ">
              {error && <div className="alert alert-danger">{error}</div>} {/* Mostrar el mensaje de error si existe */}
              <form onSubmit={login}>
                <h7 className= 'text'>Usuario</h7>
                <input type="text" className="form-control mb-3" placeholder="Nombre de usuario" value={userName} onChange={(e) => setUserName(e.target.value)}  style={{ backgroundColor: '#1a1a1a', color: '#ffffff', border: '1px solid #1a1a1a',boxShadow: '0px 1px 0px 0px #ffffff',}}/>
                <h7 className= 'text'>Contraseña</h7>
                <input type="password" className="form-control mb-3" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}  style={{ backgroundColor: '#1a1a1a', color: '#ffffff', border: '1px solid #1a1a1a',boxShadow: '0px 1px 0px 0px #ffffff',}}/>
                
                
                <button type="submit" className="btn btn-primaryte btn-block" style={{backgroundColor:'#4c0101', color:'white', justifyContent:'center',margin:'0 auto',display:'block',}}>Iniciar Sesión</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;