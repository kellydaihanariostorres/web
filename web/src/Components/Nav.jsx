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
      <NavbarBrand href="/"> DIABLO AMARGO </NavbarBrand>
      <Nav className="ml-auto" navbar>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            Luna Mahecha
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem>Mi perfil</DropdownItem>
            <Link to='/login'>
            <DropdownItem>
              Cerrar
            </DropdownItem>
            </Link>
            <DropdownItem divider />
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </Navbar>
  );
};

export default Navb;
