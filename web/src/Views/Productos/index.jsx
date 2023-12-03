import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { confirmation, sendRequest } from '../../functions';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [classLoad, setClassLoad] = useState('');

  useEffect(() => {
    getProductos();
    getCategorias();
  }, []);

  const getProductos = async () => {
    try {
      setClassLoad('');
      const res = await sendRequest('GET', '', '/api/producto', '');
      setProductos(res);
      setClassLoad('d-none');
    } catch (error) {
      console.error(error);
    }
  };

  const getCategorias = async () => {
    try {
      const res = await sendRequest('GET', '', '/api/categoria', '');
      setCategorias(res);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProducto = (id, name) => {
    confirmation(name, `/api/producto/${id}`, '/');
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <DivAdd>
          <Link to='create-producto' className='btn btn-dark mx-auto col-6'>
            <i className='fa-solid fa-circle-plus'></i> add
          </Link>
        </DivAdd>
        <DivTable col='6' off='3' classLoad={classLoad}>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>#</th>
                <th>PRODUCTO</th>
                <th>CATEGORÍA</th>
                <th>PRECIO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((row, i) => (
                <tr key={row.id}>
                  <td>{i + 1}</td>
                  <td>{row.nombre}</td>
                  <td>{row.categoria}</td>
                  <td>{row.precio}</td>
                  <td>
                    <Link to={`/edit-producto/${row.id}`} className='btn btn-warning'>
                      <i className='fa-solid fa-edit'></i>
                    </Link>
                    <button
                      className='btn btn-danger ms-2'
                      onClick={() => deleteProducto(row.id, row.nombre)}
                    >
                      <i className='fa-solid fa-trash'></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DivTable>
      </div>
    </div>
  );
};

export default Productos;
