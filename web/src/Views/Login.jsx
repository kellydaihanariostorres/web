import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendRequest } from '../functions';
import DivInput from '../Components/DivInput';
import storage from '../Storage/storage';
import axios from 'axios'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const go = useNavigate();

  const csrf = async () => {
    await axios.get('/sanctum/csrf-cookie');
  };

  const login = async (e) => {
    e.preventDefault(); 
    await csrf();
    const form = { email: email, password: password };
    const res = await sendRequest('POST', form, '/api/auth/login', '', false);

    if (res.status === true) {
      storage.set('authToken', res.token);
      storage.set('authUser', res.token);
      go('/');
    }
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: 'red' }}>
      <div className="row mt-5">
        <div className="col-md-4 offset-md-4">
          <div className="card border border-dark" style={{ backgroundColor: 'black' }}>
            <div className="card-header bg-dark border border-dark text-white d-flex justify-content-center">
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
                  required="required"
                  handleChange={(e) => setEmail(e.target.value)}
                  style={{ backgroundColor: 'white', color: 'black' }}
                />
                <h6 style={{ color: 'white', marginTop: '10px' }}>Contraseña</h6>
                <DivInput
                  type="password"
                  value={password}
                  className="form-control"
                  placeholder="Password"
                  required="required"
                  handleChange={(e) => setPassword(e.target.value)}
                  style={{ backgroundColor: 'white', color: 'black' }}
                />
                <div className="d-grid col-10 mx-auto">
                  <Link to="/home">
                    <button className="btn btn-danger">
                      <i className="fa-solid fa-door-open"></i>Login
                    </button>
                  </Link>
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