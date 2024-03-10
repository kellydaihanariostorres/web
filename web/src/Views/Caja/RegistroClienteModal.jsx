import React, { useState } from 'react';
import axios from 'axios';
import { show_alerta } from '../../functions';

const ManageClientes = () => {
  const apiUrl = 'https://localhost:7284/api/clientes';
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numDocumento, setNumDocumento] = useState('');
  const [correo, setCorreo] = useState('');

  const agregarCliente = async (event) => {
    event.preventDefault(); // Prevenir que el formulario se envíe automáticamente y la página se recargue

    const openModal = (op, id, nombre, apellido, edad, tipoDocumento, numDocumento, correo) => {
      setOperation(op);
      setClienteId(id);
      setNombre('');
      setApellido('');
      setEdad('');
      setTipoDocumento('');
      setNumDocumento('');
      setCorreo('');
      setTitle('Registrar cliente');

      window.setTimeout(function(){
        document.getElementById('nombre').focus();
      },500);
    };
  
    const validar = () => {
      if (nombre.trim() === '') {
        show_alerta('Completa el nombre', 'warning');
      } else if (apellido.trim() === '') {
        show_alerta('Completa el apellido', 'warning');
      } else if (edad.trim() === '') {
        show_alerta('Completa la edad', 'warning');
      } else if (tipoDocumento.trim() === '') {
        show_alerta('Completa tipo de documento', 'warning');
      } else if (numDocumento.trim() === '') {
        show_alerta('Completa numero de documento', 'warning');
      } else if (correo.trim() === '') {
        show_alerta('Completa correo', 'warning');
      } else {
        const parametros = { nombre: nombre.trim(), apellido: apellido.trim(), edad: edad.trim(), tipoDocumento: tipoDocumento.trim(), numDocumento: numDocumento.trim(), correo: correo.trim() };
        const metodo= 'POST' 
        enviarSolicitud(metodo, parametros);
      }
    };
    
  return (
    <div className='container'>
      <h1>Registrar Cliente</h1>
      <form onSubmit={agregarCliente}>
        <div className='mb-3'>
          <label htmlFor='nombre' className='form-label'>Nombre</label>
          <input type='text' className='form-control' id='nombre' value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className='mb-3'>
          <label htmlFor='apellido' className='form-label'>Apellido</label>
          <input type='text' className='form-control' id='apellido' value={apellido} onChange={(e) => setApellido(e.target.value)} required />
        </div>
        <div className='mb-3'>
          <label htmlFor='edad' className='form-label'>Edad</label>
          <input type='text' className='form-control' id='edad' value={edad} onChange={(e) => setEdad(e.target.value)} required />
        </div>
        <div className='mb-3'>
          <label htmlFor='tipoDocumento' className='form-label'>Tipo de Documento</label>
          <input type='text' className='form-control' id='tipoDocumento' value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)} required />
        </div>
        <div className='mb-3'>
          <label htmlFor='numDocumento' className='form-label'>Número de Documento</label>
          <input type='text' className='form-control' id='numDocumento' value={numDocumento} onChange={(e) => setNumDocumento(e.target.value)} required />
        </div>
        <div className='mb-3'>
          <label htmlFor='correo' className='form-label'>Correo</label>
          <input type='email' className='form-control' id='correo' value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <button type='submit' className='btn btn-primary'>Guardar</button>
      </form>
    </div>
  );
  }
};

export default ManageClientes;
