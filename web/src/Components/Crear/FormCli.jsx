import React, { useEffect, useState, useRef } from 'react';
import { sendRequest } from '../../functions';
import DivInput from '../DivInput';
import { Link } from 'react-router-dom';

const FormCli = ({ id }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numDocumento, setNumDocumento] = useState('');
  const [correo, setCorreo] = useState('');
  const NombreInput = useRef();

  let method = 'POST';
  let url = 'api/clientes';
  let redirect = '';

  useEffect(() => {
    NombreInput.current.focus();
    if (id) {
      getUsuario();
    }
  }, [id]);

  const getUsuario = async () => {
    const res = await sendRequest('GET', '', `api/clientes/${id}`);
    const usuario = res.data;

    setNombre(usuario.nombre || '');
    setApellido(usuario.apellido || '');
    setEdad(usuario.edad || '');
    setTipoDocumento(usuario.tipoDocumento || '');
    setNumDocumento(usuario.numDocumento || '');
    setCorreo(usuario.correo || '');
  };

  const save = async (e) => {
    e.preventDefault();

    if (id) {
      method = 'PUT';
      url = `api/clientes/${id}`;
      redirect = '/';
    }

    const res = await sendRequest(method, {
      id,
      nombre,
      apellido,
      edad,
      tipoDocumento,
      numDocumento,
      correo,
    }, url, redirect);

    if (method === 'POST' && res.status === true) {
      setNombre('');
      setApellido('');
      setEdad('');
      setTipoDocumento('');
      setNumDocumento('');
      setCorreo('');
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row mt-5'>
        <div className='col-md-4 offset-md-4'>
          <div className='card border border-info' style={{ borderColor: '#af0004' }}>
            <div className='card-header bg-danger' style={{ backgroundColor: '#440000' }}>
              {id ? 'Editar Usuario' : 'Crear Usuario'}
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
                  type='text'
                  icon='fa-user'
                  value={apellido}
                  className='form-control'
                  placeholder='Apellido'
                  required='required'
                  handleChange={(e) => setApellido(e.target.value)}
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
                  type='text'
                  icon='fa-id-card'
                  value={tipoDocumento}
                  className='form-control'
                  placeholder='Tipo de Documento'
                  required='required'
                  handleChange={(e) => setTipoDocumento(e.target.value)}
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
                  type='email'
                  icon='fa-envelope'
                  value={correo}
                  className='form-control'
                  placeholder='Correo Electrónico'
                  required='required'
                  handleChange={(e) => setCorreo(e.target.value)}
                />
                <div className='d-flex justify-content-between mt-3'>
                  <button className='btn btn-sm btn-dark' type='submit' style={{ backgroundColor: '#af0004' }}>
                    <i className='fa-solid fa-save'></i> Guardar
                  </button>
                  <Link to='/clientes' style={{ textDecoration: 'none' }}>
                    <button className='btn btn-sm btn-secondary' type='submit' style={{ backgroundColor: '#af0004' }}>
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

export default FormCli;
