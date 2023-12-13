import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { confirmation, sendRequest } from '../../functions';

const Inventario = () => {
  const [inventario, setInventario] = useState([]);
  const [classLoad, setClassLoad] = useState('');

  useEffect(() => {
    getInventario();
  }, []);

  const getInventario = async () => {
    try {
      setClassLoad('');
      const res = await sendRequest('GET', '', '/api/inventarios', '');
      setInventario(res);
      setClassLoad('d-none');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteInventario = (id, nombre) => {
    confirmation(nombre, `/api/inventarios/${id}`, '/inventario');
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
                <th style={{ background: '#440000', color: 'white' }}>NOMBRE PRODUCTO</th>
                <th style={{ background: '#440000', color: 'white' }}>CANTIDAD PRODUCTO</th>
                <th style={{ background: '#440000', color: 'white' }}>PRECIO UNITARIO</th>
                <th style={{ background: '#440000', color: 'white' }}>MARCA PRODUCTO</th>
                <th style={{ background: '#440000', color: 'white' }}>CLASIFICACION PRODUCTO</th>
                <th style={{ background: '#440000', color: 'white' }}></th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((row, i) => (
                <tr key={row.id}>
                  <td style={{ background: '#dadada' }}>{i + 1}</td>
                  <td style={{ background: '#dadada' }}>{row.nombreProducto}</td>
                  <td style={{ background: '#dadada' }}>{row.cantidadProducto}</td>
                  <td style={{ background: '#dadada' }}>{row.precioProducto}</td>
                  <td style={{ background: '#dadada' }}>{row.marcaProducto}</td>
                  <td style={{ background: '#dadada' }}>{row.clasificacionProducto}</td>
                  <td style={{ background: '#dadada' }}>
                    
                    <button
                      className='btn btn-danger ms-2'
                      style={{ background: '#440000' , color: 'white' }}
                      onClick={() => deleteInventario(row.id, row.nombreProducto)}
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

export default Inventario;
