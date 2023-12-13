import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { show_alerta } from '../../functions';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManageBodegas = () => {
  const apiUrl = 'https://localhost:7284/api/productos';
  const [productos, setProductos] = useState([]);
  const [id, setId] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [precioProducto, setPrecioProducto] = useState('');
  const [marcaProducto, setMarcaProducto] = useState('');
  const [clasificacionProducto, setClasificacionProducto] = useState('');
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);

  useEffect(() => {
    getProductos();
  }, []);

  const getProductos = async () => {
    try {
      const response = await axios.get(apiUrl);
      setProductos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (op, id, nombreProducto, precioProducto, marcaProducto, clasificacionProducto) => {
    setOperation(op);
    setId(id);

    if (op === 1) {
      setTitle('Registrar producto');
      setNombreProducto('');
      setPrecioProducto('');
      setMarcaProducto('');
      setClasificacionProducto('');
    } else if (op === 2) {
      setTitle('Editar producto');
      setNombreProducto(nombreProducto);
      setPrecioProducto(precioProducto);
      setMarcaProducto(marcaProducto);
      setClasificacionProducto(clasificacionProducto);
    }

    window.setTimeout(function () {
      document.getElementById('nombreProducto').focus();
    }, 500);
  };

  const validar = () => {
    if (
      nombreProducto.trim() === '' ||
      precioProducto.trim() === '' ||
      marcaProducto.trim() === '' ||
      clasificacionProducto.trim() === ''
    ) {
      show_alerta('Completa todos los campos', 'warning');
    } else {
      const parametros = { nombreProducto, precioProducto, marcaProducto, clasificacionProducto };
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
      if (tipo === 'success') {
        document.getElementById('btnCerrar').click();
        getProductos();
      }
    } catch (error) {
      show_alerta('Error de solicitud', 'error');
      console.error(error);
    }
  };

  const deleteProducto = (id, nombreProducto) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro quieres eliminar el producto ${nombreProducto}?`,
      icon: 'question',
      text: 'No se podrá dar marcha atrás',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/${id}`);
          show_alerta('Producto eliminado exitosamente', 'success');
          getProductos();
        } catch (error) {
          show_alerta('Error al eliminar el producto', 'error');
          console.error(error);
        }
      } else {
        show_alerta('El producto no fue eliminado', 'info');
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
              className='btn btn-dark'
              data-bs-toggle='modal'
              data-bs-target='#modalProductos'
              style={{
                padding: '10px 10px',
                background: '#440000',
                borderColor: '#440000',
                borderRadius: '30px',
                transform: 'translateX(0px)',
                color: 'white',
                fontSize: '17px',
                width: 'auto',
              }}
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
                  <th className='table-header' style={{ width: '10%', background: '#440000', color: 'white' }}>
                    #
                  </th>
                  <th className='table-header' style={{ width: '20%', background: '#440000', color: 'white' }}>
                    Nombre Producto
                  </th>
                  <th className='table-header' style={{ width: '15%', background: '#440000', color: 'white' }}>
                    Precio Producto
                  </th>
                  <th className='table-header' style={{ width: '20%', background: '#440000', color: 'white' }}>
                    Marca Producto
                  </th>
                  <th className='table-header' style={{ width: '20%', background: '#440000', color: 'white' }}>
                    Clasificación Producto
                  </th>
                  <th className='table-header' style={{ width: '15%', background: '#440000', color: 'white' }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {productos.map((producto, i) => (
                  <tr key={producto.id}>
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
                            producto.id,
                            producto.nombreProducto,
                            producto.precioProducto,
                            producto.marcaProducto,
                            producto.clasificacionProducto
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
                        onClick={() => deleteProducto(producto.id, producto.nombreProducto)}
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
      <div id='modalProductos' className='modal fade' aria-hidden='true'>
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
                  <i className='fa-solid fa-money-bill'></i>
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
                  <i className='fa-solid fa-tag'></i>
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
                  <i className='fa-solid fa-tags'></i>
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

export default ManageBodegas;
