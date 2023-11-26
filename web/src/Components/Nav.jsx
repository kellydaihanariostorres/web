import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import storage from '../Storage/storage';

const Nav = () => {
  const go = useNavigate();

  const logout = async () => {
    storage.remove('authToken');
    storage.remove('authUser');
    await axios.get('/api/auth/logout', storage.get('authToken'));
    go('/login');
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-white bg-info'>
      <div className='container-fluid'>
        <a className='navbar-brand' id='navbarBrand'>
          Diablo Amargo
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#nav'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
          role='button'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
      </div>

      {!storage.get('authUser') ? (
        <div className='collapse navbar-collapse' id='nav'>
          <ul className='navbar-nav mx-auto mb-2'>
            <li className='nav-item px-lg-5'>
              <Link to='/bodega' className='nav-link'>
                Bodegas
              </Link>
            </li>
            <li className='nav-item px-lg-5 '>
              <Link to='/empleado' className='nav-link'>
                Empleados
              </Link>
            </li>
            <li className='nav-item px-lg-5 '>
              <Link to='/productos' className='nav-link'>
                Productos
              </Link>
            </li>
            <li className='nav-item px-lg-5 '>
              <Link to='/factura' className='nav-link'>
                Factura
              </Link>
            </li>
          </ul>
          <ul className='navbar-nav mx-auto mb-2'>
            <li className='nav-item px-lg-5'>
              <button className='btn btn-info' onClick={logout}>
                Cerrar
              </button>
            </li>
          </ul>
        </div>
      ) : (
        ''
      )}
    </nav>
  );
};

export default Nav;
