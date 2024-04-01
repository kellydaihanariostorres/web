import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
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
  const [errorMessage, setErrorMessage] = useState({});
  const roles = ['Bodega', 'Caja', 'Administrador'];
  const MySwal = withReactContent(Swal);
  const [duplicateEmail, setDuplicateEmail] = useState('');
  const [duplicateUserName, setDuplicateUserName] = useState('');
  const [error, setError] = useState(null);

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
    console.log("La función validar se está ejecutando");
    
    let isValid = true;
    const errors = {};
    const { name, value } = event.target;
    let newValue = value;

    if (/[^a-zA-Z\s]/.test(firstName)) {
      isValid = false;
      newValue = value.replace(/[^a-zA-Z\s]/g, "");
      errors.firstName = 'Por favor, ingresa solo letras en el nombre.';
    }

    if (!/^[a-zA-Z]+$/.test(lastName)) {
      isValid = false;
      newValue = value.replace(/[^a-zA-Z\s]/g, "");
      errors.lastName = 'Por favor, ingresa solo letras en el apellido.';
    }

    if (!/^\d+$/.test(phoneNumber)) {
      isValid = false;
      errors.phoneNumber = 'Por favor, ingresa solo números en el teléfono.';
    }

    if (firstName.trim() === '') {
      isValid = false;
      errors.firstName = 'Por favor, ingresa tu nombre.';
    }

    if (lastName.trim() === '') {
      isValid = false;
      errors.lastName = 'Por favor, ingresa tu apellido.';
    }

    if (userName.trim() === '') {
      isValid = false;
      errors.userName = 'Por favor, ingresa un nombre de usuario.';
    }

    if (password.trim() === '') {
      isValid = false;
      errors.password = 'Por favor, ingresa una contraseña.';
    }

    if (email.trim() === '') {
      isValid = false;
      const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        newValue
      );
      if (!isValidEmail && newValue !== "") {
        setError("El correo electrónico ingresado no es válido.");
      } else {
        setError(null);
      }
      errors.email = 'Por favor, ingresa tu correo electrónico.';
    }

    if (!emailRegex.test(email)) {
      isValid = false;
      errors.email = 'Por favor, ingresa un correo electrónico válido.';
    }

    if (phoneNumber.trim() === '') {
      isValid = false;
      errors.phoneNumber = 'Por favor, ingresa tu número de teléfono.';
    }

    if (isNaN(phoneNumber)) {
      isValid = false;
      newValue = value.replace(/\D/g, "");
      errors.phoneNumber = 'Por favor, ingresa un número de teléfono válido.';
    }

    if (selectedRole === '') {
      isValid = false;
      errors.role = 'Por favor, selecciona un rol.';
    }

    if (!validarPassword()) {
      isValid = false;
      errors.password = 'Por favor, la contraseña debe tener al menos 10 caracteres y cumplir con ciertas reglas.';
    }

    setErrorMessage(errors);

  if (isValid) {
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
      console.log("Respuesta de la solicitud:", response);
      const { DuplicateEmail, DuplicateUserName } = response.data;
      
     
      if (DuplicateEmail || DuplicateUserName) {
        let errorMessage = '';
        if (DuplicateEmail) {
          errorMessage = DuplicateEmail[0];
        } else {
          errorMessage = DuplicateUserName[0];
        }
        // Mostrar mensaje de error
        Swal.fire({
          title: 'Error Existente',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      } else {
        // Si la respuesta es exitosa, mostrar mensaje de éxito con SweetAlert
        Swal.fire({
          title: '¡Usuario registrado!',
          text: response.data[1],
          icon: 'success',
          confirmButtonText: 'OK'
        });
        resetState();
        console.log(response.data);
        return;
      }
    } catch (error) {
      // Manejar errores de solicitud
      if (error.response && error.response.status === 400) {
        const { data } = error.response;
        Swal.fire({
          title: 'Error Usuario existente',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } else {
        // Manejar otros errores de solicitud
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
    setErrorMessage({});
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
          onChange={(e) => {
            const newValue = e.target.value.replace(/[^a-zA-Z\s]/g, "");
            setFirstName(newValue);
          }}
        />
        {errorMessage.firstName && <p className="error-message red-color">{errorMessage.firstName}</p>}
      </div>
      <div className="form-group">
      <label>Apellido:</label>
      <input
        type='text'
        className="form-control"
        placeholder='Apellido'
        value={lastName}
        onChange={(e) => {
          const newValue = e.target.value.replace(/[^a-zA-Z\s]/g, "");
          setLastName(newValue);
        }}
      />
      {errorMessage.lastName && <p className="error-message red-color">{errorMessage.lastName}</p>}
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
        {errorMessage.userName && <p className="error-message red-color">{errorMessage.userName}</p>}
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
        {errorMessage.password && <p className="error-message red-color">{errorMessage.password}</p>}
        {password.length > 0 && password.length < 10 && (
          <p className="warning-message red-color">La contraseña debe tener al menos 10 caracteres.</p>
        )}
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
        {errorMessage.email && <p className="error-message red-color">{errorMessage.email}</p>}
      </div>
      <div className="form-group">
        <label>Teléfono:</label>
        <input
          type='text'
          className="form-control"
          placeholder='Teléfono'
          value={phoneNumber}
          onChange={(e) => {
            const newValue = e.target.value.replace(/\D/g, "");
            setPhoneNumber(newValue);
          }}
        />
        {errorMessage.phoneNumber && <p className="error-message red-color">{errorMessage.phoneNumber}</p>}
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
        {errorMessage.role && <p className="error-message red-color">{errorMessage.role}</p>}
      </div>
      <button onClick={validar} className="btn btn-primary btnfos-5">Registrar</button>
    </div>
  );
};

export default Registro;
