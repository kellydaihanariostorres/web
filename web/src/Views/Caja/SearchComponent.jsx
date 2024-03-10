import React, { useState } from 'react';
import SearchBar from '../../Components/SearchBar';
import SearchResults from '../../Components/SearchResultslist';

//
const SearchComponent = () => {
  const [results,setResults]=useState([]);

  const styles = {
    searchContainer: {
      padding: '7vh',
      width: '40%',
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '-30vw',
      minWidth: '200px',
    },
    search: {
      
      height: '100vh',
      width: '100vw',
    }
  };

  return (
    <div style={styles.search}>
      <div style={styles.searchContainer}>
        <SearchBar setResults={setResults}/>
        <SearchResults results={results} />
      </div>
    </div>
  );
};

export default SearchComponent;
