import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { confirmation, sendRequest } from '../../functions';

const Factura = () => {
  const [facturas, setFacturas] = useState([]);
  const [classLoad, setClassLoad] = useState('');

  useEffect(() => {
    getFacturas();
  }, []);

  const getFacturas = async () => {
    try {
      setClassLoad('');
      const res = await sendRequest('GET', '', '/api/facturas', '');
      setFacturas(res);
      setClassLoad('d-none');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFactura = (id, fechaCompra) => {
    confirmation(fechaCompra, `/api/facturas/${id}`, '/');
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
                <th style={{ background: '#440000', color: 'white' }}>FECHA DE COMPRA</th>
                <th style={{ background: '#440000', color: 'white' }}>IVA</th>
                <th style={{ background: '#440000', color: 'white' }}>SUBTOTAL</th>
                <th style={{ background: '#440000', color: 'white' }}>TOTAL</th>
                <th style={{ background: '#440000', color: 'white' }}></th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((row, i) => (
                <tr key={row.id}>
                  <td style={{ background: '#dadada' }} >{i + 1}</td>
                  <td style={{ background: '#dadada' }}>{row.fechaCompra}</td>
                  <td style={{ background: '#dadada' }}>{row.ivaCompra}</td>
                  <td style={{ background: '#dadada' }}>{row.subtotal}</td>
                  <td style={{ background: '#dadada' }}>{row.total}</td>
                  <td style={{ background: '#dadada' }}>
                    <Link to={`/editfactura/${row.id}`} className='btn btn-warning' style={{ background: '#440000' , color: 'white' }}>
                      <i className='fa-solid fa-edit'></i>
                    </Link>
                    <button
                      className='btn btn-danger ms-2'
                      style={{ background: '#440000' , color: 'white' }}
                      onClick={() => deleteFactura(row.id, row.fechaCompra)}
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

export default Factura;
