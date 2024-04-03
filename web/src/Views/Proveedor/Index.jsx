import React, { useEffect, useState } from 'react';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { show_alerta } from '../../functions';
import axios from 'axios';

const ManageProveedores = () => {
  const apiUrl = 'https://localhost:7284/api/proveedor';
  const [proveedores, setProveedores] = useState([]);
  const [nombreProveedor, setNombreProveedor] = useState('');
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
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [cacheKey, setCacheKey] = useState('');
  const [errors, setErrors] = useState({});
  const [idProveedor, setIdProveedor] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'nombreProveedor') {
      setNombreProveedor(value);
    } else if (name === 'numDocumento') {
      setNumDocumento(value.replace(/\D/g, ''));
    } else if (name === 'edad') {
      setEdad(value.replace(/\D/g, ''));
    } else if (name === 'direccion') {
      setDireccion(value);
    } else if (name === 'telefono') {
      setTelefono(value.replace(/\D/g, ''));
    } else if (name === 'correo') {
      setCorreo(value);
    } else if (name === 'nombreEntidadBancaria') {
      setNombreEntidadBancaria(value);
    } else if (name === 'numeroCuentaBancaria') {
      setNumeroCuentaBancaria(value.replace(/\D/g, ''));
    }
  };

  useEffect(() => {
    getProveedores();
  }, [pageNumber, pageSize, cacheKey]);

  const getProveedores = async () => {
    try {
      const response = await axios.get(`${apiUrl}?cacheKey=${cacheKey}&forceRefresh=${Date.now()}`);
      const filteredProveedores = response.data.filter(
        (proveedor) => proveedor.estado !== 'Desactivado' && !localStorage.getItem(`eliminado_${proveedor.idProveedor}`)
      );
      setProveedores(filteredProveedores);
      setTotalPages(Math.ceil(filteredProveedores.length / pageSize));
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

  const openModal = (op, idProveedor, nombre, numDoc, edad, direccion, telefono, correo, nombreEntidad, numCuenta) => {
    setOperation(op);

    if (op === 1) {
      setTitle('Registrar proveedor');
      setNombreProveedor('');
      setNumDocumento('');
      setEdad('');
      setDireccion('');
      setTelefono('');
      setCorreo('');
      setNombreEntidadBancaria('');
      setNumeroCuentaBancaria('');
    } else if (op === 2) {
      setTitle('Editar proveedor');
      setNombreProveedor(nombre);
      setNumDocumento(numDoc);
      setEdad(edad);
      setDireccion(direccion);
      setTelefono(telefono);
      setCorreo(correo);
      setNombreEntidadBancaria(nombreEntidad);
      setNumeroCuentaBancaria(numCuenta);
      setIdProveedor(idProveedor);
    }
  };

  const validar = () => {
    const errorsCopy = {};
    let isValid = true;

    if (!nombreProveedor) {
      errorsCopy.nombreProveedor = 'El campo Nombre es obligatorio';
      isValid = false;
    }
    if (!numDocumento) {
      errorsCopy.numDocumento = 'El campo Número de Documento es obligatorio';
      isValid = false;
    }
    if (!edad) {
      errorsCopy.edad = 'El campo edad es obligatorio';
      isValid = false;
    }
    if (!direccion) {
      errorsCopy.direccion = 'El campo direccion es obligatorio';
      isValid = false;
    }
    if (!telefono) {
      errorsCopy.telefono = 'El campo telefono es obligatorio';
      isValid = false;
    }
    if (!correo) {
      errorsCopy.correo = 'El campo correo es obligatorio';
      isValid = false;
    }
    if (!nombreEntidadBancaria) {
      errorsCopy.nombreEntidadBancaria = 'El campo entidad bancario es obligatorio';
      isValid = false;
    }
    if (!numeroCuentaBancaria) {
      errorsCopy.numeroCuentaBancaria = 'El campo numero bancario es obligatorio';
      isValid = false;
    }

    if (!isValid) {
      setErrors(errorsCopy);
      return;
    }

    const parametros = {
      nombre: nombreProveedor,
      numDocumento,
      edad,
      direccion,
      telefono,
      correo,
      nombreEntidadBancaria,
      numeroCuentaBancaria,
      estado: 'Activo',
    };

    const metodo = operation === 1 ? 'POST' : 'PUT';
    enviarSolicitud(metodo, parametros);
  };

  const enviarSolicitud = async (metodo, parametros) => {
    const idProveedorParam = idProveedor || '';
    try {
      const idProveedor = parametros.idProveedor; // Corrected line
      const proveedorActual = proveedores.find((proveedor) => proveedor.idProveedor === idProveedorParam);
      if (proveedorActual && metodo === 'PUT') {
        parametros = { ...parametros, estado: proveedorActual.estado };
      }
  
      const response = await axios[metodo.toLowerCase()](
        idProveedorParam ? `${apiUrl}/${idProveedorParam}` : apiUrl,
        parametros
      );
      setErrors({});
      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);
  
      show_alerta(`Proveedor ${nombreProveedor} se ha ${msj} exitosamente`, 'success');
  
      getProveedores();
      setCacheKey(Date.now().toString());
      setNombreProveedor('');
      setNumDocumento('');
      setEdad('');
      setDireccion('');
      setTelefono('');
      setCorreo('');
      setNombreEntidadBancaria('');
      setNumeroCuentaBancaria('');
      setIdProveedor('');
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
      getProveedores();
    } else {
      const filteredProveedores = proveedores.filter((proveedor) =>
        proveedor.nombre.toLowerCase().includes(text.toLowerCase())
      );
      setProveedores(filteredProveedores);
    }
  };

  const desactivarProveedor = async (idProveedor, nombreProveedor) => {
    try {
      const response = await axios.get(`${apiUrl}/${idProveedor}`);
      const proveedor = response.data;

      const parametros = {
        ...proveedor,
        estado: 'Desactivado',
      };

      await axios.put(`${apiUrl}/${idProveedor}`, parametros);
      show_alerta(`Proveedor ${nombreProveedor} desactivado exitosamente`, 'success');
      getProveedores();
      setCacheKey(Date.now().toString());
    } catch (error) {
      show_alerta('Error al desactivar al proveedor', 'error');
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
                type='button'
                onClick={() => openModal(1)}
                data-bs-toggle='modal'
                data-bs-target='#modalProveedores'
                className='btn btn-dark'
                style={{ background: '#440000', borderColor: '#440000', color: 'white', width: '100%', marginLeft: '100px' }}
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
                    Número de Cuenta Bancaria
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
                          onClick={() => desactivarProveedor(proveedor.idProveedor, proveedor.nombre)}
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
                Página {pageNumber} de {totalPages}
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
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-user'></i>
                </span>
                <input
                  type='text'
                  id='nombreProveedor'
                  name='nombreProveedor'
                  className='form-control'
                  placeholder='Nombre'
                  value={nombreProveedor}
                  onChange={handleInputChange}
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.nombreProveedor && <p className='error-message red-color'>{errors.nombreProveedor}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-id-card'></i>
                </span>
                <input
                  type='text'
                  id='numDocumento'
                  name='numDocumento'
                  className='form-control'
                  placeholder='Número de Documento'
                  value={numDocumento}
                  onChange={handleInputChange}
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.numDocumento && <p className='error-message red-color'>{errors.numDocumento}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-user'></i>
                </span>
                <input
                  type='text'
                  id='edad'
                  name='edad'
                  className='form-control'
                  placeholder='Edad'
                  value={edad}
                  onChange={handleInputChange}
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.edad && <p className='error-message red-color'>{errors.edad}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-home'></i>
                </span>
                <input
                  type='text'
                  id='direccion'
                  name='direccion'
                  className='form-control'
                  placeholder='Dirección'
                  value={direccion}
                  onChange={handleInputChange}
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.direccion && <p className='error-message red-color'>{errors.direccion}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-phone'></i>
                </span>
                <input
                  type='text'
                  id='telefono'
                  name='telefono'
                  className='form-control'
                  placeholder='Teléfono'
                  value={telefono}
                  onChange={handleInputChange}
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.telefono && <p className='error-message red-color'>{errors.telefono}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-envelope'></i>
                </span>
                <input
                  type='text'
                  id='correo'
                  name='correo'
                  className='form-control'
                  placeholder='Correo'
                  value={correo}
                  onChange={handleInputChange}
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.correo && <p className='error-message red-color'>{errors.correo}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-building'></i>
                </span>
                <input
                  type='text'
                  id='nombreEntidadBancaria'
                  name='nombreEntidadBancaria'
                  className='form-control'
                  placeholder='Nombre Entidad Bancaria'
                  value={nombreEntidadBancaria}
                  onChange={handleInputChange}
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.nombreEntidadBancaria && <p className='error-message red-color'>{errors.nombreEntidadBancaria}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-credit-card'></i>
                </span>
                <input
                  type='text'
                  id='numeroCuentaBancaria'
                  name='numeroCuentaBancaria'
                  className='form-control'
                  placeholder='Número de Cuenta Bancaria'
                  value={numeroCuentaBancaria}
                  onChange={handleInputChange}
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.numeroCuentaBancaria && <p className='error-message red-color'>{errors.numeroCuentaBancaria}</p>}
                </div>
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={validar} className='btn btn-success'>
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

export default ManageProveedores;