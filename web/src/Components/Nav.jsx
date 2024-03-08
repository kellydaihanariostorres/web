import React, { useState, useEffect } from 'react';
import { Navbar, NavbarBrand, Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import storage from '../Storage/storage';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Importar axios para usarlo en la función logout

const Navb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState('');
  const [authUser, setAuthUser] = useState(''); 

  useEffect(() => {
    const cargo = storage.get('selectedCargo'); // Obtener el cargo del almacenamiento local
    setSelectedCargo(cargo); // Actualizar el estado de selectedCargo

    const user = storage.get('authUser'); // Obtener el nombre de usuario del almacenamiento local
    setAuthUser(user); // Actualizar el estado de authUser
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
            {/* Asegúrate de que getImageName esté definida */}
            <img
              src={getImageName()} // Ruta de la imagen basada en el cargo seleccionado
              style={{ width: '40px', height: '40px', marginRight: '6px', borderRadius: '50%' }}
              alt="Avatar"
            />
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

// Función para obtener el nombre de la imagen basada en el cargo
const getImageName = () => {
  const cargo = storage.get('selectedCargo');
  switch (cargo) {
    case 'Administrador':
      return 'rojo.avif'; // Nombre de la imagen para el Administrador
    case 'Bodega':
      return 'violeta.avif'; // Nombre de la imagen para el Gerente
    case 'Caja':
      return 'azul.jpg'; // Nombre de la imagen para el Cajero
    default:
      return 'gat.jpg'; // Si no hay un cargo válido, usamos una imagen por defecto
  }
};

export default Navb;
