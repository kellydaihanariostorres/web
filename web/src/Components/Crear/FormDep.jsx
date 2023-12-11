import React, { useEffect, useState, useRef } from 'react';
import { sendRequest } from '../../functions';
import DivInput from '../DivInput';
import { Link } from 'react-router-dom';

const FormDep = ({ id }) => {
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const NombreInput = useRef();

  let method = 'POST';
  let url = 'api/bodegas';
  let redirect = '';

  useEffect(() => {
    NombreInput.current.focus();
    if (id) {
      getBodega();
    }
  }, [id]);

  const getBodega = async () => {
    const res = await sendRequest('GET', '', `api/bodegas/${id}`);
    const bodega = res.data;

    setNombre(bodega.nombre || '');
    setEstado(bodega.estado || '');
    setDireccion(bodega.direccion || '');
    setCiudad(bodega.ciudad || '');
  };

  const save = async (e) => {
    e.preventDefault();

    if (id) {
      method = 'PUT';
      url = `api/bodegas/${id}`;
      redirect = '/';
    }

    const res = await sendRequest(method, { nombre, estado, direccion, ciudad }, url, redirect);

    if (method === 'POST' && res.status === true) {
      setNombre('');
      setEstado('');
      setDireccion('');
      setCiudad('');
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row mt-5'>
        <div className='col-md-4 offset-md-4' >
          <div className='card border border-info' style={{  borderColor: '#af0004' }} >
          <div className='card-header bg-danger' style={{ backgroundColor: '#440000' }}>
              {id ? 'Editar Bodega' : 'Crear Bodega'}
            </div>
            <div className='card-body' >
              <form onSubmit={save} >
                <DivInput
                  type='text'
                  icon='fa-building'
                  value={nombre}
                  className='form-control'
                  placeholder='Nombre'
                  required='required'
                  ref={NombreInput}
                  handleChange={(e) => setNombre(e.target.value)}
                />
                <DivInput
                  type='text'
                  icon='fa-info-circle'
                  value={estado}
                  className='form-control'
                  placeholder='Estado'
                  required='required'
                  handleChange={(e) => setEstado(e.target.value)}
                />
                <DivInput
                  type='text'
                  icon='fa-map-marker-alt'
                  value={direccion}
                  className='form-control'
                  placeholder='Dirección'
                  required='required'
                  handleChange={(e) => setDireccion(e.target.value)}
                />
                <DivInput
                  type='text'
                  icon='fa-city'
                  value={ciudad}
                  className='form-control'
                  placeholder='Ciudad'
                  required='required'
                  handleChange={(e) => setCiudad(e.target.value)}
                />
                <div className='d-flex justify-content-between mt-3'>
                  <button className='btn btn-sm btn-dark' type='submit' style={{ backgroundColor: '#af0004' }}>
                    <i className='fa-solid fa-save'></i> Guardar
                  </button>
                  <Link to='/bodega'  style={{ textDecoration: 'none'}}>
                  <button className='btn btn-sm btn-secondary' type='submit'  style={{ backgroundColor: '#af0004' }}>
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

export default FormDep;
