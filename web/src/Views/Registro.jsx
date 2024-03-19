import React, { useState } from 'react';
import axios from 'axios';
import { show_alerta } from '../functions';
import '../Views/Registr.css';

const Registro = () => {
  const apiUrl = 'https://localhost:7284/api/authentication';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const roles = ['Bodega', 'Caja', 'Administrador'];

  const validarPassword = () => {
    if (password.length < 10) {
      show_alerta('La contraseña debe tener al menos 10 caracteres', 'warning');
      return false;
    }
    // Puedes agregar más validaciones aquí, como caracteres especiales, mayúsculas, etc.
    return true;
  };

  const validar = async () => {
    if (
      firstName.trim() === '' ||
      lastName.trim() === '' ||
      userName.trim() === '' ||
      password.trim() === '' ||
      email.trim() === '' ||
      phoneNumber.trim() === '' ||
      selectedRole === '' ||
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
        roles: [selectedRole] // Aquí envías los roles como un arreglo con un solo elemento
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
    setSelectedRole('');
  };

  return (
    <div className="container  custom-container">
      <h2>Registrar Usuario</h2>
      <div className="form-group">
        <label>Nombre:</label>
        <input
          type='text'
          className="form-control"
          placeholder='Nombre'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Apellido:</label>
        <input
          type='text'
          className="form-control"
          placeholder='Apellido'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Nombre de usuario:</label>
        <input
          type='text'
          className="form-control"
          placeholder='Nombre de usuario'
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Contraseña:</label>
        <input
          type='password'
          className="form-control"
          placeholder='Contraseña'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type='email'
          className="form-control"
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Teléfono:</label>
        <input
          type='text'
          className="form-control"
          placeholder='Teléfono'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Rol:</label>
        <select
          className="form-control"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">Seleccionar rol</option>
          {roles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>
      <button onClick={validar} className="btn btn-primary">Registrar</button>
    </div>
  );
};

export default Registro;
