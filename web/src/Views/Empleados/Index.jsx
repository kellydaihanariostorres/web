import React, { useEffect, useState } from 'react';
import CustomInput from '../../Components/DivInput';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { show_alerta } from '../../functions';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ManageEmpleados = () => {
  const apiUrl = 'https://localhost:7284/api/empleados';
  const apiUrlBodegas = 'https://localhost:7284/api/bodegas';
  const [empleados, setEmpleados] = useState([]);
  const [empleadoId, setEmpleadoId] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [documento, setDocumento] = useState('');
  const [cargo, setCargo] = useState('');
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [sueldo, setSueldo] = useState('');
  const [bodegaId, setBodegaId] = useState('');
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [bodegas, setBodegas] = useState([]);
  const [errors, setErrors] = useState({});
  const [cacheKey, setCacheKey] = useState('');
  

  const currentYear = new Date().getFullYear();
  const minDate = new Date(currentYear, 0, 1); // Primer día del año actual
  const maxDate = new Date(); // Fecha actual
  

  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;
  
    if (name === 'nombre' || name === 'apellido') {
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'documento' || name === 'sueldo') {
      newValue = value.replace(/\D/g, '');
    }
  
    // Actualizar el estado del empleado actual con el nuevo valor
    setNombre((prevNombre) => (name === 'nombre' ? newValue : prevNombre));
    setApellido((prevApellido) => (name === 'apellido' ? newValue : prevApellido));
    setDocumento((prevDocumento) => (name === 'documento' ? newValue : prevDocumento));
    setCargo((prevCargo) => (name === 'cargo' ? value : prevCargo)); // Modificación aquí
    setSueldo((prevSueldo) => (name === 'sueldo' ? newValue : prevSueldo));
  };
  

  useEffect(() => {
    getEmpleados();
    getBodegas();
  }, [pageNumber, pageSize,cacheKey]);

  

  const getEmpleados = async () => {
    try {
      const response = await axios.get(`${apiUrl}?cacheKey=${cacheKey}&forceRefresh=${Date.now()}`);
      const filteredClientes = response.data.filter(
        (empleado) => !empleado.eliminado && !localStorage.getItem(`eliminado_${empleado.empleadoId}`)
      );
      setEmpleados(filteredClientes);
      setTotalPages(Math.ceil(filteredClientes.length / pageSize));
    } catch (error) {
      console.error(error);
    }
  };

  const getBodegas = async () => {
    try {
      const response = await axios.get(apiUrlBodegas);
      const activeBodegas = response.data.filter((bodega) => bodega.estado === 'Activo');
      setBodegas(activeBodegas);
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

  const openModal = (op, id, nombre, apellido, documento, cargo, fechaInicio, fechaFin, sueldo, bodegaId) => {
    setOperation(op);
    setEmpleadoId(id);

    if (op === 1) {
      setTitle('Registrar empleado');
      setNombre('');
      setApellido('');
      setDocumento('');
      setCargo('');
      setFechaInicio(new Date());
      setFechaFin(new Date());
      setSueldo('');
      setBodegaId('');
    } else if (op === 2) {
      setTitle('Editar empleado');
      setNombre(nombre);
      setApellido(apellido);
      setDocumento(documento);
      setCargo(cargo);
      setFechaInicio(new Date(fechaInicio));
      setFechaFin(new Date(fechaFin));
      setSueldo(sueldo);
      setBodegaId(bodegaId);
    }

    document.getElementById('modalEmpleados').addEventListener('shown.bs.modal', function () {
      document.getElementById('nombre').focus();
    });
  };

  const validar = () => {
    const errorsCopy = {};
    let isValid = true;

    if (!nombre.trim()) {
      errorsCopy.nombre = 'El campo Nombre es obligatorio';
      isValid = false;
    }
    if (!apellido.trim()) {
      errorsCopy.apellido = 'El campo Apellido es obligatorio';
      isValid = false;
    }
    if (!documento.trim()) {
      errorsCopy.documento = 'El campo Documento es obligatorio';
      isValid = false;
    }
    if (!cargo.trim()) {
      errorsCopy.cargo = 'El campo Cargo es obligatorio';
      isValid = false;
    }
    if (!fechaInicio) {
      errorsCopy.fechaInicio = 'El campo Fecha de Inicio es obligatorio';
      isValid = false;
    }
    if (!fechaFin) {
      errorsCopy.fechaFin = 'El campo Fecha de Fin es obligatorio';
      isValid = false;
    }
    if (!sueldo.trim()) {
      errorsCopy.sueldo = 'El campo Sueldo es obligatorio';
      isValid = false;
    }
    if (!bodegaId) {
      errorsCopy.bodegaId = 'Debe seleccionar una Bodega';
      isValid = false;
    }

    if (documento.trim() && !/^\d+$/.test(documento)) {
      errorsCopy.documento = 'El Documento debe ser un número';
      isValid = false;
    }
    if (sueldo.trim() && !/^\d+$/.test(sueldo)) {
      errorsCopy.sueldo = 'El Sueldo debe ser un número';
      isValid = false;
    }

    if (fechaInicio && fechaFin && fechaInicio >= fechaFin) {
      errorsCopy.fechaInicio = 'La Fecha de Inicio debe ser anterior a la Fecha de Fin';
      isValid = false;
    }

    if (!isValid) {
      setErrors(errorsCopy);
      return;
    }

    const formattedFechaInicio = fechaInicio.toISOString().split('T')[0];
    const formattedFechaFin = fechaFin.toISOString().split('T')[0];

    const parametros = {
      nombre,
      apellido,
      documento,
      cargo,
      fechaInicio: formattedFechaInicio,
      fechaFin: formattedFechaFin,
      sueldo,
      bodegaId,
      estado: 'Activo',
    };

    const bodegaSeleccionada = bodegas.find((bodega) => bodega.bodegaId === bodegaId);
    const idBodega = bodegaSeleccionada ? bodegaSeleccionada.bodegaId : '';

    const metodo = operation === 1 ? 'POST' : 'PUT';
    enviarSolicitud(metodo, { ...parametros, bodegaId: idBodega });
  };

  const enviarSolicitud = async (metodo, parametros) => {
    const empleadoIdParam = empleadoId || '';
    try {
      const bodegaId = parametros.bodegaId;
      const empleadoActual = empleados.find((empleado) => empleado.empleadoId === empleadoIdParam);
      if (empleadoActual && metodo === 'PUT') {
        parametros = { ...parametros, estado: empleadoActual.estado };
      }
  
      const response = await axios[metodo.toLowerCase()](
        empleadoIdParam ? `${apiUrl}/${empleadoIdParam}` : apiUrl,
        parametros
      );
  
      console.log('Respuesta del servidor:', response.data);
      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);
      show_alerta(`Empleado ${nombre} se a ${msj} exitosamente`, 'success');
      setErrors({});
      getEmpleados();

      setCacheKey(Date.now().toString());
      setEmpleadoId('');
      setNombre('');
      setApellido('');
      setDocumento('');
      setCargo('');
      setFechaInicio(new Date());
      setFechaFin(new Date());
      setSueldo('');
      setBodegaId('');
    } catch (error) {
      show_alerta('Error de solicitud', 'error');
      console.error(error);
    }
  };

  const desactivarEmpleado = async (empleadoId, nombre, apellido, documento, cargo, fechaInicio, fechaFin, sueldo, bodegaId) => {
    try {
      const parametros = { nombre, apellido, documento, cargo, fechaInicio, fechaFin, sueldo, bodegaId, estado: 'Desactivado' };
      await axios.put(`${apiUrl}/${empleadoId}`, parametros);
      show_alerta(`Empleado ${nombre} desactivado exitosamente`, 'success');
      getEmpleados();
      setCacheKey(Date.now().toString());
    } catch (error) {
      show_alerta('Error al desactivar al empleado', 'error');
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    if (text.trim() === '') {
      setPageNumber(1);
      getEmpleados();
    } else {
      const filteredEmpleados = empleados.filter(
        (empleado) =>
          (empleado.nombre.toLowerCase().includes(text.toLowerCase()) || empleado.documento.toString().toLowerCase().includes(text.toLowerCase())) &&
          empleado.estado !== 'Desactivado'
      );
      setEmpleados(filteredEmpleados);
    }
  };

  const handleBodegaChange = (e) => {
    const selectedBodegaId = e.target.value;
    setBodegaId(selectedBodegaId);
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
                placeholder='Buscar empleado'
                aria-label='Buscar empleado'
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
                data-bs-target='#modalEmpleados'
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
                    Apellido
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Documento
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Cargo
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Fecha de Inicio
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Fecha de Fin
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Sueldo
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    ID Bodega
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {empleados
                  .filter((empleado) => empleado.estado !== 'Desactivado')
                  .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
                  .map((empleado, i) => (
                    <tr key={empleado.empleadoId}>
                      <td style={{ background: '#dadada' }}>{i + 1}</td>
                      <td style={{ background: '#dadada' }}>{empleado.nombre}</td>
                      <td style={{ background: '#dadada' }}>{empleado.apellido}</td>
                      <td style={{ background: '#dadada' }}>{empleado.documento}</td>
                      <td style={{ background: '#dadada' }}>{empleado.cargo}</td>
                      <td style={{ background: '#dadada' }}>{empleado.fechaInicio}</td>
                      <td style={{ background: '#dadada' }}>{empleado.fechaFin}</td>
                      <td style={{ background: '#dadada' }}>{empleado.sueldo}</td>
                      <td style={{ background: '#dadada' }}>
                        {bodegas.find((bodega) => bodega.id === empleado.bodegaIdBodega)?.nombre}
                      </td>
                      <td style={{ background: '#dadada' }}>
                        <button
                          onClick={() =>
                            openModal(
                              2,
                              empleado.empleadoId,
                              empleado.nombre,
                              empleado.apellido,
                              empleado.documento,
                              empleado.cargo,
                              empleado.fechaInicio,
                              empleado.fechaFin,
                              empleado.sueldo,
                              empleado.bodegaId
                            )
                          }
                          className='btn btn-warning'
                          data-bs-toggle='modal'
                          data-bs-target='#modalEmpleados'
                          style={{ background: '#440000', color: 'white' }}
                        >
                          <i className='fa-solid fa-edit'></i>
                        </button>
                        &nbsp;
                        <button
                          onClick={() => desactivarEmpleado(
                            empleado.empleadoId, 
                            empleado.nombre, 
                            empleado.apellido, 
                            empleado.documento, 
                            empleado.cargo, 
                            empleado.fechaInicio, 
                            empleado.fechaFin, 
                            empleado.sueldo, 
                            empleado.bodegaId
                          )}
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
      <div id='modalEmpleados' className='modal fade' aria-hidden='true'>
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
                  name='nombre'
                  className='form-control'
                  placeholder='Nombre'
                  value={nombre}
                  onChange={handleInputChange}
                  required
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.nombre && <p className='error-message red-color'>{errors.nombre}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='apellido'
                  name='apellido'
                  className='form-control'
                  placeholder='Apellido'
                  value={apellido}
                  onChange={handleInputChange}
                  required
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.apellido && <p className='error-message red-color'>{errors.apellido}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='documento'
                  name='documento'
                  className='form-control'
                  placeholder='Documento'
                  value={documento}
                  onChange={handleInputChange}
                  required
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.documento && <p className='error-message red-color'>{errors.documento}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>

                <select
                  id='cargo'
                  className='form-select'
                  value={cargo}
                  onChange={(event) => setCargo(event.target.value)}
                  required
                >
                  <option value=''>Seleccionar Cargo</option>
                  <option value='Almacenista'>Almacenista</option>
                  <option value='Recepcionista de mercancía'>Recepcionista de mercancía</option>
                  <option value='Supervisor de calidad'>Supervisor de calidad</option>
                  <option value='Técnico de mantenimiento'>Técnico de mantenimiento</option>
                  <option value='Coordinador de logística'>Coordinador de logística</option>
                  <option value='Jefe de bodega'>Jefe de bodega</option>
                  <option value='Operario de montacargas'>Operario de montacargas</option>
                  <option value='Empacador'>Empacador</option>
                </select>
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.cargo && <p className='error-message red-color'>{errors.cargo}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <DatePicker
                  className='form-control'
                  selected={fechaInicio}
                  onChange={(date) => setFechaInicio(date)}
                  dateFormat='yyyy-MM-dd'
                  minDate={new Date()}// Establece la fecha mínima como la fecha actual
               
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.fechaInicio && <p className='error-message red-color'>{errors.fechaInicio}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <DatePicker
                  className='form-control'
                  selected={fechaFin}
                  onChange={(date) => setFechaFin(date)}
                  dateFormat='yyyy-MM-dd'
                  minDate={new Date()} // Establece la fecha mínima como la fecha actual
                  
                />

                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.fechaFin && <p className='error-message red-color'>{errors.fechaFin}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='sueldo'
                  name='sueldo'
                  className='form-control'
                  placeholder='Sueldo'
                  value={sueldo}
                  onChange={handleInputChange}
                  required
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.sueldo && <p className='error-message red-color'>{errors.sueldo}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <select
                  id='bodegaId'
                  name='bodegaId'
                  className='form-select'
                  value={bodegaId}
                  onChange={handleBodegaChange}
                  required
                >
                  <option value=''>Seleccionar Bodega</option>
                  {bodegas.map((bodega) => (
                    <option key={bodega.bodegaId} value={bodega.bodegaId}>
                      {bodega.nombre}
                    </option>
                  ))}
                </select>
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.bodegaId && <p className='error-message red-color'>{errors.bodegaId}</p>}
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                Cerrar
              </button>
              <button type='button' className='btn btn-primary' onClick={validar}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageEmpleados;