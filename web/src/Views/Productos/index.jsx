import React, { useEffect, useState } from 'react';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { show_alerta } from '../../functions';
import axios from 'axios';

const ManageProductos = () => {
  const apiUrl = 'https://localhost:7284/api/productos';
  const [productos, setProductos] = useState([]);
  const [nombreProducto, setNombreProducto] = useState('');
  const [precioProducto, setPrecioProducto] = useState('');
  const [marcaProducto, setMarcaProducto] = useState('');
  const [clasificacionProducto, setClasificacionProducto] = useState('');
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [totalPages, setTotalPages] = useState(1);
  const [cantidad, setCantidad] = useState(1);
  const [cacheKey, setCacheKey] = useState('');
  const [errors, setErrors] = useState({});
  const [idProducto, setIdProducto] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'nombreProducto') {
      setNombreProducto(value);
    } else if (name === 'precioProducto') {
      setPrecioProducto(value.replace(/\D/g, ''));
    } else if (name === 'marcaProducto') {
      setMarcaProducto(value.replace(/[^a-zA-Z\s]/g, ''));
    } else if (name === 'clasificacionProducto') {
      setClasificacionProducto(value);
    } else if (name === 'cantidad') {
      setCantidad(value.replace(/\D/g, ''));
    }
  };

  useEffect(() => {
    getProductos();
  }, [pageNumber, pageSize, cacheKey]);

  const getProductos = async () => {
    try {
      const response = await axios.get(`${apiUrl}?cacheKey=${cacheKey}&forceRefresh=${Date.now()}`);
      const filteredProductos = response.data.filter(
        (producto) => !producto.eliminado && !localStorage.getItem(`eliminado_${producto.idProducto}`)
      );
      setProductos(filteredProductos);
      setTotalPages(Math.ceil(filteredProductos.length / pageSize));
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

  const openModal = (op, idProducto, nombre, precio, marca, clasificacion, cantidad) => {
    setOperation(op);

    if (op === 1) {
      setTitle('Registrar producto');
      setNombreProducto('');
      setPrecioProducto('');
      setCantidad(1);
      setMarcaProducto('');
      setClasificacionProducto('');
      setIdProducto('');
    } else if (op === 2) {
      setTitle('Editar producto');
      setNombreProducto(nombre); // Aquí estableces el nombre del producto existente
      setPrecioProducto(precio);
      setCantidad(cantidad);
      setMarcaProducto(marca);
      setClasificacionProducto(clasificacion);
      setIdProducto(idProducto);
    }
  };

  const validar = () => {
    const errorsCopy = {};
    let isValid = true;
  
    if (!nombreProducto) {
      errorsCopy.nombreProducto = 'El campo Nombre es obligatorio';
      isValid = false;
    }
    if (!precioProducto) {
      errorsCopy.precioProducto = 'El campo Precio es obligatorio';
      isValid = false;
    }
    if (!cantidad) {
      errorsCopy.cantidad = 'El campo Cantidad es obligatorio';
      isValid = false;
    }
    if (!marcaProducto) {
      errorsCopy.marcaProducto = 'El campo Marca es obligatorio';
      isValid = false;
    }
    if (!clasificacionProducto) {
      errorsCopy.clasificacionProducto = 'El campo Clasificación es obligatorio';
      isValid = false;
    }
  
    if (!isValid) {
      setErrors(errorsCopy);
      return;
    }
  
    const parametros = {
      nombreProducto,
      precioProducto,
      marcaProducto,
      clasificacionProducto, // Incluir la clasificación del producto
      cantidad,
      estado: 'Activo',
    };
  
    const metodo = operation === 1 ? 'POST' : 'PUT';
    enviarSolicitud(metodo, parametros);
  };
  

  const enviarSolicitud = async (metodo, parametros) => {
    const idProductoParam = idProducto || '';
    try {
      const idProducto = parametros.idProducto;
      const productoActual = productos.find((productos) => productos.idProducto === idProductoParam );
      if (productoActual && metodo === 'PUT') {
        parametros = { ...parametros, estado: productoActual.estado };
      }
  
      const response = await axios[metodo.toLowerCase()](
        idProductoParam ? `${apiUrl}/${idProductoParam }` : apiUrl,
        parametros
      );

      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);
      setErrors({});
      show_alerta(`Producto ${nombreProducto} se ha  exitosamente`, 'success');

      getProductos();
      setCacheKey(Date.now().toString());
      setNombreProducto('');
      setPrecioProducto('');
      setMarcaProducto('');
      setClasificacionProducto('');
      setIdProducto('')
      setCantidad(1);
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
      getProductos();
    } else {
      const filteredProductos = productos.filter((producto) =>
        producto.nombreProducto.toLowerCase().includes(text.toLowerCase())
      );
      setProductos(filteredProductos);
    }
  };

  const desactivarProvedor = async (idProducto, nombreProducto) => {
    try {
      // Obtener los datos del producto
      const response = await axios.get(`${apiUrl}/${idProducto}`);
      const producto = response.data;
  
      // Actualizar solo el campo 'estado' sin modificar los otros campos
      const parametros = {
        ...producto,
        estado: 'Desactivado',
      };
  
      await axios.put(`${apiUrl}/${idProducto}`, parametros);
      show_alerta(`Producto ${nombreProducto} desactivado exitosamente`, 'success');
      getProductos();
      setCacheKey(Date.now().toString());
    } catch (error) {
      show_alerta('Error al desactivar al producto', 'error');
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
                placeholder='Buscar producto'
                aria-label='Buscar producto'
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
                type="button" 
                onClick={() => openModal(1)}
                data-bs-toggle='modal'
                data-bs-target='#modalProductos'
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
                    Precio
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Marca
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Clasificación
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {productos
                  .filter((producto) => producto.estado !== 'Desactivado')
                  .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
                  .map((producto, i) => (
                    <tr key={producto.idProducto}>
                      <td style={{ background: '#dadada' }}>{i + 1}</td>
                      <td style={{ background: '#dadada' }}>{producto.nombreProducto}</td>
                      <td style={{ background: '#dadada' }}>{producto.precioProducto}</td>
                      <td style={{ background: '#dadada' }}>{producto.marcaProducto}</td>
                      <td style={{ background: '#dadada' }}>{producto.clasificacionProducto}</td>
                      <td style={{ background: '#dadada' }}>
                        <button
                          onClick={() =>
                            openModal(
                              2,
                              producto.idProducto,
                              producto.nombreProducto,
                              producto.precioProducto,
                              producto.marcaProducto,
                              producto.clasificacionProducto,
                              producto.cantidad
                            )
                          }
                          className='btn btn-warning'
                          data-bs-toggle='modal'
                          data-bs-target='#modalProductos'
                          style={{ background: '#440000', color: 'white' }}
                        >
                          <i className='fa-solid fa-edit'></i>
                        </button>
                        &nbsp;
                        <button
                          onClick={() => desactivarProvedor(producto.idProducto, producto.nombreProducto)}
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
      <div id='modalProductos' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='nombreProducto'
                  name='nombreProducto'
                  className='form-control'
                  placeholder='Nombre'
                  value={nombreProducto}
                  onChange={handleInputChange}
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.nombreProducto && <p className='error-message red-color'>{errors.nombreProducto}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='precioProducto'
                  name='precioProducto'
                  className='form-control'
                  placeholder='Precio'
                  value={precioProducto}
                  onChange={handleInputChange}
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.precioProducto && <p className='error-message red-color'>{errors.precioProducto}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='marcaProducto'
                  name='marcaProducto'
                  className='form-control'
                  placeholder='Marca'
                  value={marcaProducto}
                  onChange={handleInputChange}
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.marcaProducto && <p className='error-message red-color'>{errors.marcaProducto}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='number'
                  id='cantidadProducto'
                  name='cantidad'
                  className='form-control'
                  placeholder='Cantidad'
                  value={cantidad}
                  onChange={handleInputChange}
                />
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.cantidad && <p className='error-message red-color'>{errors.cantidad}</p>}
                </div>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <select
                  id='clasificacionProducto'
                  className='form-select'
                  value={clasificacionProducto}
                  onChange={(event) => setClasificacionProducto(event.target.value)}
                  required
                >
                  <option value=''>Seleccionar Clasificación</option>
                  <option value='Whisky'>Whisky</option>
                  <option value='Ron'>Ron</option>
                  <option value='Vodka'>Vodka</option>
                  <option value='Ginebra'>Ginebra</option>
                  <option value='Tequila'>Tequila</option>
                  <option value='Coñac'>Coñac</option>
                  <option value='Brandy'>Brandy</option>
                  <option value='Licor de Frutas'>Licor de Frutas</option>
                </select>
                <div style={{ position: 'absolute', bottom: '-31px' }}>
                  {errors.clasificacionProducto && <p className='error-message red-color'>{errors.clasificacionProducto}</p>}
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

export default ManageProductos;
