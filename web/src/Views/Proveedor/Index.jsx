import React, { useEffect, useState } from 'react';
import CustomInput from '../../Components/DivInput';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { show_alerta } from '../../functions';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManageProveedores = () => {
  const apiUrl = 'https://localhost:7284/api/proveedor';
  const [proveedores, setProveedores] = useState([]);
  const [idProveedor, setIdProveedor] = useState('');
  const [nombre, setNombre] = useState('');
  const [numDocumento, setNumDocumento] = useState('');
  const [edad, setEdad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [nombreEntidadBancaria, setNombreEntidadBancaria] = useState('');
  const [numeroCuentaBancaria, setNumeroCuentaBancaria] = useState('');
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1); 

  useEffect(() => {
    getProveedores();
  }, []);

  const getProveedores = async () => {
    try {
      const response = await axios.get(apiUrl);
      setProveedores(response.data);
      setTotalPages(Math.ceil(response.data.length / pageSize));
    } catch (error) {
      console.error(error);
    }
  };

  // Funciones para manejar la paginación
  const handleNextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  // Función para abrir el modal de agregar/editar proveedor
  const openModal = (op, idProveedor, nombre, numDocumento, edad, direccion, telefono, correo, nombreEntidadBancaria, numeroCuentaBancaria) => {
    setOperation(op);
    setIdProveedor(idProveedor);

    if (op === 1) {
      setTitle('Registrar proveedor');
      setNombre('');
      setNumDocumento('');
      setEdad('');
      setDireccion('');
      setTelefono('');
      setCorreo('');
      setNombreEntidadBancaria('');
      setNumeroCuentaBancaria('');
    } else if (op === 2) {
      setTitle('Editar proveedor');
      setNombre(nombre);
      setNumDocumento(numDocumento);
      setEdad(edad);
      setDireccion(direccion);
      setTelefono(telefono);
      setCorreo(correo);
      setNombreEntidadBancaria(nombreEntidadBancaria);
      setNumeroCuentaBancaria(numeroCuentaBancaria);
    }

    document.getElementById('modalProveedores').addEventListener('shown.bs.modal', function () {
      document.getElementById('nombre').focus();
    });
  };

  // Función para validar y enviar la solicitud de agregar/editar proveedor
  const validar = () => {
    if (
      nombre.trim() === '' ||
      numDocumento.trim() === '' ||
      edad.trim() === '' ||
      direccion.trim() === '' ||
      telefono.trim() === '' ||
      correo.trim() === '' ||
      nombreEntidadBancaria.trim() === '' ||
      numeroCuentaBancaria.trim() === ''
    ) {
      show_alerta('Completa todos los campos', 'warning');
    } else {
      const parametros = { nombre, numDocumento, edad, direccion, telefono, correo, nombreEntidadBancaria, numeroCuentaBancaria };
      const metodo = operation === 1 ? 'POST' : 'PUT';
      enviarSolicitud(metodo, parametros);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    const idProveedorParam = idProveedor || '';
    try {
      const response = await axios[metodo.toLowerCase()](
        idProveedorParam ? `${apiUrl}/${idProveedorParam}` : apiUrl,
        parametros
      );
      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);
      // Si la operación fue exitosa o no, actualizar el estado de 'proveedores'
      getProveedores();
      // Restablecer estados para preparar el formulario para una nueva entrada
      setIdProveedor('');
      setNombre('');
      setNumDocumento('');
      setEdad('');
      setDireccion('');
      setTelefono('');
      setCorreo('');
      setNombreEntidadBancaria('');
      setNumeroCuentaBancaria('');
    } catch (error) {
      show_alerta('Error de solicitud', 'error');
      console.error(error);
    }
  };

  // Función para buscar proveedores
  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    if (text.trim() === '') {
      setPageNumber(1);
      getProveedores();
    } else {
      const filteredProveedores = proveedores.filter((proveedor) =>
        proveedor.nombre.toLowerCase().includes(text.toLowerCase())
      );
      setProveedores(filteredProveedores);
    }
  };

  // Función para eliminar proveedor
  const deleteProveedor = (idProveedor, nombre) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro quieres eliminar al proveedor ${nombre}?`,
      icon: 'question',
      text: 'No se podrá dar marcha atrás',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/${idProveedor}`);
          show_alerta('Proveedor eliminado exitosamente', 'success');
          // Después de eliminar, actualizar el estado de 'proveedores'
          getProveedores();
          // Restablecer estados para preparar el formulario para una nueva entrada
          setIdProveedor('');
          setNombre('');
          setNumDocumento('');
          setEdad('');
          setDireccion('');
          setTelefono('');
          setCorreo('');
          setNombreEntidadBancaria('');
          setNumeroCuentaBancaria('');
        } catch (error) {
          show_alerta('Error al eliminar al proveedor', 'error');
          console.error(error);
        }
      } else {
        show_alerta('El proveedor no fue eliminado', 'info');
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
                placeholder='Buscar proveedor'
                aria-label='Buscar proveedor'
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
                data-bs-target='#modalProveedores'
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
                    Número de Documento
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Edad
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Dirección
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Teléfono
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Correo
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Entidad Bancaria
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Número de Cuenta
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {proveedores
                .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
                .map((proveedor, i) => (
                  <tr key={proveedor.idProveedor}>
                    <td style={{ background: '#dadada' }}>{i + 1}</td>
                    <td style={{ background: '#dadada' }}>{proveedor.nombre}</td>
                    <td style={{ background: '#dadada' }}>{proveedor.numDocumento}</td>
                    <td style={{ background: '#dadada' }}>{proveedor.edad}</td>
                    <td style={{ background: '#dadada' }}>{proveedor.direccion}</td>
                    <td style={{ background: '#dadada' }}>{proveedor.telefono}</td>
                    <td style={{ background: '#dadada' }}>{proveedor.correo}</td>
                    <td style={{ background: '#dadada' }}>{proveedor.nombreEntidadBancaria}</td>
                    <td style={{ background: '#dadada' }}>{proveedor.numeroCuentaBancaria}</td>
                    <td style={{ background: '#dadada' }}>
                      <button
                        onClick={() =>
                          openModal(
                            2,
                            proveedor.idProveedor,
                            proveedor.nombre,
                            proveedor.numDocumento,
                            proveedor.edad,
                            proveedor.direccion,
                            proveedor.telefono,
                            proveedor.correo,
                            proveedor.nombreEntidadBancaria,
                            proveedor.numeroCuentaBancaria
                          )
                        }
                        className='btn btn-warning'
                        data-bs-toggle='modal'
                        data-bs-target='#modalProveedores'
                        style={{ background: '#440000', color: 'white' }}
                      >
                        <i className='fa-solid fa-edit'></i>
                      </button>
                      &nbsp;
                      <button
                        onClick={() => deleteProveedor(proveedor.idProveedor, proveedor.nombre)}
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
      <div id='modalProveedores' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='idProveedor' />
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
                  required
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='number'
                  id='numDocumento'
                  className='form-control'
                  placeholder='Número de Documento'
                  value={numDocumento}
                  onChange={(e) => setNumDocumento(e.target.value)}
                  required
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='number'
                  id='edad'
                  className='form-control'
                  placeholder='Edad'
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  required
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='direccion'
                  className='form-control'
                  placeholder='Dirección'
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
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
                  placeholder='Teléfono'
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
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
                  required
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
                  required
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='number'
                  id='numeroCuentaBancaria'
                  className='form-control'
                  placeholder='Número de Cuenta Bancaria'
                  value={numeroCuentaBancaria}
                  onChange={(e) => setNumeroCuentaBancaria(e.target.value)}
                  required
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

export default ManageProveedores;
