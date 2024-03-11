import "./SearchResults.css";
import React from 'react';
import SearchResult from './SearchResult';


const SearchResultsList = ({ results, handleClick }) => {
  return (
    <div className="results-list">
      {results.map((result, index) => (
        <SearchResult 
          key={index} 
          result={result} 
          handleClick={handleClick} 
        />
      ))}
    </div>
  );
};

export default SearchResultsList;

