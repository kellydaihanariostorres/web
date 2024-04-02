import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import axios from 'axios';
import storage from '../Storage/storage';



const SideBar = () => {
  const go = useNavigate();

  const logout = async()=>{
    storage.remove('authToken');
    await axios.get('https://localhost:7284/api/authentication/login',storage.get('authToken'));
    go('/');
  }
  

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

          {storage.get('authUser') ? (
            <div className='collapse navbar-collapse navbar-dark bg-dark' id='nav'>  
               
              <ul className='navbar-nav flex-column mb-2'>
                <li className='nav-item'>
                  <NavLink to='/administradorv' className='text-white rounded py-2 w-100 d-inline-block px-2' activeclassname="activa">
                    ADMINISTRADOR
                  </NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to='/cajav' className='text-white rounded py-2 w-100 d-inline-block px-2'>
                    CAJA
                  </NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to='/gerentev' className='text-white rounded py-2 w-100 d-inline-block px-2'>
                    GERENTE
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
