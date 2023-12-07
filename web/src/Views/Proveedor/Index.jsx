import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { confirmation, sendRequest } from '../../functions';

const Proveedor = () => {
  const [proveedores, setProveedores] = useState([]);
  const [classLoad, setClassLoad] = useState('');

  useEffect(() => {
    getProveedores();
  }, []);

  const getProveedores = async () => {
    try {
      setClassLoad('');
      const res = await sendRequest('GET', '', '/api/proveedor', '');
      setProveedores(res);
      setClassLoad('d-none');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProveedor = (id, name) => {
    confirmation(name, `/api/proveedor/${id}`, '/');
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <DivAdd>
          <Link to='create-proveedor' className='btn btn-dark mx-auto col-3'>
            <i className='fa-solid fa-circle-plus'></i> add
          </Link>
        </DivAdd>
        <DivTable col='6' off='3' classLoad={classLoad}>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>#</th>
                <th>NOMBRE</th>
                <th>DIRECCIÓN</th>
                <th>TELÉFONO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((row, i) => (
                <tr key={row.id}>
                  <td>{i + 1}</td>
                  <td>{row.nombre}</td>
                  <td>{row.direccion}</td>
                  <td>{row.telefono}</td>
                  <td>
                    <Link to={`/edit-proveedor/${row.id}`} className='btn btn-warning'>
                      <i className='fa-solid fa-edit'></i>
                    </Link>
                    <button
                      className='btn btn-danger ms-2'
                      onClick={() => deleteProveedor(row.id, row.nombre)}
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

export default Proveedor;
