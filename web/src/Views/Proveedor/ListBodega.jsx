import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageBodegas = ({ onBodegaSeleccionada }) => {
  const apiUrl = 'https://localhost:7284/api/bodegas'; // Cambiar la URL para obtener bodegas
  const [bodegas, setBodegas] = useState([]); // Cambiar nombres de estado y variables
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getBodegas();
  }, []);

  const getBodegas = async () => {
    try {
      const response = await axios.get(apiUrl);
      setBodegas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    if (text.trim() === '') {
      getBodegas();
    } else {
      const filteredBodegas = bodegas.filter((bodega) =>
        bodega.nombre.toLowerCase().includes(text.toLowerCase())
      );
      setBodegas(filteredBodegas);
    }
  };

  const handleBodegaClick = (id) => {
    // Llamar a la función onBodegaSeleccionada con el ID de la bodega seleccionada
    onBodegaSeleccionada(id);
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-12'>
          <h2>Lista de Bodegas</h2>
          <div className='input-group mb-3'>
            <input
              type='text'
              className='form-control'
              placeholder='Buscar bodega'
              aria-label='Buscar bodega'
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
                <th>Estado</th>
                <th>Dirección</th>
                <th>Ciudad</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {bodegas.map((bodega, index) => (
                <tr key={bodega.bodegaId}>
                  <td>{index + 1}</td>
                  <td>{bodega.nombre}</td>
                  <td>{bodega.estado}</td>
                  <td>{bodega.direccion}</td>
                  <td>{bodega.ciudad}</td>
                  <td>
                    <button onClick={() => handleBodegaClick(bodega.bodegaId)}>Seleccionar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBodegas;
