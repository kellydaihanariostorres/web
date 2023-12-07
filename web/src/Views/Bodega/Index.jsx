import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { confirmation, sendRequest } from '../../functions';

const Bodegas = () => {
  const [bodegas, setBodegas] = useState([]);
  const [classLoad, setClassLoad] = useState('');
  const [classTable, setClassTable] = useState('d-none');

  useEffect(() => {
    getBodegas();
  }, []);

  const getBodegas = async () => {   
      const res = await sendRequest('GET', '', 'api/bodegas', '');
      setBodegas(res);
      setClassTable('');
      setClassLoad('d-none');
  };

  const deleteBodegas = (id, name) => {
    confirmation(name, `api/bodegas/${id}`, '/');
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <DivAdd>
        <Link to='/createbodega' className='btn btn-dark mx-auto col-3'>
          <i className='fa-solid fa-circle-plus'></i> Agregar
        </Link>
        </DivAdd>
        <DivTable col='6' off='3' classLoad={classLoad} classTable={classTable}>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>#</th>
                <th>BODEGA</th>
                <th>ESTADO</th>
                <th>DIRECCION</th>
                <th>CIUDAD</th>
              </tr>
            </thead>
            <tbody className='table-group-divider'>
              {bodegas.map((row, i) => (
                <tr key={row.bodegaId}>
                  <td>{i + 1}</td>
                  <td>{row.nombre}</td>
                  <td>{row.estado}</td>
                  <td>{row.direccion}</td>
                  <td>{row.ciudad}</td>
                  <td>
                    <Link to={`edit/${row.bodegaId}`} className='btn btn-warning'>
                      <i className='fa-solid fa-edit'></i>
                    </Link>
                    <button
                      className='btn btn-danger ms-2'
                      onClick={() => deleteBodegas(row.bodegaId, row.nombre)}
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

export default Bodegas;
