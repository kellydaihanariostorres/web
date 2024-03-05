import React, { useEffect, useState } from 'react';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { show_alerta } from '../../functions';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManageInventarios = () => {
  const apiUrl = 'https://localhost:7284/api/inventarios';
  const [inventarios, setInventarios] = useState([]);
  const [id, setId] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [idProducto, setIdProducto] = useState('');
  const [idFactura, setIdFactura] = useState('');
  const [precioProducto, setPrecioProducto] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState('');
  const [marcaProducto, setMarcaProducto] = useState('');
  const [clasificacionProducto, setClasificacionProducto] = useState('');
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1); 

  useEffect(() => {
    getInventarios(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

  const getInventarios = async () => {
    try {
      const response = await axios.get(apiUrl);
      setInventarios(response.data);
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

  const openModal = (op, id, nombreProducto, idProducto, idFactura, precioProducto, cantidadProducto, marcaProducto, clasificacionProducto) => {
    setOperation(op);
    setId(id);

    if (op === 1) {
      setTitle('Registrar inventario');
      setNombreProducto('');
      setIdProducto('');
      setIdFactura('');
      setPrecioProducto('');
      setCantidadProducto('');
      setMarcaProducto('');
      setClasificacionProducto('');
    } else if (op === 2) {
      setTitle('Editar inventario');
      setNombreProducto(nombreProducto);
      setIdProducto(idProducto);
      setIdFactura(idFactura);
      setPrecioProducto(precioProducto);
      setCantidadProducto(cantidadProducto);
      setMarcaProducto(marcaProducto);
      setClasificacionProducto(clasificacionProducto);
    }

    document.getElementById('modalInventarios').addEventListener('shown.bs.modal', function () {
      document.getElementById('nombreProducto').focus();
    });
  };

  const validar = () => {
    if (
      nombreProducto.trim() === '' ||
      idProducto.trim() === '' ||
      idFactura.trim() === '' ||
      precioProducto.trim() === '' ||
      cantidadProducto.trim() === '' ||
      marcaProducto.trim() === '' ||
      clasificacionProducto.trim() === ''
    ) {
      show_alerta('Completa todos los campos', 'warning');
    } else {
      const parametros = { nombreProducto, idProducto, idFactura, precioProducto, cantidadProducto, marcaProducto, clasificacionProducto };
      const metodo = operation === 1 ? 'POST' : 'PUT';
      enviarSolicitud(metodo, parametros);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    const idParam = id || '';
    try {
      const response = await axios[metodo.toLowerCase()](
        idParam ? `${apiUrl}/${idParam}` : apiUrl,
        parametros
      );
      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);
      getInventarios();
      setId('');
      setNombreProducto('');
      setIdProducto('');
      setIdFactura('');
      setPrecioProducto('');
      setCantidadProducto('');
      setMarcaProducto('');
      setClasificacionProducto('');
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
      getInventarios();
    } else {
      const filteredInventarios = inventarios.filter((inventario) =>
        inventario.nombreProducto.toLowerCase().includes(text.toLowerCase())
      );
      setInventarios(filteredInventarios);
    }
  };

  const deleteInventario = (id, nombreProducto) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro quieres eliminar el inventario de ${nombreProducto}?`,
      icon: 'question',
      text: 'No se podrá dar marcha atrás',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/${id}`);
          show_alerta('Inventario eliminado exitosamente', 'success');
        } catch (error) {
          show_alerta('Error al eliminar el inventario', 'error');
          console.error(error);
        } finally {
          getInventarios();
          setId('');
          setNombreProducto('');
          setIdProducto('');
          setIdFactura('');
          setPrecioProducto('');
          setCantidadProducto('');
          setMarcaProducto('');
          setClasificacionProducto('');
        }
      } else {
        show_alerta('El inventario no fue eliminado', 'info');
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
                  placeholder='Buscar inventario'
                  aria-label='Buscar inventario'
                  aria-describedby='button-addon2'
                  onChange={handleSearch}
                  value={searchText}
                  style={{ height: '40px', borderRadius: '45px', marginRight: '100px', width: '500px', marginLeft: 'auto', position: 'absolute', right: 0 }}
                />
              </div>
              <DivAdd>
                <button
                  type="button"
                  class="btn btn-danger"
                  onClick={() => openModal(1)}
                  data-bs-toggle='modal'
                  data-bs-target='#modalInventarios'
                  className='btn btn-dark'
                  style={{ background: '#440000', borderColor: '#440000', color: 'white', width: '100%', marginLeft: '100px' }}
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
                    Nombre Producto
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Precio Producto
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Cantidad Producto
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Marca Producto
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Clasificación Producto
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {inventarios
                  .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
                  .map((inventario, i) => (
                    <tr key={inventario.id}>
                      <td style={{ background: '#dadada' }}>{i + 1}</td>
                      <td style={{ background: '#dadada' }}>{inventario.nombreProducto}</td>
                      <td style={{ background: '#dadada' }}>{inventario.precioProducto}</td>
                      <td style={{ background: '#dadada' }}>{inventario.cantidadProducto}</td>
                      <td style={{ background: '#dadada' }}>{inventario.marcaProducto}</td>
                      <td style={{ background: '#dadada' }}>{inventario.clasificacionProducto}</td>
                      <td style={{ background: '#dadada' }}>
                        <button
                          onClick={() =>
                            openModal(
                              2,
                              inventario.id,
                              inventario.nombreProducto,
                              inventario.idProducto,
                              inventario.idFactura,
                              inventario.precioProducto,
                              inventario.cantidadProducto,
                              inventario.marcaProducto,
                              inventario.clasificacionProducto
                            )
                          }
                          className='btn btn-warning'
                          data-bs-toggle='modal'
                          data-bs-target='#modalInventarios'
                          style={{ background: '#440000', color: 'white' }}
                        >
                          <i className='fa-solid fa-edit'></i>
                        </button>
                        &nbsp;
                        <button
                          onClick={() => deleteInventario(inventario.id, inventario.nombreProducto)}
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
              <button onClick={handlePreviousPage} disabled={pageNumber === 1} style={{ background: '#440000', borderColor: '#440000', color: 'white' }}>
                Anterior
              </button>
              <span>
                Página {pageNumber} de {pageSize}
              </span>
              <button onClick={handleNextPage} disabled={pageNumber === totalPages} style={{ background: '#440000', borderColor: '#440000', color: 'white' }}>
                Siguiente
              </button>
            </div>
          </DivTable>
        </div>
      </div>
      <div id='modalInventarios' className='modal fade' aria-hidden='true'>
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
                  id='nombreProducto'
                  className='form-control'
                  placeholder='Nombre Producto'
                  value={nombreProducto}
                  onChange={(e) => setNombreProducto(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='idProducto'
                  className='form-control'
                  placeholder='ID Producto'
                  value={idProducto}
                  onChange={(e) => setIdProducto(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='idFactura'
                  className='form-control'
                  placeholder='ID Factura'
                  value={idFactura}
                  onChange={(e) => setIdFactura(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='precioProducto'
                  className='form-control'
                  placeholder='Precio Producto'
                  value={precioProducto}
                  onChange={(e) => setPrecioProducto(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='cantidadProducto'
                  className='form-control'
                  placeholder='Cantidad Producto'
                  value={cantidadProducto}
                  onChange={(e) => setCantidadProducto(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='marcaProducto'
                  className='form-control'
                  placeholder='Marca Producto'
                  value={marcaProducto}
                  onChange={(e) => setMarcaProducto(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-gift'></i>
                </span>
                <input
                  type='text'
                  id='clasificacionProducto'
                  className='form-control'
                  placeholder='Clasificación Producto'
                  value={clasificacionProducto}
                  onChange={(e) => setClasificacionProducto(e.target.value)}
                />
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar(id)} className='btn btn-success'>
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

export default ManageInventarios;

