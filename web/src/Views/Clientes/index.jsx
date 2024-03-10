import React, { useEffect, useState } from 'react';
import { show_alerta } from '../../functions';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManageClientes = () => {
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
  const [searchText, setSearchText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getClientes();
  }, [pageNumber, pageSize]);

  const getClientes = async () => {
    try {
      const response = await axios.get(apiUrl);
      setClientes(response.data);
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

    document.getElementById('modalClientes').addEventListener('shown.bs.modal', function () {
      document.getElementById('nombre').focus();
    });
  };

  const validar = () => {
    if (
      nombre.trim() === '' ||
      apellido.trim() === '' ||
      String(edad).trim() === '' ||
      tipoDocumento.trim() === '' ||
      String(numDocumento).trim() === '' || // Convertir a string antes de llamar a trim()
      correo.trim() === ''
    ) {
      show_alerta('Completa todos los campos', 'warning');
    } else {
      const parametros = { nombre, apellido, edad, tipoDocumento, numDocumento, correo };
      const metodo = operation === 1 ? 'POST' : 'PUT';
      enviarSolicitud(metodo, parametros);
    }
  };

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    if (text.trim() === '') {
      setPageNumber(1);
      getClientes();
    } else {
      const filteredClientes = clientes.filter((cliente) =>
        cliente.nombre.toLowerCase().includes(text.toLowerCase())
      );
      setClientes(filteredClientes);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    const clienteIdParam = clienteId || '';
    try {
      const response = await axios[metodo.toLowerCase()](
        clienteIdParam ? `${apiUrl}/${clienteIdParam}` : apiUrl,
        parametros
      );
      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);

      if (tipo === 'success') {
        // Si la operación fue exitosa, solo actualizamos la lista después de eliminar un cliente
        if (metodo === 'DELETE') {
          getClientes(pageNumber, pageSize); // Aquí pasamos los parámetros pageNumber y pageSize
        }
      }

      // Reiniciamos los campos del formulario después de agregar o editar el cliente
      setClienteId('');
      setNombre('');
      setApellido('');
      setEdad('');
      setTipoDocumento('');
      setNumDocumento('');
      setCorreo('');
    } catch (error) {
      show_alerta('Error de solicitud', 'error');
      console.error(error);
    }
  };

  const deleteCliente = async (clienteId, nombre) => {
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
          // Actualizamos la lista de clientes después de eliminar
          getClientes(pageNumber, pageSize); // Aquí pasamos los parámetros pageNumber y pageSize
        } catch (error) {
          show_alerta('Error al eliminar al cliente', 'error');
          console.error(error);
        } finally {
          // Restablecemos los campos del formulario después de eliminar el cliente
          setClienteId('');
          setNombre('');
          setApellido('');
          setEdad('');
          setTipoDocumento('');
          setNumDocumento('');
          setCorreo('');
        }
      } else {
        show_alerta('El cliente no fue eliminado', 'info');
      }
    });
  };

  const showPreviousButton = pageNumber > 1;
  const showNextButton = pageNumber < totalPages;

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <div className='col-md-4 offset-md-4'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className='input-group mb-3'>
              <input
                type='text'
                className='form-control'
                placeholder='Buscar cliente'
                aria-label='Buscar cliente'
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
                type="button" className="btn btn-danger"
                onClick={() => openModal(1)}
                data-bs-toggle='modal'
                data-bs-target='#modalClientes'
                style={{ background: '#440000', borderColor: '#440000', color: 'white', width: '100%',marginLeft: '100px' }}
              >
                <i className='fa-solid fa-circle-plus'></i> Añadir
              </button>
            </DivAdd>
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
                    Edad
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Tipo de Documento
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Número de Documento
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Correo
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {clientes
                .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
                .map((cliente, i) => (
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
            <div className='d-flex justify-content-between'>
              {showPreviousButton && (
                <button onClick={handlePreviousPage} style={{ background: '#440000', borderColor: '#440000', color: 'white' }}>
                  Anterior
                </button>
              )}
              <span>
                Página {pageNumber} de {pageSize}
              </span>
              {showNextButton && (
                <button onClick={handleNextPage} style={{ background: '#440000', borderColor: '#440000', color: 'white' }}>
                  Siguiente
                </button>
              )}
            </div>
          </DivTable>
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
                  required  // Agregar el atributo 'required' para hacer que este campo sea obligatorio
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
                  required  // Agregar el atributo 'required' para hacer que este campo sea obligatorio
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
                  required  // Agregar el atributo 'required' para hacer que este campo sea obligatorio
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
                  required  // Agregar el atributo 'required' para hacer que este campo sea obligatorio
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
                  required  // Agregar el atributo 'required' para hacer que este campo sea obligatorio
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='email'
                  id='correo'
                  className='form-control'
                  placeholder='Correo'
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required  // Agregar el atributo 'required' para hacer que este campo sea obligatorio
                />
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-danger' data-bs-dismiss='modal'>
                Cerrar
              </button>
              <button type='button' className='btn btn-success' onClick={validar}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageClientes;