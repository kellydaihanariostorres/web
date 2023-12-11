import React, { useEffect, useState, useRef } from 'react';
import { sendRequest } from '../../functions';
import DivInput from '../DivInput';
import { Link } from 'react-router-dom';

const FormEmpleado = ({ empleadoId }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [documento, setDocumento] = useState('');
  const [cargo, setCargo] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [sueldo, setSueldo] = useState('');
  const [bodegaId, setBodegaId] = useState('');
  const NombreInput = useRef();

  let method = 'POST';
  let url = 'api/empleados';
  let redirect = '';

  useEffect(() => {
    NombreInput.current.focus();
    if (empleadoId) {
      getEmpleado();
    }
  }, [empleadoId]);

  const getEmpleado = async () => {
    const res = await sendRequest('GET', '', `api/empleados/${empleadoId}`);
    const empleado = res.data;

    setNombre(empleado.nombre || '');
    setApellido(empleado.apellido || '');
    setDocumento(empleado.documento || '');
    setCargo(empleado.cargo || '');
    setFechaInicio(empleado.fechaInicio || '');
    setFechaFin(empleado.fechaFin || '');
    setSueldo(empleado.sueldo || '');
    setBodegaId(empleado.bodegaId || '');
  };

  const save = async (e) => {
    e.preventDefault();

    if (empleadoId) {
      method = 'PUT';
      url = `api/empleados/${empleadoId}`;
      redirect = '/';
    }

    const res = await sendRequest(method, {
      empleadoId,
      nombre,
      apellido,
      documento,
      cargo,
      fechaInicio,
      fechaFin,
      sueldo,
      bodegaId,
    }, url, redirect);

    if (method === 'POST' && res.status === true) {
      setNombre('');
      setApellido('');
      setDocumento('');
      setCargo('');
      setFechaInicio('');
      setFechaFin('');
      setSueldo('');
      setBodegaId('');
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row mt-5'>
        <div className='col-md-4 offset-md-4'>
          <div className='card border border-info' style={{ borderColor: '#af0004' }}>
            <div className='card-header bg-danger' style={{ backgroundColor: '#440000' }}>
              {empleadoId ? 'Editar Empleado' : 'Crear Empleado'}
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
                  type='text'
                  icon='fa-id-card'
                  value={documento}
                  className='form-control'
                  placeholder='Documento'
                  required='required'
                  handleChange={(e) => setDocumento(e.target.value)}
                />
                <DivInput
                  type='text'
                  icon='fa-briefcase'
                  value={cargo}
                  className='form-control'
                  placeholder='Cargo'
                  required='required'
                  handleChange={(e) => setCargo(e.target.value)}
                />
                <DivInput
                  type='text'
                  icon='fa-calendar'
                  value={fechaInicio}
                  className='form-control'
                  placeholder='Fecha de Inicio'
                  required='required'
                  handleChange={(e) => setFechaInicio(e.target.value)}
                />
                <DivInput
                  type='text'
                  icon='fa-calendar'
                  value={fechaFin}
                  className='form-control'
                  placeholder='Fecha de Fin'
                  required='required'
                  handleChange={(e) => setFechaFin(e.target.value)}
                />
                <DivInput
                  type='text'
                  icon='fa-money-bill'
                  value={sueldo}
                  className='form-control'
                  placeholder='Sueldo'
                  required='required'
                  handleChange={(e) => setSueldo(e.target.value)}
                />
                <DivInput
                  type='text'
                  icon='fa-home'
                  value={bodegaId}
                  className='form-control'
                  placeholder='ID de Bodega'
                  required='required'
                  handleChange={(e) => setBodegaId(e.target.value)}
                />
                <div className='d-flex justify-content-between mt-3'>
                  <button className='btn btn-sm btn-dark' type='submit' style={{ backgroundColor: '#af0004' }}>
                    <i className='fa-solid fa-save'></i> Guardar
                  </button>
                  <Link to='/empleado' style={{ textDecoration: 'none' }}>
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

export default FormEmpleado;
