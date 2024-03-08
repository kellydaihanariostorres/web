import React, { useState } from 'react';

const SearchComponent = ({ productList, handleSuggestionClick }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleSearch = (event) => {
    // Obtener el término de búsqueda del evento
    const searchTerm = event.target.value;
    
    // Verificar si miLista está definida y tiene elementos
    if (miLista && miLista.length > 0) {
      // Filtrar miLista según el término de búsqueda
      const filteredList = miLista.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Establecer los resultados filtrados en el estado
      setFilteredResults(filteredList);
    } else {
      // Si la lista está vacía o undefined, establecer los resultados filtrados como un array vacío
      setFilteredResults([]);
    }
  };
  
  

  return (
    <div>
      <input
        type='text'
        placeholder='Buscar producto'
        onChange={(e) => handleSearch(e.target.value)}
        value={searchText}
      />
      <ul>
        {filteredSuggestions.map((suggestion) => (
          <li key={suggestion.idProducto} onClick={() => handleSuggestionClick(suggestion)}>
            {suggestion.nombreProducto}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;
