import React, { useState } from 'react';
import axios from 'axios';
import { show_alerta } from '../functions';

const ManageUsuarios = () => {
  const apiUrl = 'https://localhost:7284/api/authentication';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const roles = ['Bodega', 'Caja', 'Administrador'];

  const handleRoleChange = (role) => {
    const index = selectedRoles.indexOf(role);
    if (index === -1) {
      setSelectedRoles([...selectedRoles, role]);
    } else {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    }
  };
  const validarPassword = () => {
    if (password.length < 9) {
      show_alerta('La contraseña debe tener al menos 10 caracteres', 'warning');
      return false;
    }
    // Puedes agregar más validaciones aquí, como caracteres especiales, mayúsculas, etc.
    return true;
  };
  

  const validar = async () => {
    console.log('Validar password');
    if (
      firstName.trim() === '' ||
      lastName.trim() === '' ||
      userName.trim() === '' ||
      password.trim() === '' ||
      email.trim() === '' ||
      phoneNumber.trim() === '' ||
      selectedRoles.length === 0 ||
      !validarPassword()
    ) {
      show_alerta('Completa todos los campos correctamente', 'warning');
    } else {
      const parametros = {
        FirstName: firstName,
        LastName: lastName,
        UserName: userName,
        Password: password,
        Email: email,
        PhoneNumber: phoneNumber,
        roles: selectedRoles
      };
      try {
        const response = await axios.post(apiUrl, parametros);
        const tipo = response.data[0];
        const msj = response.data[1];
        show_alerta(msj, tipo);
        resetState();
      } catch (error) {
        show_alerta('Error de solicitud', 'error');
        console.error(error);
      }
    }
  };

  const resetState = () => {
    setFirstName('');
    setLastName('');
    setUserName('');
    setPassword('');
    setEmail('');
    setPhoneNumber('');
    setSelectedRoles([]);
  };

  return (
    <div>
      <h2>Registrar Usuario</h2>
      <div>
        <input
          type='text'
          placeholder='Nombre'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <input
          type='text'
          placeholder='Apellido'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div>
        <input
          type='text'
          placeholder='Nombre de usuario'
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div>
        <input
          type='password'
          placeholder='Contraseña'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          type='text'
          placeholder='Teléfono'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div>
        <h3>Roles:</h3>
        {roles.map((role) => (
          <div key={role}>
            <label>
              <input
                type='checkbox'
                checked={selectedRoles.includes(role)}
                onChange={() => handleRoleChange(role)}
              />{' '}
              {role}
            </label>
          </div>
        ))}
      </div>
      <button onClick={validar}>Registrar</button>
    </div>
  );
};

export default ManageUsuarios;
