import React, { useState } from 'react';
import axios from 'axios';

const ManageClientes = () => {
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
      edad.trim() === '' ||
      tipoDocumento.trim() === '' ||
      numDocumento.trim() === '' ||
      correo.trim() === ''
    ) {
      alert('Completa todos los campos');
    } else {
      const parametros = { nombre, apellido, edad, tipoDocumento, numDocumento, correo };
      try {
        await axios.post(apiUrl, parametros);
        alert('Cliente guardado correctamente');
        setNombre('');
        setApellido('');
        setEdad('');
        setTipoDocumento('');
        setNumDocumento('');
        setCorreo('');
      } catch (error) {
        alert('Error al guardar el cliente');
        console.error(error);
      }
    }
  };

  return (
    <div>
      <div className='input-group mb-3'>
        <span className='input-group-text'>Nombre</span>
        <input
          type='text'
          className='form-control'
          placeholder='Nombre'
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'>Apellido</span>
        <input
          type='text'
          className='form-control'
          placeholder='Apellido'
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'>Edad</span>
        <input
          type='text'
          className='form-control'
          placeholder='Edad'
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'>Tipo de Documento</span>
        <input
          type='text'
          className='form-control'
          placeholder='Tipo de Documento'
          value={tipoDocumento}
          onChange={(e) => setTipoDocumento(e.target.value)}
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'>Número de Documento</span>
        <input
          type='text'
          className='form-control'
          placeholder='Número de Documento'
          value={numDocumento}
          onChange={(e) => setNumDocumento(e.target.value)}
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'>Correo</span>
        <input
          type='text'
          className='form-control'
          placeholder='Correo'
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
      </div>
      <div className='d-grid col-6 mx-auto'>
        <button onClick={validar} className='btn btn-success'>
          Guardar
        </button>
      </div>
    </div>
  );
};

export default ManageClientes;
