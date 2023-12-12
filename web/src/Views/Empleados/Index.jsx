import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { confirmation, sendRequest } from '../../functions';

const Empleado = () => {
  const [empleados, setEmpleados] = useState([]);
  const [classLoad, setClassLoad] = useState('');

  useEffect(() => {
    getEmpleados();
  }, []);

  const getEmpleados = async () => {
    try {
      setClassLoad('');
      const res = await sendRequest('GET', '', '/api/empleados', '');
      setEmpleados(res);
      setClassLoad('d-none');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEmpleado = (id, name) => {
    confirmation(name, `/api/empleados/${id}`, '/empleado');
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <DivAdd>
          <Link to='/createempleado' className='btn btn-dark mx-auto col-3'  style={{ background: '#440000', borderColor: '#440000', borderRadius: '45px', transform: 'translate(36px)', color: 'white' }}
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
                <th style={{ background: '#440000', color: 'white' }}> APELLIDO</th>
                <th style={{ background: '#440000', color: 'white' }}>DOCUMENTO</th>
                <th style={{ background: '#440000', color: 'white' }}>CARGO</th>
                <th style={{ background: '#440000', color: 'white' }}>FECHA INICIO</th>
                <th style={{ background: '#440000', color: 'white' }}>FECHA FIN</th>
                <th style={{ background: '#440000', color: 'white' }}>SUELDO</th>
                <th style={{ background: '#440000', color: 'white' }}></th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((row, i) => (
                <tr key={row.empleadoId}>
                  <td style={{ background: '#dadada' }}>{i + 1}</td>
                  <td style={{ background: '#dadada' }}>{row.nombre}</td>
                  <td style={{ background: '#dadada' }}>{row.apellido}</td>
                  <td style={{ background: '#dadada' }}>{row.documento}</td>
                  <td style={{ background: '#dadada' }}>{row.cargo}</td>
                  <td style={{ background: '#dadada' }}>{row.fechaInicio}</td>
                  <td style={{ background: '#dadada' }}>{row.fechaFin}</td>
                  <td style={{ background: '#dadada' }}>{row.sueldo}</td>
                  
                  <td style={{ background: '#dadada' }}>
                    <Link to={`/editempleado/${row.empleadoId}`} className='btn btn-warning'  style={{ background: '#440000' , color: 'white' }}>
                      <i className='fa-solid fa-edit'></i>
                    </Link>
                    <button
                      className='btn btn-danger ms-2'
                      style={{ background: '#440000' , color: 'white' }}
                      onClick={() => deleteEmpleado(row.empleadoId, `${row.nombre} ${row.apellido}`)}
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

export default Empleado;
