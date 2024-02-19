import React, { useEffect, useState } from 'react';
import { confirmation, sendRequest } from '../../functions';

const Inventario = () => {
  const [inventario, setInventario] = useState([]);
  const [classLoad, setClassLoad] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [idProducto, setIdProducto] = useState('');
  const [idFactura, setIdFactura] = useState('');
  const [precioProducto, setPrecioProducto] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState('');
  const [marcaProducto, setMarcaProducto] = useState('');
  const [clasificacionProducto, setClasificacionProducto] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [idProductoEditado, setIdProductoEditado] = useState('');

  useEffect(() => {
    getInventario();
  }, []);

  const getInventario = async () => {
    try {
      setClassLoad('');
      const res = await sendRequest('GET', '', '/api/inventarios', '');
      setInventario(res);
      setClassLoad('d-none');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteInventario = (id, nombre) => {
    confirmation(nombre, `/api/inventarios/${id}`, '/inventario');
  };

  const validar = () => {
    if (
      !nombreProducto.trim() ||
      !idProducto ||
      !idFactura ||
      !precioProducto.trim() ||
      !cantidadProducto ||
      !marcaProducto.trim() ||
      !clasificacionProducto.trim()
    ) {
      alert('Completa todos los campos');
    } else {
      if (isEdit) {
        editarProducto();
      } else {
        guardarProducto();
      }
    }
  };

  const guardarProducto = async () => {
    try {
      const producto = {
        nombreProducto,
        idProducto,
        idFactura,
        precioProducto,
        cantidadProducto,
        marcaProducto,
        clasificacionProducto
      };
      const res = await sendRequest('POST', producto, '/api/inventarios', '');
      console.log('Producto guardado:', res);
      setInventario([...inventario, res]);
      limpiarCampos();
      alert('Producto guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      alert('Error al guardar el producto');
    }
  };

  const editarProducto = async () => {
    try {
      const producto = {
        id: idProductoEditado,
        nombreProducto,
        idProducto,
        idFactura,
        precioProducto,
        cantidadProducto,
        marcaProducto,
        clasificacionProducto
      };
      await sendRequest('PUT', producto, `/api/inventarios/${idProductoEditado}`, '');
      const indexProducto = inventario.findIndex(item => item.id === idProductoEditado);
      const nuevoInventario = [...inventario];
      nuevoInventario[indexProducto] = producto;
      setInventario(nuevoInventario);
      limpiarCampos();
      alert('Producto editado exitosamente');
    } catch (error) {
      console.error('Error al editar el producto:', error);
      alert('Error al editar el producto');
    }
  };

  const limpiarCampos = () => {
    setNombreProducto('');
    setIdProducto('');
    setIdFactura('');
    setPrecioProducto('');
    setCantidadProducto('');
    setMarcaProducto('');
    setClasificacionProducto('');
    setIdProductoEditado('');
    setIsEdit(false);
  };

  const openModal = (id = '') => {
    if (id) {
      const productoEditado = inventario.find(item => item.id === id);
      setNombreProducto(productoEditado.nombreProducto);
      setIdProducto(productoEditado.idProducto);
      setIdFactura(productoEditado.idFactura);
      setPrecioProducto(productoEditado.precioProducto);
      setCantidadProducto(productoEditado.cantidadProducto);
      setMarcaProducto(productoEditado.marcaProducto);
      setClasificacionProducto(productoEditado.clasificacionProducto);
      setIdProductoEditado(id);
      setIsEdit(true);
    } else {
      limpiarCampos();
    }
    document.getElementById('modalProducto').classList.add('show');
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <div className='col-md-8'>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th style={{ background: '#440000', color: 'white', width: '5%' }}>#</th>
                <th style={{ background: '#440000', color: 'white', width: '20%' }}>NOMBRE PRODUCTO</th>
                <th style={{ background: '#440000', color: 'white', width: '15%' }}>ID PRODUCTO</th>
                <th style={{ background: '#440000', color: 'white', width: '15%' }}>ID FACTURA</th>
                <th style={{ background: '#440000', color: 'white', width: '15%' }}>PRECIO UNITARIO</th>
                <th style={{ background: '#440000', color: 'white', width: '15%' }}>CANTIDAD PRODUCTO</th>
                <th style={{ background: '#440000', color: 'white', width: '15%' }}>MARCA PRODUCTO</th>
                <th style={{ background: '#440000', color: 'white', width: '15%' }}>CLASIFICACION PRODUCTO</th>
                <th style={{ background: '#440000', color: 'white', width: '15%' }}></th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((row, i) => (
                <tr key={row.id}>
                  <td style={{ background: '#dadada' }}>{i + 1}</td>
                  <td style={{ background: '#dadada' }}>{row.nombreProducto}</td>
                  <td style={{ background: '#dadada' }}>{row.idProducto}</td>
                  <td style={{ background: '#dadada' }}>{row.idFactura}</td>
                  <td style={{ background: '#dadada' }}>{row.precioProducto}</td>
                  <td style={{ background: '#dadada' }}>{row.cantidadProducto}</td>
                  <td style={{ background: '#dadada' }}>{row.marcaProducto}</td>
                  <td style={{ background: '#dadada' }}>{row.clasificacionProducto}</td>
                  <td style={{ background: '#dadada' }}>
                    <button
                      className='btn btn-danger ms-2'
                      style={{ background: '#440000', color: 'white' }}
                      onClick={() => deleteInventario(row.id, row.nombreProducto)}
                    >
                      <i className='fa-solid fa-trash'></i>
                    </button>
                    <button
                      className='btn btn-primary ms-2'
                      style={{ background: '#440000', color: 'white' }}
                      onClick={() => openModal(row.id)}
                    >
                      <i className='fa-solid fa-edit'></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      <div id='modalProducto' className='modal fade' tabIndex='-1' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            {/* Contenido del modal */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventario;
