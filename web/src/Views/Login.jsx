import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import storage from '../Storage/storage';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('1'); // Valor por defecto
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('https://localhost:7284/api/authentication/login', {
        userName,
        password,
      });
  
      if (response.data.token) {
        // Almacenar el token en el almacenamiento local
        storage.set('authToken', response.data.token);

        // Redirigir según el cargo seleccionado
        switch (selectedRole) {
          case '1': // Administrador
            navigate('/administradorv');
            break;
          case '2': // Bodega
            navigate('/bodegav');
            break;
          case '3': // Contador
            navigate('/contadorv');
            break;
          case '4': // Caja
            navigate('/cajav');
            break;
          default:
            navigate('/');
        }
      } else {
        console.error('Error en el inicio de sesión: No se recibió un token en la respuesta.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div className="container-fluid d-flex flex-column h-100" style={{ backgroundColor: '#444444', color: 'red' }}>
      <div className="row mt-5 flex-grow-1">
        <div className="col-md-4 offset-md-4">
          <div className="card border " style={{ border: '1px solid #4c0101' }}>
            <div className="card-header" style={{ backgroundColor: '#9c0101', border: '1px solid #9c0101', color: 'white', textAlign: 'center' }}>
              BIENVENIDO
            </div>
            <div className="card-body" style={{ backgroundColor: '#9c0101', border: '1px solid #9c0101' }}>
              <form onSubmit={login}>
                <h6 style={{ color: 'white' }}>Usuario</h6>
                <input
                  type="text"
                  value={userName}
                  className="form-control"
                  placeholder="Usuario"
                  style={{ backgroundColor: '#640000', color: 'white', border: '1px solid #4c0101', caretColor: 'white' }}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <h6 style={{ color: 'white', marginTop: '10px' }}>Contraseña</h6>
                <input
                  type="password"
                  value={password}
                  className="form-control"
                  placeholder="Contraseña"
                  style={{ backgroundColor: '#640000', color: 'white', border: '1px solid #4c0101' }}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <h6 style={{ color: 'white', marginTop: '10px' }}>Cargo</h6>
                <select
                  className="form-select"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{ backgroundColor: '#640000', color: 'white', border: '1px solid #4c0101' }}
                >
                  <option value="1">Administrador</option>
                  <option value="2">Bodega</option>
                  <option value="3">Contador</option>
                  <option value="4">Caja</option>
                </select>
                <div className="d-grid col-10 mx-auto" style={{ marginTop: '20px' }}>
                  <button className="btn btn-danger" type="submit" style={{ backgroundColor: '#640000', border: '1px solid #4c0101' }}>
                    <i className="fa-solid fa-door-open"></i> INGRESAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
