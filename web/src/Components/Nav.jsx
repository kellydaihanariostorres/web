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

const Navb = () => {
  // You can keep the rest of your state and toggle logic if needed
  const [isOpen, setIsOpen] = useState(false);

  // Toggle function remains the same if you want to keep it
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar color="dark" dark expand="md">
      <NavbarBrand href="/"> DIABLO AMARGO </NavbarBrand>
      {/* Remove the NavbarToggler and use a simple Nav */}
      <Nav className="ml-auto" navbar>
        
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            Luna Mahecha
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>Mi perfil</DropdownItem>
            <DropdownItem>Cerrar</DropdownItem>
            <DropdownItem divider />
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </Navbar>
  );
};

export default Navb;
