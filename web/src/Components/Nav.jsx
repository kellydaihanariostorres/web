import React, { useState, useEffect } from 'react';
import { Navbar, NavbarBrand, Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import storage from '../Storage/storage';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Importar axios para usarlo en la función logout

const Navb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState('');
  const [loggedInUserName, setLoggedInUserName] = useState('');

  useEffect(() => {
    const cargo = storage.get('selectedCargo'); // Obtener el cargo del almacenamiento local
    setSelectedCargo(cargo); // Actualizar el estado de selectedCargo

    const user = storage.get('authUser'); // Obtener el nombre de usuario del almacenamiento local
    setLoggedInUserName(user); // Actualizar el estado de loggedInUserName
  }, []); // Ejecutar solo una vez al cargar el componente

  const toggle = () => setIsOpen(!isOpen);

  const logout = async () => {
    storage.remove('authToken');
    storage.remove('authUser');
    window.location.href = '/'; // Redirigir al usuario a la página de inicio de sesión
  };

  return (
    <Navbar color="dark" dark expand="md">
      <NavbarBrand href="/home">
        <img src="logo.jpg" alt="Logo" style={{ width: '80px', marginRight: '6px' }} />
        DIABLO AMARGO
      </NavbarBrand>
      <Nav className="ml-auto" navbar>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px' }}>{selectedCargo}</span>
            <span style={{ marginRight: '10px' }}>{loggedInUserName}</span>
          </DropdownToggle>
          <DropdownMenu end style={{ background: '#212429', border: 'none' }}>
            <Link to='/' style={{ textDecoration: 'none' }}>
              <DropdownItem style={{ color: 'white', '&:hover': { background: 'red' } }} onClick={logout}>
                Cerrar Sesión
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
