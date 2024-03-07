import React, { useState } from 'react';
import axios from 'axios';
import { show_alerta } from '../../functions';

const ClienteFormulario = () => {
  const apiUrl = 'https://localhost:7284/api/clientes';
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numDocumento, setNumDocumento] = useState('');
  const [correo, setCorreo] = useState('');

  const validar = async () => {
    if (
      nombre.trim() === '' ||
      apellido.trim() === '' ||
      String(edad).trim() === '' ||
      tipoDocumento.trim() === '' ||
      String(numDocumento).trim() === '' ||
      correo.trim() === ''
    ) {
      show_alerta('Completa todos los campos', 'warning');
    } else {
      const parametros = { nombre, apellido, edad, tipoDocumento, numDocumento, correo };
      try {
        const response = await axios.post(apiUrl, parametros);
        const tipo = response.data[0];
        const msj = response.data[1];
        show_alerta(msj, tipo);
        // Reiniciamos los campos del formulario después de agregar el cliente
        setNombre('');
        setApellido('');
        setEdad('');
        setTipoDocumento('');
        setNumDocumento('');
        setCorreo('');
      } catch (error) {
        show_alerta('Error de solicitud', 'error');
        console.error(error);
      }
    }
  };

  return (
    <div>
      <div className='input-group mb-3'>
        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
        <input
          type='text'
          id='nombre'
          className='form-control'
          placeholder='Nombre'
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
        <input
          type='text'
          id='apellido'
          className='form-control'
          placeholder='Apellido'
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
        <input
          type='text'
          id='edad'
          className='form-control'
          placeholder='Edad'
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          required
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
        <input
          type='text'
          id='tipoDocumento'
          className='form-control'
          placeholder='Tipo de Documento'
          value={tipoDocumento}
          onChange={(e) => setTipoDocumento(e.target.value)}
          required
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
        <input
          type='text'
          id='numDocumento'
          className='form-control'
          placeholder='Número de Documento'
          value={numDocumento}
          onChange={(e) => setNumDocumento(e.target.value)}
          required
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
        <input
          type='email'
          id='correo'
          className='form-control'
          placeholder='Correo'
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
      </div>
      <div className='modal-footer'>
        <button type='button' className='btn btn-success' onClick={validar}>
          Guardar
        </button>
      </div>
    </div>
  );
};

export default ClienteFormulario;
