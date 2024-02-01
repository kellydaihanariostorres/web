import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendRequest } from '../functions';
import DivInput from '../Components/DivInput';
import storage from '../Storage/storage';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('1'); 
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    // Realizar la autenticación aquí...

    // Después de autenticar con éxito, redirigir según el rol seleccionado
    switch (selectedRole) {
      case '1': // Administrador
        navigate('/administradorv');
        break;
      case '2': // Gerente
        navigate('/bodegav');
        break;
      case '3': // Contador
        navigate('/contadorv');
        break;
      case '4': // Caja
        navigate('/cajav');
        break;
      default:
        navigate('/'); // Redirigir a la página de inicio por defecto
    }
  };

  return (
    <div className="container-fluid d-flex flex-column">
      <div className="row mt-5 flex-grow-1">
        <div className="col-md-4 offset-md-4">
          <div className="card border border-black">
            <div className="card-header bg-black border border-black text-white d-flex justify-content-center">
              BIENVENIDO
            </div>
            <div className="card-body">
              <form onSubmit={login}>
                <h6 style={{ color: 'white' }}>Usuario</h6>
                <DivInput
                  type="email"
                  value={email}
                  className="form-control"
                  placeholder="Email"
                  /*handleChange={(e) => setEmail(e.target.value)}*/
                />
                <h6 style={{ color: 'white', marginTop: '10px' }}>Contraseña</h6>
                <DivInput
                  type="password"
                  value={password}
                  className="form-control"
                  placeholder="Contraseña"
                  /*handleChange={(e) => setPassword(e.target.value)}*/
                />
                <h6 style={{ color: 'white', marginTop: '10px' }}>Cargo</h6>
                <select
                  className="form-select"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="1">Administrador</option>
                  <option value="2">Bodega</option>
                  <option value="3">Contador</option>
                  <option value="4">Caja</option>
                </select>
                <div className="d-grid col-10 mx-auto" style={{ marginTop: '20px' }}>
                  <button className="btn btn-danger" type="submit">
                    <i className="fa-solid fa-door-open"></i> INGRESAR
                  </button>
                </div>
              </form>
              <Link to="/registro" style={{ color: 'white', marginTop: '10px', display: 'block' }}>
                <i className="fa-solid fa-user-plus"></i> Recuperar contraseña
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;