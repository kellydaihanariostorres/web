import React, { useEffect, useState } from 'react';
import DivAdd from '../Components/DivAdd';
import DivTable from '../Components/DivTable';
import { show_alerta } from '../functions';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManageUsuarios = () => {
  const apiUrl = 'https://localhost:7284/api/authentication';
  const [usuarios, setUsuarios] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [roles, setRoles] = useState([]);
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getUsuarios(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

  const getUsuarios = async (pageNumber, pageSize) => {
    try {
      const response = await axios.get(`${apiUrl}?page=${pageNumber}&size=${pageSize}`);
      setUsuarios(response.data);
      setTotalPages(Math.ceil(response.data.length / pageSize));
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  const openModal = (op, id, firstName, lastName, userName, password, email, phoneNumber, roles) => {
    setOperation(op);
    setTitle(op === 1 ? 'Registrar usuario' : 'Editar usuario');
    setFirstName(op === 1 ? '' : firstName);
    setLastName(op === 1 ? '' : lastName);
    setUserName(op === 1 ? '' : userName);
    setPassword(op === 1 ? '' : password);
    setEmail(op === 1 ? '' : email);
    setPhoneNumber(op === 1 ? '' : phoneNumber);
    setRoles(op === 1 ? [] : roles);
  };

  const validar = () => {
    if (
      firstName.trim() === '' ||
      lastName.trim() === '' ||
      userName.trim() === '' ||
      password.trim() === '' ||
      email.trim() === '' ||
      phoneNumber.trim() === '' ||
      roles.length === 0
    ) {
      show_alerta('Completa todos los campos', 'warning');
    } else {
      const parametros = {
        FirstName: firstName,
        LastName: lastName,
        UserName: userName,
        Password: password,
        Email: email,
        PhoneNumber: phoneNumber,
        roles: roles
      };
      const metodo = operation === 1 ? 'POST' : 'PUT';
      enviarSolicitud(metodo, parametros);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    try {
      const response = await axios[metodo.toLowerCase()](apiUrl, parametros);
      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);
      getUsuarios();
      resetState();
    } catch (error) {
      show_alerta('Error de solicitud', 'error');
      console.error(error);
    }
  };

  const resetState = () => {
    setFirstName('');
    setLastName('');
    setUserName('');
    setPassword('');
    setEmail('');
    setPhoneNumber('');
    setRoles([]);
  };

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    if (text.trim() === '') {
      setPageNumber(1);
      getUsuarios();
    } else {
      const filteredUsuarios = usuarios.filter((usuario) =>
        usuario.firstName.toLowerCase().includes(text.toLowerCase())
      );
      setUsuarios(filteredUsuarios);
    }
  };

  const deleteUsuario = (id) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: '¿Seguro quieres eliminar el usuario?',
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
        } catch (error) {
          show_alerta('Error al eliminar el usuario', 'error');
          console.error(error);
        } finally {
          getUsuarios();
          resetState();
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className='input-group mb-3'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Buscar usuario'
                  aria-label='Buscar usuario'
                  aria-describedby='button-addon2'
                  onChange={handleSearch}
                  value={searchText}
                  style={{
                    height: '40px',
                    borderRadius: '45px',
                    marginRight: '100px',
                    width: '500px',
                    marginLeft: 'auto',
                    position: 'absolute',
                    right: 0,
                  }}
                />
              </div>
              <DivAdd>
                <button
                  type='button'
                  className='btn btn-danger'
                  onClick={() => openModal(1)}
                  data-bs-toggle='modal'
                  data-bs-target='#modalUsuarios'
                  style={{
                    background: '#440000',
                    borderColor: '#440000',
                    color: 'white',
                    width: '100%',
                    marginLeft: '100px',
                  }}
                >
                  <i className='fa-solid fa-circle-plus'></i> Añadir
                </button>
              </DivAdd>
            </div>
          </div>
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
                    Nombre de usuario
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Email
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Teléfono
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {usuarios
                  .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
                  .map((usuario, i) => (
                    <tr key={usuario.id}>
                      <td style={{ background: '#dadada' }}>{i + 1}</td>
                      <td style={{ background: '#dadada' }}>{usuario.firstName}</td>
                      <td style={{ background: '#dadada' }}>{usuario.lastName}</td>
                      <td style={{ background: '#dadada' }}>{usuario.userName}</td>
                      <td style={{ background: '#dadada' }}>{usuario.email}</td>
                      <td style={{ background: '#dadada' }}>{usuario.phoneNumber}</td>
                      <td style={{ background: '#dadada' }}>
                        <button
                          onClick={() => openModal(2, usuario.id, usuario.firstName, usuario.lastName, usuario.userName, usuario.password, usuario.email, usuario.phoneNumber, usuario.roles)}
                          className='btn btn-warning'
                          data-bs-toggle='modal'
                          data-bs-target='#modalUsuarios'
                          style={{ background: '#440000', color: 'white' }}
                        >
                          <i className='fa-solid fa-edit'></i>
                        </button>
                        &nbsp;
                        <button
                          onClick={() => deleteUsuario(usuario.id)}
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
            <div className='d-flex justify-content-between'>
              <button
                onClick={handlePreviousPage}
                disabled={pageNumber === 1}
                style={{ background: '#440000', borderColor: '#440000', color: 'white' }}
              >
                Anterior
              </button>
              <span>
                Página {pageNumber} de {pageSize}
              </span>
              <button
                onClick={handleNextPage}
                disabled={pageNumber === totalPages}
                style={{ background: '#440000', borderColor: '#440000', color: 'white' }}
              >
                Siguiente
              </button>
            </div>
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
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-user'></i>
                </span>
                <input
                  type='text'
                  id='firstName'
                  className='form-control'
                  placeholder='Nombre'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-user'></i>
                </span>
                <input
                  type='text'
                  id='lastName'
                  className='form-control'
                  placeholder='Apellido'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-user'></i>
                </span>
                <input
                  type='text'
                  id='userName'
                  className='form-control'
                  placeholder='Nombre de usuario'
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
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
                <span className='input-group-text'>
                  <i className='fa-solid fa-envelope'></i>
                </span>
                <input
                  type='email'
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
                  id='phoneNumber'
                  className='form-control'
                  placeholder='Teléfono'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-bs-dismiss='modal'
                style={{ background: '#440000', borderColor: '#440000', color: 'white' }}
              >
                Cerrar
              </button>
              <button
                type='button'
                className='btn btn-primary'
                style={{ background: '#440000', borderColor: '#440000', color: 'white' }}
                onClick={validar}
              >
                {operation === 1 ? 'Registrar' : 'Editar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsuarios;
