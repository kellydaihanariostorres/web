import React, { useState, useEffect } from 'react';

const ManageClientes = ({ onClienteClick }) => {
  const apiUrl = 'https://localhost:7284/api/clientes';
  const [clientes, setClientes] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => setClientes(data))
      .catch(error => console.error('Error fetching clientes:', error));
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredClientes = clientes.filter(cliente => {
    return cliente.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
           cliente.apellido.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <div>
      <h2>Lista de Clientes</h2>
      <input type="text" value={searchText} onChange={handleSearchChange} placeholder="Buscar cliente" />
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredClientes.length > 0 ? (
            filteredClientes.map(cliente => (
              <tr key={cliente.clienteId}>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>
                  <button onClick={() => onClienteClick(cliente.clienteId)}>Seleccionar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay clientes disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageClientes;
