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
      const res = await sendRequest('GET', '', '/api/clientes', '');
      setClientes(res);
      setClassLoad('d-none');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCliente = (id, name) => {
    confirmation(name, `/api/clientes/${id}`, '/');
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <DivAdd>
          <Link to='/crearclientes' className='btn btn-dark mx-auto col-3'  style={{ background: '#440000', borderColor: '#440000', borderRadius: '45px', transform: 'translate(36px)', color: 'white' }}>
            <i className='fas fa-circle-plus'></i> AGREGAR
          </Link>
        </DivAdd>
        <DivTable col='6' off='3' classLoad={classLoad} style={{ border: '1px solid red' }}>
          <table className='table table-bordered' >
            <thead>
              <tr>
                <th style={{ background: '#440000', color: 'white' }}>#</th>
                <th style={{ background: '#440000', color: 'white' }}>NOMBRE</th>
                <th style={{ background: '#440000', color: 'white' }}>APELLIDO</th>
                <th style={{ background: '#440000', color: 'white' }}> EDAD</th>
                <th style={{ background: '#440000', color: 'white' }}>TIPO DE DOCUMENTO</th>
                <th style={{ background: '#440000', color: 'white' }}>NUMERO DE DOCUMENTO</th>
                <th style={{ background: '#440000', color: 'white' }}>CORREO</th>
                <th style={{ background: '#440000', color: 'white' }}></th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((row, i) => (
                <tr key={row.id}>
                  <td>{i + 1}</td>
                  <td>{row.nombre}</td>
                  <td>{row.apellido}</td>
                  <td>{row.edad}</td>
                  <td>{row.tipoDocumento}</td>
                  <td>{row.numDocumento}</td>
                  <td>{row.correo}</td>
                  <td>
                    <Link to={`/editclientes/${row.id}`} className='btn btn-warning'>
                      <i className='fas fa-edit'></i>
                    </Link>
                    <button
                      className='btn btn-danger ms-2'
                      onClick={() => deleteCliente(row.id, row.nombre)}
                    >
                      <i className='fas fa-trash'></i>
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
