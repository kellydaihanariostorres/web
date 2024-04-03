import React, { useEffect, useState } from 'react';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { show_alerta } from '../../functions';
import axios from 'axios';

const ManageBodegas = () => {
  const apiUrl = 'https://localhost:7284/api/bodegas';
  const [bodegas, setBodegas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [totalPages, setTotalPages] = useState(1);
  const [cacheKey, setCacheKey] = useState('');
  const [errors, setErrors] = useState({});
  const [bodegaId, setBodegaId] = useState(null);





  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'nombre') {
      setNombre(value);
    } else if (name === 'direccion') {
      setDireccion(value);
    } else if (name === 'ciudad') {
      setCiudad(value);
    }
  };

  useEffect(() => {
    getBodegas();
  }, [pageNumber, pageSize, cacheKey]);

  const getBodegas = async () => {
    try {
      const response = await axios.get(`${apiUrl}?cacheKey=${cacheKey}&forceRefresh=${Date.now()}`);
      const filteredBodegas = response.data.filter(
        (bodega) => bodega.estado !== 'Desactivado' && !localStorage.getItem(`eliminado_${bodega.bodegaId}`)
      );
      setBodegas(filteredBodegas);
      setTotalPages(Math.ceil(filteredBodegas.length / pageSize));
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

  const openModal = (op, bodegaId, nombre, direccion, ciudad) => {
    setOperation(op);

    if (op === 1) {
      setTitle('Registrar bodega');
      setNombre('');
      setDireccion('');
      setCiudad('');
    } else if (op === 2) {
      setTitle('Editar bodega');
      setNombre(nombre);
      setDireccion(direccion);
      setCiudad(ciudad);
      setBodegaId(bodegaId);
    }
  };

  const validar = () => {
    const errorsCopy = {};
    let isValid = true;

    if (!nombre) {
      errorsCopy.nombre = 'El campo Nombre es obligatorio';
      isValid = false;
    }
    if (!direccion) {
      errorsCopy.direccion = 'El campo Dirección es obligatorio';
      isValid = false;
    }
    if (!ciudad) {
      errorsCopy.ciudad = 'El campo Ciudad es obligatorio';
      isValid = false;
    }

    if (!isValid) {
      setErrors(errorsCopy);
      return;
    }

    const parametros = {
      nombre,
      direccion,
      ciudad,
      estado: 'Activo',
    };

    const metodo = operation === 1 ? 'POST' : 'PUT';
    enviarSolicitud(metodo, parametros);
  };

  const enviarSolicitud = async (metodo, parametros) => {
    const bodegaIdParam = bodegaId || '';
    try {
      const bodegaActual = bodegas.find((bodega) => bodega.bodegaId === bodegaIdParam);
      if (bodegaActual && metodo === 'PUT') {
        parametros = { ...parametros, estado: bodegaActual.estado };
      }
  
      const response = await axios[metodo.toLowerCase()](
        bodegaIdParam ? `${apiUrl}/${bodegaIdParam}` : apiUrl,
        parametros
      );
  
      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);
      setErrors({});
      show_alerta(`Bodega ${nombre} se ha exitosamente`, 'success');
  
      getBodegas();
      setCacheKey(Date.now().toString());
      setNombre('');
      setDireccion('');
      setCiudad('');
      setBodegaId('');
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
      getBodegas();
    } else {
      const filteredBodegas = bodegas.filter((bodega) =>
        bodega.nombre.toLowerCase().includes(text.toLowerCase())
      );
      setBodegas(filteredBodegas);
    }
  };

  const desactivarBodega = async (bodegaId, nombre) => {
    try {
      const response = await axios.get(`${apiUrl}/${bodegaId}`);
      const bodega = response.data;

      const parametros = {
        ...bodega,
        estado: 'Desactivado',
      };

      await axios.put(`${apiUrl}/${bodegaId}`, parametros);
      show_alerta(`Bodega ${nombre} desactivada exitosamente`, 'success');
      getBodegas();
      setCacheKey(Date.now().toString());
    } catch (error) {
      show_alerta('Error al desactivar la bodega', 'error');
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
                placeholder='Buscar bodega'
                aria-label='Buscar bodega'
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
                data-bs-target='#modalBodegas'
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
                    Dirección
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Ciudad
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {bodegas
                  .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
                  .map((bodega, i) => (
                    <tr key={bodega.bodegaId}>
                      <td style={{ background: '#dadada' }}>{i + 1}</td>
                      <td style={{ background: '#dadada' }}>{bodega.nombre}</td>
                      <td style={{ background: '#dadada' }}>{bodega.direccion}</td>
                      <td style={{ background: '#dadada' }}>{bodega.ciudad}</td>
                      <td style={{ background: '#dadada' }}>
                        <button
                          onClick={() =>
                            openModal(
                              2,
                              bodega.bodegaId,
                              bodega.nombre,
                              bodega.direccion,
                              bodega.ciudad
                            )
                          }
                          className='btn btn-warning'
                          data-bs-toggle='modal'
                          data-bs-target='#modalBodegas'
                          style={{ background: '#440000', color: 'white' }}
                        >
                          <i className='fa-solid fa-edit'></i>
                        </button>
                        &nbsp;
                        <button
                          onClick={() => desactivarBodega(bodega.bodegaId, bodega.nombre)}
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
      <div id='modalBodegas' className='modal fade' aria-hidden='true'>
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
                  id='nombre'
                  name='nombre'
                  className='form-control'
                  placeholder='Nombre'
                  value={nombre}
                  onChange={handleInputChange}
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.nombre && <p className='error-message red-color'>{errors.nombre}</p>}
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
                  <i className='fa-solid fa-city'></i>
                </span>
                <input
                  type='text'
                  id='ciudad'
                  name='ciudad'
                  className='form-control'
                  placeholder='Ciudad'
                  value={ciudad}
                  onChange={handleInputChange}
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.ciudad && <p className='error-message red-color'>{errors.ciudad}</p>}
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

export default ManageBodegas;
