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
      const res = await sendRequest('GET', '', '/api/proveedores', '');
      setProveedores(res);
      setClassLoad('d-none');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProveedor = (id, name) => {
    confirmation(name, `/api/proveedores/${id}`, '/');
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <DivAdd>
          <Link to='/createproveedor' className='btn btn-dark mx-auto col-3'  style={{ background: '#440000', borderColor: '#440000', borderRadius: '45px', transform: 'translate(36px)', color: 'white' }}
>
            <i className='fa-solid fa-circle-plus'></i> AGREGAR
          </Link>
        </DivAdd>
        <DivTable col='6' off='3' classLoad={classLoad}>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th style={{ background: '#440000', color: 'white' }}>#</th>
                <th style={{ background: '#440000', color: 'white' }}>NOMBRE</th>
                <th style={{ background: '#440000', color: 'white' }}>NUEMERO DE DOCUMENTO</th>
                <th style={{ background: '#440000', color: 'white' }}>EDAD</th>
                <th style={{ background: '#440000', color: 'white' }}>TELEFONO</th>
                <th style={{ background: '#440000', color: 'white' }}>CORREO</th>
                <th style={{ background: '#440000', color: 'white' }}>ENTODAD BANCARIA</th>
                <th style={{ background: '#440000', color: 'white' }}>CUENTA BANCARIA</th>
                <th style={{ background: '#440000', color: 'white' }}></th>
                
              </tr>
              
            </thead>
            <tbody>
              {proveedores.map((row, i) => (
                <tr key={row.id}>
                  <td>{i + 1}</td>
                  <td>{row.nombre}</td>
                  <td>{row.numDocumento}</td>
                  <td>{row.edad}</td>
                  <td>{row.telefono}</td>
                  <td>{row.correo}</td>
                  <td>{row.nombreEntidadBancaria}</td>
                  <td>{row.numeroCuentaBancaria}</td>

                  <td>
                    <Link to={`/editproveedor/${row.id}`} className='btn btn-warning'>
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
