import React, { useState } from 'react';
import { Navbar, NavbarBrand, Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import storage from '../Storage/storage';
import { Link } from 'react-router-dom';

const Navb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const selectedCargo = storage.get('selectedCargo');
  const logout = async()=>{
    storage.remove('authToken');
    storage.remove('authUser');
    await axios.get('https://localhost:7284/api/authentication/login',storage.get('authToken'));
    go('/');
  } // Obtenemos el cargo del almacenamiento local

  // Función para obtener el nombre de la imagen basada en el cargo
  const getImageName = () => {
    switch (selectedCargo) {
      case 'Administrador':
        return 'rojo.avif'; // Nombre de la imagen para el Administrador
      case 'Gerente':
        return 'violeta.avif'; // Nombre de la imagen para el Gerente
      case 'Contador':
        return 'verde.avif'; // Nombre de la imagen para el Contador
      case 'Caja':
        return 'azul.jpg'; // Nombre de la imagen para el Cajero
      default:
        return 'gat.jpg'; // Si no hay un cargo válido, usamos una imagen por defecto
    }
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
            <img
              src={getImageName()} // Ruta de la imagen basada en el cargo seleccionado
              style={{ width: '40px', height: '40px', marginRight: '6px', borderRadius: '50%' }}
              alt="Avatar"
            />
          </DropdownToggle>
          <DropdownMenu end style={{ background: '#212429', border: 'none' }}>
            <Link to='/' style={{ textDecoration: 'none' }}>
              <DropdownItem style={{ color: 'white', '&:hover': { background: 'red' } }}>
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
