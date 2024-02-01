import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { show_alerta } from '../../functions';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManageUsuarios = () => {
  const apiUrl = 'https://localhost:7284/api/proveedores';
  const [usuarios, setUsuarios] = useState([]);
  const [id, setId] = useState('');
  const [nombre, setNombre] = useState('');
  const [numDocumento, setNumDocumento] = useState('');
  const [edad, setEdad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [nombreEntidadBancaria, setNombreEntidadBancaria] = useState('');
  const [numeroCuentaBancaria, setNumeroCuentaBancaria] = useState('');
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);

  useEffect(() => {
    getUsuarios();
  }, []);

  const getUsuarios = async () => {
    try {
      const response = await axios.get(apiUrl);
      setUsuarios(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (op, id, nombre, numDocumento, edad, telefono, correo, nombreEntidadBancaria, numeroCuentaBancaria) => {
    setOperation(op);
    setId(id);

    if (op === 1) {
      setTitle('Registrar usuario');
      setNombre('');
      setNumDocumento('');
      setEdad('');
      setTelefono('');
      setCorreo('');
      setNombreEntidadBancaria('');
      setNumeroCuentaBancaria('');
    } else if (op === 2) {
      setTitle('Editar usuario');
      setNombre(nombre);
      setNumDocumento(numDocumento);
      setEdad(edad);
      setTelefono(telefono);
      setCorreo(correo);
      setNombreEntidadBancaria(nombreEntidadBancaria);
      setNumeroCuentaBancaria(numeroCuentaBancaria);
    }

     // Usar el evento 'shown.bs.modal' para esperar a que el modal esté completamente visible
      $(this.modal).on('shown.bs.modal', function () {
        document.getElementById('nombre').focus();
      });
  };

  const validar = () => {
    if (
      nombre.trim() === '' ||
      numDocumento.trim() === '' ||
      edad.trim() === '' ||
      telefono.trim() === '' ||
      correo.trim() === '' ||
      nombreEntidadBancaria.trim() === '' ||
      numeroCuentaBancaria.trim() === ''
    ) {
      show_alerta('Completa todos los campos', 'warning');
    } else {
      const parametros = { nombre, numDocumento, edad, telefono, correo, nombreEntidadBancaria, numeroCuentaBancaria };
      const metodo = operation === 1 ? 'POST' : 'PUT';
      enviarSolicitud(metodo, parametros);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    const idParam = id || '';
    try {
      const response = await axios[metodo.toLowerCase()](
        idParam ? `${apiUrl}/${idParam}` : apiUrl,
        parametros
      );
      console.log('Response:', response);
      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);
      if (tipo === 'success') {
        document.getElementById('btnCerrar').click();
        getUsuarios();
      }
    } catch (error) {
      show_alerta('Error de solicitud', 'error');
      console.error(error);
    }
  };

  const deleteUsuario = (id, nombre) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro quieres eliminar al usuario ${nombre}?`,
      icon: 'question',
      text: 'No se podrá dar marcha atrás',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/${id}`);
          show_alerta('Usuario eliminado exitosamente', 'success');
          getUsuarios();
        } catch (error) {
          show_alerta('Error al eliminar al usuario', 'error');
          console.error(error);
        }
      } else {
        show_alerta('El usuario no fue eliminado', 'info');
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
              data-bs-target='#modalUsuarios'
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
                    NumDocumento
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Edad
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Telefono
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Correo
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Nombre Entidad Bancaria
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Numero Cuenta Bancaria
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {usuarios.map((usuario, i) => (
                  <tr key={usuario.id}>
                    <td style={{ background: '#dadada' }}>{i + 1}</td>
                    <td style={{ background: '#dadada' }}>{usuario.nombre}</td>
                    <td style={{ background: '#dadada' }}>{usuario.numDocumento}</td>
                    <td style={{ background: '#dadada' }}>{usuario.edad}</td>
                    <td style={{ background: '#dadada' }}>{usuario.telefono}</td>
                    <td style={{ background: '#dadada' }}>{usuario.correo}</td>
                    <td style={{ background: '#dadada' }}>{usuario.nombreEntidadBancaria}</td>
                    <td style={{ background: '#dadada' }}>{usuario.numeroCuentaBancaria}</td>
                    <td style={{ background: '#dadada' }}>
                      <button
                        onClick={() =>
                          openModal(
                            2,
                            usuario.id,
                            usuario.nombre,
                            usuario.numDocumento,
                            usuario.edad,
                            usuario.telefono,
                            usuario.correo,
                            usuario.nombreEntidadBancaria,
                            usuario.numeroCuentaBancaria
                          )
                        }
                        className='btn btn-warning'
                        data-bs-toggle='modal'
                        data-bs-target='#modalUsuarios'
                        style={{ background: '#440000', color: 'white' }}
                      >
                        <i className='fa-solid fa-edit'></i>
                      </button>
                      &nbsp;
                      <button
                        onClick={() => deleteUsuario(usuario.id, usuario.nombre)}
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
      <div id='modalUsuarios' className='modal fade' aria-hidden='true'>
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
                  id='numDocumento'
                  className='form-control'
                  placeholder='NumDocumento'
                  value={numDocumento}
                  onChange={(e) => setNumDocumento(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='edad'
                  className='form-control'
                  placeholder='Edad'
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='telefono'
                  className='form-control'
                  placeholder='Telefono'
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='correo'
                  className='form-control'
                  placeholder='Correo'
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='nombreEntidadBancaria'
                  className='form-control'
                  placeholder='Nombre Entidad Bancaria'
                  value={nombreEntidadBancaria}
                  onChange={(e) => setNombreEntidadBancaria(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='numeroCuentaBancaria'
                  className='form-control'
                  placeholder='Numero Cuenta Bancaria'
                  value={numeroCuentaBancaria}
                  onChange={(e) => setNumeroCuentaBancaria(e.target.value)}
                />
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar(id)} className='btn btn-success'>
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

export default ManageUsuarios;
