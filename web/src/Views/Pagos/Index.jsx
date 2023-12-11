import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { confirmation, sendRequest } from '../../functions';

const Pago = () => {
  const [pagos, setPagos] = useState([]);
  const [classLoad, setClassLoad] = useState('');

  useEffect(() => {
    getPagos();
  }, []);

  const getPagos = async () => {
    try {
      setClassLoad('');
      const res = await sendRequest('GET', '', '/api/nominas', '');
      setPagos(res);
      setClassLoad('d-none');
    } catch (error) {
      console.error(error);
    }
  };

  const deletePago = (id, nombre) => {
    confirmation(nombre, `/api/nominas/${id}`, '/');
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
                
                <th>CUENTA BANCARIA</th>
                <th>EMAIL</th>
                <th>TELEFONO</th>
                <th>DIRECCION</th>
                <th>FECHA CREACION</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((row, i) => (
                <tr key={row.nominaId}>
                  <td>{i + 1}</td>
                  
                  <td>{row.cuentaBancaria}</td>
                  <td>{row.email}</td>
                  <td>{row.telefono}</td>
                  <td>{row.direccion}</td>
                  <td>{row.fechaCreacion}</td>
                  <td>
                    <Link to={`/edit-pago/${row.nominaId}`} className='btn btn-warning'>
                      <i className='fa-solid fa-edit'></i>
                    </Link>
                    <button
                      className='btn btn-danger ms-2'
                      onClick={() => deletePago(row.nominaId, row.nombre)}
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

export default Pago;
