import React, { useState } from 'react';
import SearchBar from '../../Components/SearchBar';
import SearchResults from '../../Components/SearchResultslist';

//
const SearchComponent = ({ handleSuggestionClick }) => {
  const [results, setResults] = useState([]);

  const styles = {
    searchContainer: {
      padding: '7vh',
      width: '40%',
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '-20vw',
      minWidth: '200px',
      marginTop: '60px'
    },
    search: {
      height: '100vh',
      width: '100vw',
    }
  };

  // Esta función maneja el clic en un resultado de búsqueda
  const handleClick = (result) => {
    handleSuggestionClick(result); // Llama a la función handleSuggestionClick en el componente padre con el resultado seleccionado
    setResults([]);
  };

  return (
    <div style={styles.search}>
      <div style={styles.searchContainer}>
        <SearchBar setResults={setResults} />
        <SearchResults results={results} handleClick={handleClick} />
      </div>
    </div>
  );
};


export default SearchComponent;
