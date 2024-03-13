
import { FaSearch } from "react-icons/fa";
import React, { useState, useEffect } from 'react';


import "./SearchBars.css";

const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");

  const fetchData = (value) => {
    fetch("https://localhost:7284/api/productos")
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user) => {
          return (
            value &&
            user &&
            user.nombreProducto &&
            user.nombreProducto.toLowerCase().includes(value)
          );
        });
        setResults(results);
      });
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  useEffect(() => {
    // Limpiar el campo de búsqueda cuando cambian los resultados
    setInput("");
  }, [setResults]);

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Buscar producto..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;