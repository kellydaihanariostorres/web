import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { show_alerta } from '../../functions';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManageEmpleados = () => {
  const apiUrl = 'https://localhost:7284/api/empleados';
  const [empleados, setEmpleados] = useState([]);
  const [empleadoId, setEmpleadoId] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [documento, setDocumento] = useState('');
  const [cargo, setCargo] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [sueldo, setSueldo] = useState('');
  const [bodegaId, setBodegaId] = useState('');
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);

  useEffect(() => {
    getEmpleados();
  }, []);

  const getEmpleados = async () => {
    try {
      const response = await axios.get(apiUrl);
      setEmpleados(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (op, id, nombre, apellido, documento, cargo, fechaInicio, fechaFin, sueldo, bodegaId) => {
    setOperation(op);
    setEmpleadoId(id);

    if (op === 1) {
      setTitle('Registrar empleado');
      setNombre('');
      setApellido('');
      setDocumento('');
      setCargo('');
      setFechaInicio('');
      setFechaFin('');
      setSueldo('');
      setBodegaId('');
    } else if (op === 2) {
      setTitle('Editar empleado');
      setNombre(nombre);
      setApellido(apellido);
      setDocumento(documento);
      setCargo(cargo);
      setFechaInicio(fechaInicio);
      setFechaFin(fechaFin);
      setSueldo(sueldo);
      setBodegaId(bodegaId);
    }

     // Usar el evento 'shown.bs.modal' para esperar a que el modal esté completamente visible
      $(this.modal).on('shown.bs.modal', function () {
        document.getElementById('nombre').focus();
      });
  };

  const validar = () => {
    if (
      nombre.trim() === '' ||
      apellido.trim() === '' ||
      documento.trim() === '' ||
      cargo.trim() === '' ||
      fechaInicio.trim() === '' ||
      fechaFin.trim() === '' ||
      sueldo.trim() === '' ||
      bodegaId.trim() === ''
    ) {
      show_alerta('Completa todos los campos', 'warning');
    } else {
      const parametros = { nombre, apellido, documento, cargo, fechaInicio, fechaFin, sueldo, bodegaId };
      const metodo = operation === 1 ? 'POST' : 'PUT';
      enviarSolicitud(metodo, parametros);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    const empleadoIdParam = empleadoId || '';
    try {
      const response = await axios[metodo.toLowerCase()](
        empleadoIdParam ? `${apiUrl}/${empleadoIdParam}` : apiUrl,
        parametros
      );
      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);
      if (tipo === 'success') {
        document.getElementById('btnCerrar').click();
        getEmpleados();
      }
    } catch (error) {
      show_alerta('Error de solicitud', 'error');
      console.error(error);
    }
  };

  const deleteEmpleado = (empleadoId, nombre) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro quieres eliminar al empleado ${nombre}?`,
      icon: 'question',
      text: 'No se podrá dar marcha atrás',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/${empleadoId}`);
          show_alerta('Empleado eliminado exitosamente', 'success');
          getEmpleados();
        } catch (error) {
          show_alerta('Error al eliminar al empleado', 'error');
          console.error(error);
        }
      } else {
        show_alerta('El empleado no fue eliminado', 'info');
      }
    });
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <div className='col-md-4 offset-md-4'>
          <DivAdd>
            <button
              onClick={() => openModal(1)}
              data-bs-toggle='modal'
              data-bs-target='#modalEmpleados'
              className='btn btn-dark mx-auto col-3'
              style={{ background: '#440000', borderColor: '#440000', borderRadius: '45px', transform: 'translate(36px)', color: 'white' }}
            >
              <i className='fa-solid fa-circle-plus'></i> Añadir
            </button>
          </DivAdd>
        </div>
      </div>
      <div className='row mt-3'>
        <div className='col-12 col-lg-8 offset-0 offset-lg-2 mx-auto text-center' style={{ width: '100%' }}>
          <DivTable col='6' off='3'>
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    #
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Nombre
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Apellido
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Documento
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Cargo
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Fecha de Inicio
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Fecha de Fin
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Sueldo
                  </th>
                  
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {empleados.map((empleado, i) => (
                  <tr key={empleado.empleadoId}>
                    <td style={{ background: '#dadada' }}>{i + 1}</td>
                    <td style={{ background: '#dadada' }}>{empleado.nombre}</td>
                    <td style={{ background: '#dadada' }}>{empleado.apellido}</td>
                    <td style={{ background: '#dadada' }}>{empleado.documento}</td>
                    <td style={{ background: '#dadada' }}>{empleado.cargo}</td>
                    <td style={{ background: '#dadada' }}>{empleado.fechaInicio}</td>
                    <td style={{ background: '#dadada' }}>{empleado.fechaFin}</td>
                    <td style={{ background: '#dadada' }}>{empleado.sueldo}</td>
                    
                    <td style={{ background: '#dadada' }}>
                      <button
                        onClick={() =>
                          openModal(
                            2,
                            empleado.empleadoId,
                            empleado.nombre,
                            empleado.apellido,
                            empleado.documento,
                            empleado.cargo,
                            empleado.fechaInicio,
                            empleado.fechaFin,
                            empleado.sueldo,
                            empleado.bodegaId
                          )
                        }
                        className='btn btn-warning'
                        data-bs-toggle='modal'
                        data-bs-target='#modalEmpleados'
                        style={{ background: '#440000', color: 'white' }}
                      >
                        <i className='fa-solid fa-edit'></i>
                      </button>
                      &nbsp;
                      <button
                        onClick={() => deleteEmpleado(empleado.empleadoId, empleado.nombre)}
                        className='btn btn-danger'
                        style={{ background: '#440000', color: 'white' }}
                      >
                        <i className='fa-solid fa-trash'></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DivTable>
        </div>
      </div>
      <div id='modalEmpleados' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='id' />
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='nombre'
                  className='form-control'
                  placeholder='Nombre'
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='apellido'
                  className='form-control'
                  placeholder='Apellido'
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='documento'
                  className='form-control'
                  placeholder='Documento'
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='cargo'
                  className='form-control'
                  placeholder='Cargo'
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='fechaInicio'
                  className='form-control'
                  placeholder='Fecha de Inicio'
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='fechaFin'
                  className='form-control'
                  placeholder='Fecha de Fin'
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='sueldo'
                  className='form-control'
                  placeholder='Sueldo'
                  value={sueldo}
                  onChange={(e) => setSueldo(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='bodegaId'
                  className='form-control'
                  placeholder='Bodega ID'
                  value={bodegaId}
                  onChange={(e) => setBodegaId(e.target.value)}
                />
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar(empleadoId)} className='btn btn-success'>
                  <i className='fa-solid fa-floppy-disk'></i> Guardar
                </button>
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageEmpleados;
