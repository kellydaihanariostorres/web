import React, { useEffect, useState } from 'react';
import { show_alerta } from '../../functions';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManageBodegas = () => {
  const apiUrl = 'https://localhost:7284/api/clientes';
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numDocumento, setNumDocumento] = useState('');
  const [correo, setCorreo] = useState('');
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);

  useEffect(() => {
    getClientes();
  }, []);

  const getClientes = async () => {
    try {
      const response = await axios.get(apiUrl);
      setClientes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (op, id, nombre, apellido, edad, tipoDocumento, numDocumento, correo) => {
    setOperation(op);
    setClienteId(id);

    if (op === 1) {
      setTitle('Registrar cliente');
      setNombre('');
      setApellido('');
      setEdad('');
      setTipoDocumento('');
      setNumDocumento('');
      setCorreo('');
    } else if (op === 2) {
      setTitle('Editar cliente');
      setNombre(nombre);
      setApellido(apellido);
      setEdad(edad);
      setTipoDocumento(tipoDocumento);
      setNumDocumento(numDocumento);
      setCorreo(correo);
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
      edad.trim() === '' ||
      tipoDocumento.trim() === '' ||
      numDocumento.trim() === '' ||
      correo.trim() === ''
    ) {
      show_alerta('Completa todos los campos', 'warning');
    } else {
      const parametros = { nombre, apellido, edad, tipoDocumento, numDocumento, correo };
      const metodo = operation === 1 ? 'POST' : 'PUT';
      enviarSolicitud(metodo, parametros);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    const clienteIdParam = clienteId || '';
    try {
      const response = await axios[metodo.toLowerCase()](
        clienteIdParam ? `${apiUrl}/${clienteIdParam}` : apiUrl,
        parametros
      );
      console.log('Response:', response); 
      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);
      if (tipo === 'success') {
        document.getElementById('btnCerrar').click();
        getClientes();
      }
    } catch (error) {
      show_alerta('Error de solicitud', 'error');
      console.error(error);
    }
  };

  const deleteCliente = (clienteId, nombre) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro quieres eliminar al cliente ${nombre}?`,
      icon: 'question',
      text: 'No se podrá dar marcha atrás',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/${clienteId}`);
          show_alerta('Cliente eliminado exitosamente', 'success');
          getClientes();
        } catch (error) {
          show_alerta('Error al eliminar al cliente', 'error');
          console.error(error);
        }
      } else {
        show_alerta('El cliente no fue eliminado', 'info');
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
              data-bs-target='#modalClientes'
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
                  <th className='table-header' style={{  background: '#440000', color: 'white' }}>
                    #
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Nombre
                  </th>
                  <th className='table-header' style={{  background: '#440000', color: 'white' }}>
                    Apellido
                  </th>
                  <th className='table-header' style={{  background: '#440000', color: 'white' }}>
                    Edad
                  </th>
                  <th className='table-header' style={{  background: '#440000', color: 'white' }}>
                    Tipo de Documento
                  </th>
                  <th className='table-header' style={{  background: '#440000', color: 'white' }}>
                    Número de Documento
                  </th>
                  <th className='table-header' style={{  background: '#440000', color: 'white' }}>
                    Correo
                  </th>
                  <th className='table-header' style={{  background: '#440000', color: 'white' }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {clientes.map((cliente, i) => (
                  <tr key={cliente.clienteId}>
                    <td style={{ background: '#dadada' }}>{i + 1}</td>
                    <td style={{ background: '#dadada' }}>{cliente.nombre}</td>
                    <td style={{ background: '#dadada' }}>{cliente.apellido}</td>
                    <td style={{ background: '#dadada' }}>{cliente.edad}</td>
                    <td style={{ background: '#dadada' }}>{cliente.tipoDocumento}</td>
                    <td style={{ background: '#dadada' }}>{cliente.numDocumento}</td>
                    <td style={{ background: '#dadada' }}>{cliente.correo}</td>
                    <td style={{ background: '#dadada' }}>
                      <button
                        onClick={() =>
                          openModal(
                            2,
                            cliente.clienteId,
                            cliente.nombre,
                            cliente.apellido,
                            cliente.edad,
                            cliente.tipoDocumento,
                            cliente.numDocumento,
                            cliente.correo
                          )
                        }
                        className='btn btn-warning'
                        data-bs-toggle='modal'
                        data-bs-target='#modalClientes'
                        style={{ background: '#440000', color: 'white' }}
                      >
                        <i className='fa-solid fa-edit'></i>
                      </button>
                      &nbsp;
                      <button
                        onClick={() => deleteCliente(cliente.clienteId, cliente.nombre)}
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
      <div id='modalClientes' className='modal fade' aria-hidden='true'>
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
                  id='tipoDocumento'
                  className='form-control'
                  placeholder='Tipo de Documento'
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
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
                  placeholder='Número de Documento'
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
                  id='correo'
                  className='form-control'
                  placeholder='Correo'
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar(clienteId)} className='btn btn-success'>
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
