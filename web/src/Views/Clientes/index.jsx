import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { confirmation, sendRequest } from '../../functions';

const Cliente = () => {
  const [clientes, setClientes] = useState([]);
  const [classLoad, setClassLoad] = useState('');

  useEffect(() => {
    getClientes();
  }, []);

  const getClientes = async () => {
    try {
      setClassLoad('');
      const res = await sendRequest('GET', '', '/api/cliente', '');
      setClientes(res);
      setClassLoad('d-none');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCliente = (id, name) => {
    confirmation(name, `/api/cliente/${id}`, '/');
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <DivAdd>
          <Link to='create-empleado' className='btn btn-dark mx-auto col-3'>
            <i className='fa-solid fa-circle-plus'></i> AGREGAR
          </Link>
        </DivAdd>
        <DivTable col='6' off='3' classLoad={classLoad} style={{ border: '1px solid red' }}>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>#</th>
                <th>NOMBRE</th>
                <th>APELLIDO</th>
                <th>EDAD</th>
                <th>TIPO DE DOCUMENTO</th>
                <th>NUMERO DE DOCUMENTO</th>
                <th>CORREO</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((row, i) => (
                <tr key={row.id}>
                  <td>{i + 1}</td>
                  <td>{row.nombre}</td>
                  <td>{row.apellids}</td>
                  <td>{row.edad}</td>
                  <td>{row.tipoDocumento}</td>
                  <td>{row.numDocumento}</td>
                  <td>{row.correo}</td>
                  <td>
                    <Link to={`/edit-cliente/${row.id}`} className='btn btn-warning'>
                      <i className='fa-solid fa-edit'></i>
                    </Link>
                    <button
                      className='btn btn-danger ms-2'
                      onClick={() => deleteCliente(row.id, row.nombre)}
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

export default Cliente;
