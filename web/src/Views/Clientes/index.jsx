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
  const [pageSize, setPageSize] = useState(7);
  const [totalPages, setTotalPages] = useState(1);
  const [cacheKey, setCacheKey] = useState('');
  const [estado, setEstado] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [generalErrorMessage, setGeneralErrorMessage] = useState('');
 
  const [cliente, setCliente] = useState({
    clienteId: '',
    nombre: '',
    apellido: '',
    edad: '',
    tipoDocumento: ' CC',
    numDocumento: '',
    correo: '',
    estado: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;
  
    if (name === "nombre" || name === "apellido") {
      newValue = value.replace(/[^a-zA-Z\s]/g, "");
    } else if (name === "edad" || name === "numDocumento") {
      newValue = value.replace(/\D/g, "");
    }
  
    // Actualizar el estado del cliente con el nuevo valor
    setCliente({
      ...cliente,
      [name]: newValue
    });
  };
  

  useEffect(() => {
    getClientes();
  }, [pageNumber, pageSize,cacheKey]);

  const getClientes = async () => {
    try {
      const response = await axios.get(`${apiUrl}?cacheKey=${cacheKey}&forceRefresh=${Date.now()}`);
      const filteredClientes = response.data.filter(cliente => !cliente.eliminado && !localStorage.getItem(`eliminado_${cliente.clienteId}`));
      setClientes(filteredClientes);
      setTotalPages(Math.ceil(filteredClientes.length / pageSize));
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };

  const openModal = (op, id, nombre, apellido, edad, tipoDocumento, numDocumento, correo,estado) => {
    setOperation(op);
    setClienteId(id);
  
    if (op === 1) {
      setTitle('Registrar cliente');
      setCliente({
        ...cliente,
        nombre: '',
        apellido: '',
        edad: '',
        tipoDocumento: '',
        numDocumento: '',
        correo: ''
      });
    } else if (op === 2) {
      setTitle('Editar cliente');
      setCliente({
        ...cliente,
        nombre,
        apellido,
        edad,
        tipoDocumento,
        numDocumento,
        correo
      });
    }
  
    document.getElementById('modalClientes').addEventListener('shown.bs.modal', function () {
      document.getElementById('nombre').focus();
    });
  };
  

  const validar = () => {
    const errors = {};
    let isValid = true;
  
    if (cliente.nombre.trim() === '') {
      isValid = false;
      errors.nombre = 'Por favor, ingresa tu nombre.';
    }
  
    if (cliente.apellido.trim() === '') {
      isValid = false;
      errors.apellido = 'Por favor, ingresa tu apellido.';
    }
  
    if (cliente.edad.toString().trim() === '') {
      isValid = false;
      errors.edad = 'Por favor, ingresa tu edad.';
    }
  
    if (cliente.tipoDocumento.trim() === '') {
      isValid = false;
      errors.tipoDocumento = 'Por favor, selecciona un tipo de documento.';
    }
  
    if (cliente.numDocumento.toString().trim() === '') {
      isValid = false;
      errors.numDocumento = 'Por favor, ingresa tu número de documento.';
    }
  
    if (cliente.correo.trim() === '') {
      isValid = false;
      errors.correo = 'Por favor, ingresa tu correo electrónico.';
    } else if (!isValidEmail(cliente.correo)) {
      isValid = false;
      errors.correo = 'Formato de correo electrónico inválido.';
    }
  
    // Actualiza el estado de errorMessage con los errores encontrados
    setErrorMessage(errors);
  
    // Actualiza el estado del mensaje de error general si todos los campos están vacíos
    if (!isValid && Object.keys(errors).length === 0) {
      setGeneralErrorMessage('Completa todos los campos correctamente');
    } else {
      setGeneralErrorMessage('');
    }
  
    if (isValid) {
      const parametros = {
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        edad: cliente.edad,
        tipoDocumento: cliente.tipoDocumento,
        numDocumento: cliente.numDocumento,
        correo: cliente.correo,
        estado: 'Activo'
      };
      console.log('Parámetros de solicitud:', parametros);
      const metodo = operation === 1 ? 'POST' : 'PUT';
      enviarSolicitud(metodo, parametros);
    }
  };
  
  
  const isValidEmail = (email) => {
    // Expresión regular para validar el formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  
  const handleSearch = e => {
    const text = e.target.value;
    setSearchText(text);
    if (text.trim() === '') {
      setPageNumber(1);
      getClientes();
    } else {
      const filteredClientes = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(text.toLowerCase()) ||
        cliente.numDocumento.toString().toLowerCase().includes(text.toLowerCase())
      );
      setClientes(filteredClientes);
    }
  };
  
  const enviarSolicitud = async (metodo, parametros) => {
    const clienteIdParam = clienteId || '';
    try {
      const response = await axios[metodo.toLowerCase()](
        clienteIdParam ? `${apiUrl}/${clienteIdParam}` : apiUrl,
        parametros,
        { timeout: 15000 }
      );

      console.log('Respuesta del servidor:', response.data);
      const [tipo, msj] = response.data;

      show_alerta(`Cliente ${nombre} se a editado exitosamente`, 'success');

      getClientes();
      setCacheKey(Date.now().toString());
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

  const desactivarCliente = async (clienteId, nombre, apellido, edad, tipoDocumento, numDocumento, correo) => {
    try {
      const parametros = { nombre, apellido, edad, tipoDocumento, numDocumento, correo, estado: 'Desactivado' };
      await axios.put(`${apiUrl}/${clienteId}`, parametros);
      show_alerta(`Cliente ${nombre} eliminada exitosamente`, 'success');
      getClientes();
      setCacheKey(Date.now().toString());
    } catch (error) {
      show_alerta('Error al desactivar al cliente', 'error');
      console.error(error);
    }
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
                  padding:'7px',
                  marginTop:'10px'
                }}
              />
            </div>
            <DivAdd>
              <h1 style={{ background: '#440000', borderColor: '#440000', color: 'white', width: '100%', marginLeft: '100px' }}></h1>
            </DivAdd>
          </div>
        </div>
      </div>
      <div className='row mt-3' >
        <div className='col-12 col-lg-8 offset-0 offset-lg-2 mx-auto text-center' style={{ width: '100%',padding:'7px',marginTop:'20px' }}>
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
                .filter(cliente => cliente.estado !== 'Desactivado')
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
                        onClick={() => desactivarCliente(cliente.clienteId, cliente.nombre, cliente.apellido, cliente.edad, cliente.tipoDocumento, cliente.numDocumento, cliente.correo)}
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
                  value={cliente.nombre}
                  onChange={handleInputChange}
                  name='nombre'
                  required  
                />
                <div style={{ position: 'absolute', bottom: '-31px'}}>
                {errorMessage.nombre && <p className="error-message red-color">{errorMessage.nombre}</p>}
                </div>
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
                  value={cliente.apellido}
                  onChange={handleInputChange}
                  name='apellido'
                  required  
                />
                <div style={{ position: 'absolute', bottom: '-31px'}}>
                {errorMessage.apellido && <p className="error-message red-color">{errorMessage.apellido}</p>}
                </div>
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
                  value={cliente.edad}
                  onChange={handleInputChange}
                  name='edad'
                  required  
                />
                <div style={{ position: 'absolute', bottom: '-31px'}}>
                {errorMessage.edad && <p className="error-message red-color">{errorMessage.edad}</p>}
                </div>
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
                  value={cliente.tipoDocumento}
                  onChange={handleInputChange}
                  name='tipoDocumento'
                  disabled 
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
                  value={cliente.numDocumento}
                  onChange={handleInputChange}
                  name='numDocumento'
                  required  
                />
                <div style={{ position: 'absolute', bottom: '-31px'}}>
                {errorMessage.numDocumento && <p className="error-message red-color">{errorMessage.numDocumento}</p>}
                </div>
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
                  value={cliente.correo}
                  onChange={handleInputChange}
                  name='correo'
                  required  
                />
                <div style={{ position: 'absolute', bottom: '-31px'}}>
                {errorMessage.correo && <p className="error-message red-color">{errorMessage.correo}</p>}
                </div>
              </div>
            </div>
            <div className='modal-footer'>
            {generalErrorMessage && <p className="error-message red-color">{generalErrorMessage}</p>}
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
      {showSuccessMessage && (
        <Swal
          title="¡Éxito!"
          text="El cliente se editó correctamente."
          icon="success"
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
    </div>
  );
};

export default ManageClientes;