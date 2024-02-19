import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { show_alerta } from './../functions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManageUsuarios = () => {
  const apiUrl = 'https://localhost:7284/api/registro';
  const [usuarios, setUsuarios] = useState([]);
  const [registroId, setRegistroId] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [cargo, setCargo] = useState(1);
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

  const openModal = (op, id, nombreUsuario, password, cargo) => {
    setOperation(op);
    setRegistroId(id);

    if (op === 1) {
      setTitle('Registrar usuario');
      setNombreUsuario('');
      setPassword('');
      setCargo(1);
    } else if (op === 2) {
      setTitle('Editar usuario');
      setNombreUsuario(nombreUsuario);
      setPassword(password);
      setCargo(cargo);
    }

    // Usar el evento 'shown.bs.modal' para esperar a que el modal esté completamente visible
    document.getElementById('modalUsuarios').addEventListener('shown.bs.modal', function () {
      document.getElementById('nombreUsuario').focus();
    });
  };

  const validar = () => {
    if (!nombreUsuario.trim() || !password.trim()) {
      show_alerta('Completa todos los campos', 'warning');
    } else {
      const parametros = { nombreUsuario, password, cargo };
      const metodo = operation === 1 ? 'POST' : 'PUT';
      enviarSolicitud(metodo, parametros);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    const registroIdParam = registroId || '';
    try {
      const response = await axios[metodo.toLowerCase()](
        registroIdParam ? `${apiUrl}/${registroIdParam}` : apiUrl,
        parametros
      );
      console.log('Response:', response);
      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);
      // Si la operación fue exitosa o no, actualizar el estado de 'usuarios'
      getUsuarios();
      // Restablecer estados para preparar el formulario para una nueva entrada
      setRegistroId(null);
      setNombreUsuario('');
      setPassword('');
      setCargo(1);
    } catch (error) {
      show_alerta('Error de solicitud', 'error');
      console.error(error);
    }
  };

  const deleteUsuario = async (registroId, nombreUsuario) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro quieres eliminar al usuario ${nombreUsuario}?`,
      icon: 'question',
      text: 'No se podrá dar marcha atrás',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/${registroId}`);
          show_alerta('Usuario eliminado exitosamente', 'success');
        } catch (error) {
          show_alerta('Error al eliminar al usuario', 'error');
          console.error(error);
        } finally {
          // Después de eliminar, actualizar el estado de 'usuarios'
          getUsuarios();
          // Restablecer estados para preparar el formulario para una nueva entrada
          setRegistroId(null);
          setNombreUsuario('');
          setPassword('');
          setCargo(1);
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
          <div>
            <button
              onClick={() => openModal(1)}
              data-bs-toggle='modal'
              data-bs-target='#modalUsuarios'
              className='btn btn-dark mx-auto col-3'
              style={{ background: '#440000', borderColor: '#440000', borderRadius: '45px', transform: 'translate(36px)', color: 'white' }}
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
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    #
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Nombre de Usuario
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Cargo
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {usuarios.map((usuario, i) => (
                  <tr key={usuario.registroId}>
                    <td style={{ background: '#dadada' }}>{i + 1}</td>
                    <td style={{ background: '#dadada' }}>{usuario.nombreUsuario}</td>
                    <td style={{ background: '#dadada' }}>{usuario.cargo}</td>
                    <td style={{ background: '#dadada' }}>
                      <button
                        onClick={() => openModal(2, usuario.registroId, usuario.nombreUsuario, usuario.password, usuario.cargo)}
                        className='btn btn-warning'
                        data-bs-toggle='modal'
                        data-bs-target='#modalUsuarios'
                        style={{ background: '#440000', color: 'white' }}
                      >
                        <i className='fa-solid fa-edit'></i>
                      </button>
                      &nbsp;
                      <button
                        onClick={() => deleteUsuario(usuario.registroId, usuario.nombreUsuario)}
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
                  <i className='fa-solid fa-user'></i>
                </span>
                <input
                  type='text'
                  id='nombreUsuario'
                  className='form-control'
                  placeholder='Nombre de Usuario'
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-lock'></i>
                </span>
                <input
                  type='password'
                  id='password'
                  className='form-control'
                  placeholder='Contraseña'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <label className='input-group-text' htmlFor='cargo'>
                  Cargo
                </label>
                <select
                  className='form-select'
                  id='cargo'
                  value={cargo}
                  onChange={(e) => setCargo(parseInt(e.target.value))}
                >
                  <option value={1}>Cargo 1</option>
                  <option value={2}>Cargo 2</option>
                  <option value={3}>Cargo 3</option>
                  <option value={4}>Cargo 4</option>
                </select>
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar(registroId)} className='btn btn-success'>
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
