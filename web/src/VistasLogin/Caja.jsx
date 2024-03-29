import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import storage from '../Storage/storage';

const SideBar = () => {
  const go = useNavigate();

  const logout = async () => {
    storage.remove('authToken');
    await axios.get('https://localhost:7284/api/authentication/login', storage.get('authToken'));
    go('/');
  };

  const styles = {
    sidebar: {
      height: '100%',
      backgroundColor: '#999999',
    },
    flex: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-dark' style={styles.sidebar}>
    <NavLink to='/cajav/caja' className='nav-link text-white rounded py-2 w-100 d-inline-block px-2'></NavLink>      
    </nav>
  );
};

export default SideBar;
