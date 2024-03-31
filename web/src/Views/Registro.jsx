
import React, { useState } from 'react';
import axios from 'axios';
import { show_alerta } from '../functions';
import '../Views/Registr.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'animate.css';

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
  const MySwal = withReactContent(Swal);

  const validarPassword = () => {
    if (password.length < 10) {
      MySwal.fire({
        icon: 'warning',
        title: '¡Atención!',
        text: 'Por favor, la contraseña tiene que ser mayor de 10 caracteres',
      });
      return false;
    }
    return true;
  };

  const validar = async () => {
    // Expresión regular para validar el formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Validar cada campo
    const result = await Swal.fire({
      title: 'Validación',
      html: `
        <p>${firstName.trim() === '' ? 'Por favor, ingresa tu nombre.' : ''}</p>
        <p>${lastName.trim() === '' ? 'Por favor, ingresa tu apellido.' : ''}</p>
        <p>${userName.trim() === '' ? 'Por favor, ingresa un nombre de usuario.' : ''}</p>
        <p>${password.trim() === '' ? 'Por favor, ingresa una contraseña.' : ''}</p>
        <p>${email.trim() === '' ? 'Por favor, ingresa tu correo electrónico.' : ''}</p>
        <p>${!emailRegex.test(email) ? 'Por favor, ingresa un correo electrónico válido.' : ''}</p>
        <p>${phoneNumber.trim() === '' ? 'Por favor, ingresa tu número de teléfono.' : ''}</p>
        <p>${isNaN(phoneNumber) ? 'Por favor, ingresa un número de teléfono válido.' : ''}</p>
        <p>${selectedRole === '' ? 'Por favor, selecciona un rol.' : ''}</p>
        <p>${!validarPassword() ? 'Por favor, la contraseña debe tener al menos 10 caracteres y cumplir con ciertas reglas.' : ''}</p>
      `,
      confirmButtonText: 'Aceptar'
    });
  
    if (result.isConfirmed) {
      // Si se confirma, continuar con el proceso de registro
      if (firstName.trim() !== '' && lastName.trim() !== '' && userName.trim() !== '' && password.trim() !== '' &&
          email.trim() !== '' && emailRegex.test(email) && phoneNumber.trim() !== '' && !isNaN(phoneNumber) &&
          selectedRole !== '' && validarPassword()) {
        const parametros = {
          FirstName: firstName,
          LastName: lastName,
          UserName: userName,
          Password: password,
          Email: email,
          PhoneNumber: phoneNumber,
          roles: [selectedRole]
        };
  
        try {
          const response = await axios.post(apiUrl, parametros);
          const tipo = response.data[0];
          const msj = response.data[1];
          if (tipo === 'success') {
            // Si la respuesta es exitosa, mostrar mensaje de éxito con SweetAlert
            Swal.fire({
              title: '¡Usuario registrado!',
              text: msj,
              icon: 'success',
              confirmButtonText: 'OK'
            });
            resetState();
          } else {
            show_alerta(msj, tipo);
          }
        } catch (error) {
          show_alerta('Error de solicitud', 'error');
          console.error(error);
        }
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
    <div className="containert  custom-container" style={{backgroundcolor:'#f0f0f0'}}>
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
      <button onClick={validar} className="btn btn-primary btnfos-5">Registrar</button>
    </div>
  );
};

export default Registro;
