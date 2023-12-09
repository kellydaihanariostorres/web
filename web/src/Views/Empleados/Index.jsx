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
      const res = await sendRequest('GET', '', '/api/empleado', '');
      setEmpleados(res);
      setClassLoad('d-none');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEmpleado = (id, name) => {
    confirmation(name, `/api/empleado/${id}`, '/');
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <DivAdd>
          <Link to='create-empleado' className='btn btn-dark mx-auto col-3'>
            <i className='fa-solid fa-circle-plus'></i> AGREGAR
          </Link>
        </DivAdd>
        <DivTable col='6' off='3' classLoad={classLoad}>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>#</th>
                <th>NOMBRE</th>
                <th>APELLIDO</th>
                <th>DOCUMENTO</th>
                <th>CARGO</th>
                <th>FECHA INICIO</th>
                <th>FECHA FIN</th>
                <th>SUELDO</th>
                <th>BODEGA ID</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((row, i) => (
                <tr key={row.empleadoId}>
                  <td>{i + 1}</td>
                  <td>{row.nombre}</td>
                  <td>{row.apellido}</td>
                  <td>{row.documento}</td>
                  <td>{row.cargo}</td>
                  <td>{row.fechaInicio}</td>
                  <td>{row.fechaFin}</td>
                  <td>{row.sueldo}</td>
                  <td>{row.bodegaId}</td>
                  <td>
                    <Link to={`/edit-empleado/${row.empleadoId}`} className='btn btn-warning'>
                      <i className='fa-solid fa-edit'></i>
                    </Link>
                    <button
                      className='btn btn-danger ms-2'
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
