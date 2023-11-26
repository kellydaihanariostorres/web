import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { confirmation, sendRequest } from '../../functions';

const Bodega = () => {
  const [bodegas, setBodegas] = useState([]);
  const [classLoad, setClassLoad] = useState('');

  useEffect(() => {
    getBodegas();
  }, []);

  const getBodegas = async () => {
    try {
      setClassLoad('');
      const res = await sendRequest('GET', '', '/api/bodega', '');
      setBodegas(res);
      setClassLoad('d-none'); 
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBodegas = (id, name) => {
    confirmation(name, `/api/bodegas/${id}`, '/');
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <DivAdd>
          <Link to='create' className='btn btn-dark mx-auto col-6'>
            <i className='fa-solid fa-circle-plus'></i> add
          </Link>
        </DivAdd>
        <DivTable col='6' off='3' classLoad={classLoad}>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>#</th>
                <th>BODEGA</th>
                <th>DIRECCION</th>
                <th>CUIDAD</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {bodegas.map((row, i) => (
                <tr key={row.id}>
                  <td>{i + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.address}</td>
                  <td>{row.city}</td>
                  <td>
                    <Link to={`/edit/${row.id}`} className='btn btn-warning'>
                      <i className='fa-solid fa-edit'></i>
                    </Link>
                    <button
                      className='btn btn-danger ms-2'
                      onClick={() => deleteBodegas(row.id, row.name)}
                    >
                      <i className='fa-solid fa-trash'></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           {classLoad !== 'd-none' && (
            <div className='text-center'>
            <img
              src='/ruta-al-archivo/loading.gif'
              alt='Loading'
              style={{ width: '20px', height: '20px' }} 
            />
         </div>
          )}
        </DivTable>
      </div>
    </div>
  );
};

export default Bodega;
