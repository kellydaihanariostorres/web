import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageProveedores = () => {
  const apiUrl = 'https://localhost:7284/api/proveedor'; // URL para obtener la lista de proveedores
  const [proveedores, setProveedores] = useState([]); // Cambiar nombre a proveedores
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getProveedores(); // Cambiar nombre de la función
  }, []);

  const getProveedores = async () => {
    try {
      const response = await axios.get(apiUrl);
      setProveedores(response.data); // Cambiar nombre del estado
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    if (text.trim() === '') {
      getProveedores(); // Cambiar nombre de la función
    } else {
      const filteredProveedores = proveedores.filter((proveedor) =>
        proveedor.nombre.toLowerCase().includes(text.toLowerCase()) ||
        proveedor.numDocumento.toString().includes(text)
      ); // Filtrar proveedores por nombre y número de documento
      setProveedores(filteredProveedores); // Cambiar nombre del estado
    }
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-12'>
          <h2>Lista de Proveedores</h2>
          <div className='input-group mb-3'>
            <input
              type='text'
              className='form-control'
              placeholder='Buscar proveedor' // Cambiar texto del placeholder
              aria-label='Buscar proveedor'
              aria-describedby='button-addon2'
              onChange={handleSearch}
              value={searchText}
            />
          </div>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Número de Documento</th> {/* Cambiar nombre de la columna */}
                <th>Edad</th> {/* Si la edad está disponible en los datos */}
                <th>Dirección</th> {/* Si la dirección está disponible en los datos */}
                <th>Teléfono</th> {/* Si el teléfono está disponible en los datos */}
                <th>Correo</th>
                <th>Nombre de Entidad Bancaria</th> {/* Si la entidad bancaria está disponible en los datos */}
                <th>Número de Cuenta Bancaria</th> {/* Si el número de cuenta está disponible en los datos */}
              </tr>
            </thead>
            <tbody>
              {proveedores.map((proveedor, index) => (
                <tr key={proveedor.idProveedor}>
                  <td>{index + 1}</td>
                  <td>{proveedor.nombre}</td>
                  <td>{proveedor.numDocumento}</td>
                  <td>{proveedor.edad}</td> {/* Si la edad está disponible en los datos */}
                  <td>{proveedor.direccion}</td> {/* Si la dirección está disponible en los datos */}
                  <td>{proveedor.telefono}</td> {/* Si el teléfono está disponible en los datos */}
                  <td>{proveedor.correo}</td>
                  <td>{proveedor.nombreEntidadBancaria}</td> {/* Si la entidad bancaria está disponible en los datos */}
                  <td>{proveedor.numeroCuentaBancaria}</td> {/* Si el número de cuenta está disponible en los datos */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageProveedores;
