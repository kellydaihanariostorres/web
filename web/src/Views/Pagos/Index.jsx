import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { show_alerta } from '../../functions';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManageBodegas = () => {
  const apiUrl = 'https://localhost:7284/api/nomina';
  const [nominas, setNominas] = useState([]);
  const [nominaId, setNominaId] = useState('');
  const [cuentaBancaria, setCuentaBancaria] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState('');
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);

  useEffect(() => {
    getNominas();
  }, []);

  const getNominas = async () => {
    try {
      const response = await axios.get(apiUrl);
      setNominas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (op, id, cuentaBancaria, email, telefono, direccion, fechaCreacion) => {
    setOperation(op);
    setNominaId(id);

    if (op === 1) {
      setTitle('Registrar nómina');
      setCuentaBancaria('');
      setEmail('');
      setTelefono('');
      setDireccion('');
      setFechaCreacion('');
    } else if (op === 2) {
      setTitle('Editar nómina');
      setCuentaBancaria(cuentaBancaria);
      setEmail(email);
      setTelefono(telefono);
      setDireccion(direccion);
      setFechaCreacion(fechaCreacion);
    }

    window.setTimeout(function () {
      document.getElementById('cuentaBancaria').focus();
    }, 500);
  };

  const validar = () => {
    if (
      cuentaBancaria.trim() === '' ||
      email.trim() === '' ||
      telefono.trim() === '' ||
      direccion.trim() === '' ||
      fechaCreacion.trim() === ''
    ) {
      show_alerta('Completa todos los campos', 'warning');
    } else {
      const parametros = { cuentaBancaria, email, telefono, direccion, fechaCreacion };
      const metodo = operation === 1 ? 'POST' : 'PUT';
      enviarSolicitud(metodo, parametros);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    const nominaIdParam = nominaId || '';
    try {
      const response = await axios[metodo.toLowerCase()](
        nominaIdParam ? `${apiUrl}/${nominaIdParam}` : apiUrl,
        parametros
      );
      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);
      if (tipo === 'success') {
        document.getElementById('btnCerrar').click();
        getNominas();
      }
    } catch (error) {
      show_alerta('Error de solicitud', 'error');
      console.error(error);
    }
  };

  const deleteNomina = (nominaId, cuentaBancaria) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro quieres eliminar la nómina con cuenta bancaria ${cuentaBancaria}?`,
      icon: 'question',
      text: 'No se podrá dar marcha atrás',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/${nominaId}`);
          show_alerta('Nómina eliminada exitosamente', 'success');
          getNominas();
        } catch (error) {
          show_alerta('Error al eliminar la nómina', 'error');
          console.error(error);
        }
      } else {
        show_alerta('La nómina no fue eliminada', 'info');
      }
    });
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <div className='col-md-4 offset-md-4'>
          <div>
            <button
              onClick={() => openModal(1)}
              className='btn btn-dark'
              data-bs-toggle='modal'
              data-bs-target='#modalNominas'
              style={{
                padding: '10px 10px',
                background: '#440000',
                borderColor: '#440000',
                borderRadius: '30px',
                transform: 'translateX(0px)',
                color: 'white',
                fontSize: '17px',
                width: 'auto',
              }}
            >
              <i className='fa-solid fa-circle-plus'></i> Añadir 
            </button>
          </div>
        </div>
      </div>
      <div className='row mt-3'>
        <div className='col-12 col-lg-8 offset-0 offset-lg-2 mx-auto text-center' style={{ width: '100%' }}>
          <div>
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th className='table-header' style={{ width: '10%', background: '#440000', color: 'white' }}>
                    #
                  </th>
                  <th className='table-header' style={{ width: '15%', background: '#440000', color: 'white' }}>
                    Cuenta Bancaria
                  </th>
                  <th className='table-header' style={{ width: '15%', background: '#440000', color: 'white' }}>
                    Email
                  </th>
                  <th className='table-header' style={{ width: '10%', background: '#440000', color: 'white' }}>
                    Teléfono
                  </th>
                  <th className='table-header' style={{ width: '20%', background: '#440000', color: 'white' }}>
                    Dirección
                  </th>
                  <th className='table-header' style={{ width: '15%', background: '#440000', color: 'white' }}>
                    Fecha Creación
                  </th>
                  <th className='table-header' style={{ width: '15%', background: '#440000', color: 'white' }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {nominas.map((nomina, i) => (
                  <tr key={nomina.nominaId}>
                    <td style={{ background: '#dadada' }}>{i + 1}</td>
                    <td style={{ background: '#dadada' }}>{nomina.cuentaBancaria}</td>
                    <td style={{ background: '#dadada' }}>{nomina.email}</td>
                    <td style={{ background: '#dadada' }}>{nomina.telefono}</td>
                    <td style={{ background: '#dadada' }}>{nomina.direccion}</td>
                    <td style={{ background: '#dadada' }}>{nomina.fechaCreacion}</td>
                    <td style={{ background: '#dadada' }}>
                      <button
                        onClick={() =>
                          openModal(
                            2,
                            nomina.nominaId,
                            nomina.cuentaBancaria,
                            nomina.email,
                            nomina.telefono,
                            nomina.direccion,
                            nomina.fechaCreacion
                          )
                        }
                        className='btn btn-warning'
                        data-bs-toggle='modal'
                        data-bs-target='#modalNominas'
                        style={{ background: '#440000', color: 'white' }}
                      >
                        <i className='fa-solid fa-edit'></i>
                      </button>
                      &nbsp;
                      <button
                        onClick={() => deleteNomina(nomina.nominaId, nomina.cuentaBancaria)}
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
          </div>
        </div>
      </div>
      <div id='modalNominas' className='modal fade' aria-hidden='true'>
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
                  <i className='fa-solid fa-credit-card'></i>
                </span>
                <input
                  type='text'
                  id='cuentaBancaria'
                  className='form-control'
                  placeholder='Cuenta Bancaria'
                  value={cuentaBancaria}
                  onChange={(e) => setCuentaBancaria(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-envelope'></i>
                </span>
                <input
                  type='text'
                  id='email'
                  className='form-control'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-phone'></i>
                </span>
                <input
                  type='text'
                  id='telefono'
                  className='form-control'
                  placeholder='Teléfono'
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-map-marker-alt'></i>
                </span>
                <input
                  type='text'
                  id='direccion'
                  className='form-control'
                  placeholder='Dirección'
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-calendar'></i>
                </span>
                <input
                  type='text'
                  id='fechaCreacion'
                  className='form-control'
                  placeholder='Fecha Creación'
                  value={fechaCreacion}
                  onChange={(e) => setFechaCreacion(e.target.value)}
                />
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar(nominaId)} className='btn btn-success'>
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

export default ManageBodegas;
