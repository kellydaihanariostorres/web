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
      const res = await sendRequest('GET', '', '/api/inventario', '');
      setInventario(res);
      setClassLoad('d-none');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteInventario = (id, nombre) => {
    confirmation(nombre, `/api/inventario/${id}`, '/');
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <DivAdd>
          <Link to='create-inventario' className='btn btn-dark mx-auto col-3'>
            <i className='fa-solid fa-circle-plus'></i> add
          </Link>
        </DivAdd>
        <DivTable col='6' off='3' classLoad={classLoad}>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>#</th>
                <th>NOMBRE</th>
                <th>CANTIDAD</th>
                <th>PRECIO UNITARIO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((row, i) => (
                <tr key={row.id}>
                  <td>{i + 1}</td>
                  <td>{row.nombre}</td>
                  <td>{row.cantidad}</td>
                  <td>{row.precioUnitario}</td>
                  <td>
                    <Link to={`/edit-inventario/${row.id}`} className='btn btn-warning'>
                      <i className='fa-solid fa-edit'></i>
                    </Link>
                    <button
                      className='btn btn-danger ms-2'
                      onClick={() => deleteInventario(row.id, row.nombre)}
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
