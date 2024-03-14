import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageClientes = () => {
  const apiUrl = 'https://localhost:7284/api/clientes';
  const [clientes, setClientes] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getClientes();
  }, []);

  const getClientes = async () => {
    try {
      const response = await axios.get(apiUrl);
      setClientes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    if (text.trim() === '') {
      setPageNumber(1);
      getClientes();
    } else {
      const filteredClientes = clientes.filter((cliente) =>
        cliente.nombre.toLowerCase().includes(text.toLowerCase())
      );
      setClientes(filteredClientes);
    }
  };
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-12'>
          <h2>Lista de Clientes</h2>
          <div className='input-group mb-3'>
            <input
              type='text'
              className='form-control'
              placeholder='Buscar cliente'
              aria-label='Buscar cliente'
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
                <th>Apellido</th>
                <th>Edad</th>
                <th>Tipo de Documento</th>
                <th>Número de Documento</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente, index) => (
                <tr key={cliente.clienteId}>
                  <td>{index + 1}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.apellido}</td>
                  <td>{cliente.edad}</td>
                  <td>{cliente.tipoDocumento}</td>
                  <td>{cliente.numDocumento}</td>
                  <td>{cliente.correo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageClientes;
