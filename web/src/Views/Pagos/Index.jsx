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
      const res = await sendRequest('GET', '', '/api/pago', '');
      setPagos(res);
      setClassLoad('d-none');
    } catch (error) {
      console.error(error);
    }
  };

  const deletePago = (id, nombre) => {
    confirmation(nombre, `/api/pago/${id}`, '/');
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <DivAdd>
          <Link to='create-pago' className='btn btn-dark mx-auto col-6'>
            <i className='fa-solid fa-circle-plus'></i> add
          </Link>
        </DivAdd>
        <DivTable col='6' off='3' classLoad={classLoad}>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>#</th>
                <th>NOMBRE</th>
                <th>MONTO</th>
                <th>TIPO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((row, i) => (
                <tr key={row.id}>
                  <td>{i + 1}</td>
                  <td>{row.nombre}</td>
                  <td>{row.monto}</td>
                  <td>{row.tipo}</td>
                  <td>
                    <Link to={`/edit-pago/${row.id}`} className='btn btn-warning'>
                      <i className='fa-solid fa-edit'></i>
                    </Link>
                    <button
                      className='btn btn-danger ms-2'
                      onClick={() => deletePago(row.id, row.nombre)}
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
