import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListProveedor = ({ handleProveedorClick }) => {
  const apiUrl = 'https://localhost:7284/api/proveedor';
  const [proveedores, setProveedores] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getProveedores();
  }, []);

  const getProveedores = async () => {
    try {
      const response = await axios.get(apiUrl);
      setProveedores(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    if (text.trim() === '') {
      getProveedores();
    } else {
      const filteredProveedores = proveedores.filter((proveedor) =>
        proveedor.nombre.toLowerCase().includes(text.toLowerCase()) ||
        proveedor.numDocumento.toString().includes(text)
      );
      setProveedores(filteredProveedores);
    }
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-12'>
          <h2>Listado proveedores</h2>
          <div className='input-group mb-3'>
            <input
              type='text'
              className='form-control'
              placeholder='Buscar proveedor'
              aria-label='Buscar proveedor'
              aria-describedby='button-addon2'
              onChange={handleSearch}
              value={searchText}
            />
          </div>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Número de Cédula</th>
              </tr>
            </thead>
            <tbody>
            {proveedores.map((proveedor) => (
              <tr key={proveedor.idProveedor} onClick={() => handleProveedorClick(proveedor.idProveedor)}>
                <td>{proveedor.nombre}</td>
                <td>{proveedor.numDocumento}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListProveedor;
