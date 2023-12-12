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
    confirmation(nombre, `/api/nominas/${id}`, '/pago');
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
                <th style={{ background: '#440000', color: 'white' }}>#</th> 
                <th style={{ background: '#440000', color: 'white' }}>CUENTA BANCARIA</th>
                <th style={{ background: '#440000', color: 'white' }}>EMAIL</th>
                <th style={{ background: '#440000', color: 'white' }}>TELEFONO</th>
                <th style={{ background: '#440000', color: 'white' }}>DIRECCION</th>
                <th style={{ background: '#440000', color: 'white' }}>FECHA CREACION</th>
                <th style={{ background: '#440000', color: 'white' }}></th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((row, i) => (
                <tr key={row.nominaId}>
                  <td style={{ background: '#dadada' }}>{i + 1}</td>
                  
                  <td style={{ background: '#dadada' }}>{row.cuentaBancaria}</td>
                  <td style={{ background: '#dadada' }}>{row.email}</td>
                  <td style={{ background: '#dadada' }}>{row.telefono}</td>
                  <td style={{ background: '#dadada' }}>{row.direccion}</td>
                  <td style={{ background: '#dadada' }}>{row.fechaCreacion}</td>
                  <td style={{ background: '#dadada' }}>
                    <Link to={`/edit-pago/${row.nominaId}`} className='btn btn-warning'  style={{ background: '#440000' , color: 'white' }}>
                      <i className='fa-solid fa-edit'></i>
                    </Link>
                    <button
                      className='btn btn-danger ms-2'
                      style={{ background: '#440000' , color: 'white' }}
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
