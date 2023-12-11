import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { confirmation, sendRequest } from '../../functions';

const Inventario = () => {
  const [inventario, setInventario] = useState([]);
  const [classLoad, setClassLoad] = useState('');

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
    confirmation(nombre, `/api/inventarios/${id}`, '/');
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <DivAdd>
          
        </DivAdd>
        <DivTable col='6' off='3' classLoad={classLoad}>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>#</th>
                <th>NOMBRE PRODUCTO</th>
                <th>CANTIDAD PRODUCTO</th>
                <th>PRECIO UNITARIO</th>
                <th>MARCA PRODUCTO</th>
                <th>CLASIFICACION PRODUCTO</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((row, i) => (
                <tr key={row.id}>
                  <td>{i + 1}</td>
                  <td>{row.nombreProducto}</td>
                  <td>{row.cantidadProducto}</td>
                  <td>{row.precioProducto}</td>
                  <td>{row.marcaProducto}</td>
                  <td>{row.clasificacionProducto}</td>
                  <td>
                    <Link to={`/edit-inventario/${row.id}`} className='btn btn-warning'>
                      <i className='fa-solid fa-edit'></i>
                    </Link>
                    <button
                      className='btn btn-danger ms-2'
                      onClick={() => deleteInventario(row.id, row.nombreProducto)}
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

export default Inventario;
