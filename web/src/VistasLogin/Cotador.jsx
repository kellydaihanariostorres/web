import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import axios from 'axios';
import storage from '../Storage/storage';

// la creacion de los menus su estructura y como se visualizara  es por medio del nombre que le damos a cada uno.
const SideBar = () => {
  const go = useNavigate();

  const logout = async () => {
    storage.remove('authToken');
    storage.remove('authUser');
    await axios.get('/api/auth/logout', storage.get('authToken'));
    go('/login');
  };
  //const userImageUrl = storage.get('authUser')?.image || userImage;

  return (
    <div className="sideBar">
      <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
        <div className='container-fluid'>
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

          {!storage.get('authUser') ? (
            <div className='collapse navbar-collapse navbar-dark bg-dark' id='nav'>  
               
              <ul className='navbar-nav flex-column mb-2'>
                <li className='nav-item'>
                  <NavLink to='/contadorv' className='text-white rounded py-2 w-100 d-inline-block px-2' activeclassname="activa"><FaIcons.FaHome className='me-3'/>
                    INICIO
                  </NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to='/contadorv/empleado' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaPray  className='me-2'/>
                    EMPLEADOS
                  </NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to='/contadorv/proveedor' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaPray  className='me-2'/>
                    PROVEEDOR
                  </NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to='/contadorv/pago' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaRegCreditCard className='me-3'/>
                    PAGOS
                  </NavLink>
                </li>
              
              </ul>
            </div>
          ) : (
            ''
          )}
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
