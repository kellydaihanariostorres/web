import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import storage from '../Storage/storage';
import { Link } from 'react-router-dom';

const logout = async () => {
  storage.remove('authToken');
  storage.remove('authUser');
  await axios.get('/api/auth/logout', storage.get('authToken'));
  go('/login');
};
const Navb = () => {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar color="dark" dark expand="md">
       <NavbarBrand href="/home">
        <img src="logo.jpg" alt="Logo" style={{ width: '80px', marginRight: '6px' }} />
        DIABLO AMARGO
      </NavbarBrand>
      <Nav className="ml-auto" navbar>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px' }}>Luna Mahecha</span>
            <img
              src="gat.jpg"
              style={{
                width: '40px',
                height: '40px',
                marginRight: '6px',
                borderRadius: '50%',
              }}
            />
          </DropdownToggle>
          <DropdownMenu end style={{ background: '#212429', border: 'none' }}>
            <Link to='/perfil'  style={{ textDecoration: 'none' }}>
            <DropdownItem  style={{ color: 'white', '&:hover': { background: 'red' } }}>
              Mi perfil</DropdownItem>
            </Link>
            <Link to='/login'  style={{ textDecoration: 'none' }}>
            <DropdownItem  style={{ color: 'white', '&:hover': { background: 'red' } }}>
              Cerrar</DropdownItem>
            </Link>
            <DropdownItem divider />
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </Navbar>
  );
};

export default Navb;
