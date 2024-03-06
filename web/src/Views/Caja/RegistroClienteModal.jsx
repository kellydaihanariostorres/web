import React, { useEffect, useState } from 'react';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { show_alerta } from '../../functions';
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
    getClientes(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

  const getClientes = async (pageNumber, pageSize) => {
    try {
      const response = await axios.get(`${apiUrl}?page=${pageNumber}&size=${pageSize}`);
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
      // Validar que los campos requeridos estén completos
      if (
        nombre.trim() === '' ||
        apellido.trim() === '' ||
        edad.trim() === '' ||
        tipoDocumento.trim() === '' ||
        numDocumento.trim() === '' ||
        correo.trim() === ''
      ) {
        // Mostrar mensaje de error si algún campo requerido está vacío
        show_alerta('Completa todos los campos', 'warning');
        return; // Salir de la función si hay campos vacíos
      }

      // Continuar con el envío de la solicitud si todos los campos requeridos están completos
      const response = await axios[metodo.toLowerCase()](
        clienteIdParam ? `${apiUrl}/${clienteIdParam}` : apiUrl,
        parametros
      );
      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);
      getClientes();
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
        } catch (error) {
          show_alerta('Error al eliminar al cliente', 'error');
          console.error(error);
        } finally {
          getClientes();
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

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <div className='col-md-4 offset-md-4'>
          
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
              <button type='button' className='btn btn-success' onClick={validar}>
                Guardar
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageClientes;
