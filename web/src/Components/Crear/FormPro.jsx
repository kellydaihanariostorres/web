import React, { useEffect, useState, useRef } from 'react';
import { sendRequest } from '../../functions';
import DivInput from '../DivInput';
import { Link } from 'react-router-dom';

const FormProducto = ({ id }) => {
  const [nombreProducto, setNombreProducto] = useState('');
  const [precioProducto, setPrecioProducto] = useState('');
  const [marcaProducto, setMarcaProducto] = useState('');
  const [clasificacionProducto, setClasificacionProducto] = useState('');
  const NombreProductoInput = useRef();

  let method = 'POST';
  let url = 'api/productos';
  let redirect = '';

  useEffect(() => {
    NombreProductoInput.current.focus();
    if (id) {
      getProducto();
    }
  }, [id]);

  const getProducto = async () => {
    const res = await sendRequest('GET', '', `api/productos/${id}`);
    const producto = res.data;

    setNombreProducto(producto.nombreProducto || '');
    setPrecioProducto(producto.precioProducto || '');
    setMarcaProducto(producto.marcaProducto || '');
    setClasificacionProducto(producto.clasificacionProducto || '');
  };

  const save = async (e) => {
    e.preventDefault();

    if (id) {
      method = 'PUT';
      url = `api/productos/${id}`;
      redirect = '/productos';
    }

    const res = await sendRequest(method, {
      id,
      nombreProducto,
      precioProducto,
      marcaProducto,
      clasificacionProducto,
    }, url, redirect);

    if (method === 'POST' && res.status === true) {
      setNombreProducto('');
      setPrecioProducto('');
      setMarcaProducto('');
      setClasificacionProducto('');
    }

    
  };

  

  return (
    <div className='container-fluid'>
      <div className='row mt-5'>
        <div className='col-md-4 offset-md-4'>
          <div className='card border ' style={{ border: '1px solid #af0004', padding: '15px' }}>
            <div className='card-header ' style={{ backgroundColor: '#440000 !important'}}>
              {id ? 'Editar Producto' : 'Crear Producto'}
            </div>
            <div className='card-body'>
              <form onSubmit={save}>
                <DivInput
                  type='text'
                  icon='fa-wine-bottle'
                  value={nombreProducto}
                  className='form-control'
                  placeholder='Nombre del Producto'
                  required='required'
                  ref={NombreProductoInput}
                  handleChange={(e) => setNombreProducto(e.target.value)}
                />
                <DivInput
                  type='text'
                  icon='fa-money-bill'
                  value={precioProducto}
                  className='form-control'
                  placeholder='Precio del Producto'
                  required='required'
                  handleChange={(e) => setPrecioProducto(e.target.value)}
                />
                <DivInput
                  type='text'
                  icon='fa-trademark'
                  value={marcaProducto}
                  className='form-control'
                  placeholder='Marca del Producto'
                  required='required'
                  handleChange={(e) => setMarcaProducto(e.target.value)}
                />
                <DivInput
                  type='text'
                  icon='fa-tags'
                  value={clasificacionProducto}
                  className='form-control'
                  placeholder='Clasificación del Producto'
                  required='required'
                  handleChange={(e) => setClasificacionProducto(e.target.value)}
                />
                <div className='d-flex justify-content-between mt-3'>
                  <button className='btn btn-sm btn-dark' type='submit' style={{ backgroundColor: '#440000 ' }}>
                    <i className='fa-solid fa-save'></i> Guardar
                  </button>
                  <Link to='/productos' style={{ textDecoration: 'none' }}>
                    <button className='btn btn-sm btn-secondary' type='submit' style={{ backgroundColor: '#440000 ' }}>
                      <i className='fa-solid fa-times'></i> Cancelar
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormProducto;
