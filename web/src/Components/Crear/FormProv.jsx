import React, { useEffect, useState, useRef } from 'react';
import { sendRequest } from '../../functions';
import DivInput from '../DivInput';
import { Link } from 'react-router-dom';

const FormEntidadBancaria = ({ id }) => {
  const [nombre, setNombre] = useState('');
  const [numDocumento, setNumDocumento] = useState('');
  const [edad, setEdad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [nombreEntidadBancaria, setNombreEntidadBancaria] = useState('');
  const [numeroCuentaBancaria, setNumeroCuentaBancaria] = useState('');
  const NombreInput = useRef();

  let method = 'POST';
  let url = 'api/proveedores';
  let redirect = '';

  useEffect(() => {
    NombreInput.current.focus();
    if (id) {
      getEntidadBancaria();
    }
  }, [id]);

  const getEntidadBancaria = async () => {
    const res = await sendRequest('GET', '', `api/proveedores/${id}`);
    const entidadBancaria = res.data;

    setNombre(entidadBancaria.nombre || '');
    setNumDocumento(entidadBancaria.numDocumento || '');
    setEdad(entidadBancaria.edad || '');
    setTelefono(entidadBancaria.telefono || '');
    setCorreo(entidadBancaria.correo || '');
    setNombreEntidadBancaria(entidadBancaria.nombreEntidadBancaria || '');
    setNumeroCuentaBancaria(entidadBancaria.numeroCuentaBancaria || '');
  };

  const save = async (e) => {
    e.preventDefault();

    if (id) {
      method = 'PUT';
      url = `api/proveedores/${id}`;
      redirect = '/';
    }

    const res = await sendRequest(method, {
      id,
      nombre,
      numDocumento,
      edad,
      telefono,
      correo,
      nombreEntidadBancaria,
      numeroCuentaBancaria,
    }, url, redirect);

    if (method === 'POST' && res.status === true) {
      setNombre('');
      setNumDocumento('');
      setEdad('');
      setTelefono('');
      setCorreo('');
      setNombreEntidadBancaria('');
      setNumeroCuentaBancaria('');
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row mt-5'>
        <div className='col-md-4 offset-md-4'>
          <div className='card border ' style={{ border: '1px solid #af0004', padding: '15px' }}>
            <div className='card-header ' style={{ backgroundColor: '#440000 !important'}}>
              {id ? 'Editar proveedores' : 'Crear proveedores'}
            </div>
            <div className='card-body'>
              <form onSubmit={save}>
                <DivInput
                  type='text'
                  icon='fa-user'
                  value={nombre}
                  className='form-control'
                  placeholder='Nombre'
                  required='required'
                  ref={NombreInput}
                  handleChange={(e) => setNombre(e.target.value)}
                />
                <DivInput
                  type='number'
                  icon='fa-id-card'
                  value={numDocumento}
                  className='form-control'
                  placeholder='Número de Documento'
                  required='required'
                  handleChange={(e) => setNumDocumento(e.target.value)}
                />
                <DivInput
                  type='number'
                  icon='fa-calendar'
                  value={edad}
                  className='form-control'
                  placeholder='Edad'
                  required='required'
                  handleChange={(e) => setEdad(e.target.value)}
                />
                <DivInput
                  type='tel'
                  icon='fa-phone'
                  value={telefono}
                  className='form-control'
                  placeholder='Teléfono'
                  required='required'
                  handleChange={(e) => setTelefono(e.target.value)}
                />
                <DivInput
                  type='email'
                  icon='fa-envelope'
                  value={correo}
                  className='form-control'
                  placeholder='Correo Electrónico'
                  required='required'
                  handleChange={(e) => setCorreo(e.target.value)}
                />
                <DivInput
                  type='text'
                  icon='fa-building'
                  value={nombreEntidadBancaria}
                  className='form-control'
                  placeholder='Nombre de la Entidad Bancaria'
                  required='required'
                  handleChange={(e) => setNombreEntidadBancaria(e.target.value)}
                />
                <DivInput
                  type='number'
                  icon='fa-credit-card'
                  value={numeroCuentaBancaria}
                  className='form-control'
                  placeholder='Número de Cuenta Bancaria'
                  required='required'
                  handleChange={(e) => setNumeroCuentaBancaria(e.target.value)}
                />
                <div className='d-flex justify-content-between mt-3'>
                  <button className='btn btn-sm btn-dark' type='submit' style={{ backgroundColor: '#440000 ' }}>
                    <i className='fa-solid fa-save'></i> Guardar
                  </button>
                  <Link to='/proveedor' style={{ textDecoration: 'none' }}>
                    <button className='btn btn-sm btn-secondary' type='submit' style={{ backgroundColor: '#440000 ' }}>
                      <i className='fa-solid fa-times'></i> Cancelar
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEntidadBancaria;
