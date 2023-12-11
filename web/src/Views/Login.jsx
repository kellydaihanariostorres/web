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
  const go = useNavigate();

  const csrf = async () => {
    await axios.get('/api/csrf-token'); 
  };

  useEffect(() => {
    csrf(); 
  }, []); 

  const login = async (e) => {
    e.preventDefault();
    const form = { email, password, role: selectedRole };
    const res = await sendRequest('POST', form, '/api/registro', '', false);

    if (res.status === true) {
      storage.set('authToken', res.token);
      storage.set('authUser', res.token);
      go('/');
    }
  };

  return (
    <div className="container-fluid d-flex flex-column" style={{ backgroundColor: '#af0004', minHeight: '100vh' }}>
      <div className="row mt-5 flex-grow-1">
        <div className="col-md-4 offset-md-4">
          <div className="card border border-black" style={{ backgroundColor: 'black' }}>
            <div className="card-header bg-black border border-black text-white d-flex justify-content-center">
              BIENVENIDO
            </div>
            <div className="card-body">
              <form onSubmit={login}>
                <h6 style={{ color: 'white' }}>Usuario</h6>
                <DivInput
                  style={{ backgroundColor: 'black', color: 'white' }}
                  type="email"
                  value={email}
                  className="form-control"
                  placeholder="Email"
                  required="required"
                  handleChange={(e) => setEmail(e.target.value)}
                />
                <h6 style={{ color: 'white', marginTop: '10px' }}>Contraseña</h6>
                <DivInput
                  type="password"
                  value={password}
                  className="form-control"
                  placeholder="Contraseña"
                  required="required"
                  handleChange={(e) => setPassword(e.target.value)}
                  style={{ backgroundColor: 'black', color: 'white' }}
                />
                <h6 style={{ color: 'white', marginTop: '10px' }}>Cargo</h6>
                <select
                  className="form-select"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{ backgroundColor: 'black', color: 'white' }}
                >
                  <option value="1">Administrador</option>
                  <option value="2">Gerente</option>
                  <option value="3">Contador</option>
                  <option value="4">Caja</option>
                </select>
                <div className="d-grid col-10 mx-auto" style={{ marginTop: '20px' }}>
                  <button className="btn btn-danger" type="submit" style={{ backgroundColor: '#af0004' }}>
                    <i className="fa-solid fa-door-open"></i>INGRESAR
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
