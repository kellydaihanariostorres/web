import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import axios from 'axios';
import storage from '../Storage/storage';


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
                  <NavLink to='/cajav' className='text-white rounded py-2 w-100 d-inline-block px-2' activeclassname="activa"><FaIcons.FaHome className='me-3'/>
                    INICIO
                  </NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to='/cajav/clientes' className='text-white rounded py-2 w-100 d-inline-block px-2'>
                    <FaIcons.FaQq className='me-3'/>
                    CLIENTES
                  </NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to='/cajav/caja' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaBarcode className='me-2'/>
                    CAJA
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
