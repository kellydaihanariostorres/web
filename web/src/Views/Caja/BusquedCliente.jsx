// RegistroCliente.jsx
import React, { useState } from "react";
import axios from "axios";

const RegistroCliente = ({ numeroDocumento, onClienteRegistrado }) => {
  const apiUrl = "https://localhost:7284/api/clientes";

  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    tipoDocumento: "",
    numDocumento: numeroDocumento ? numeroDocumento : "",
    correo: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registroExitoso, setRegistroExitoso] = useState(false); // Agregado para controlar el registro exitoso

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCliente({
      ...cliente,
      [name]: value
    });
  };

  const registrarCliente = async () => {
    try {
      setLoading(true);
      const response = await axios.post(apiUrl, cliente);
      const nuevoCliente = response.data;
      onClienteRegistrado(nuevoCliente);
      setRegistroExitoso(true); // Marcar el registro como exitoso
    } catch (error) {
      console.error("Error al registrar el cliente:", error);
      setError("Error al registrar el cliente. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await registrarCliente();
    } catch (error) {
      console.error("Error al registrar el cliente:", error);
      setError("Error al registrar el cliente. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div>
      {error && <p className="text-danger">{error}</p>}
      {registroExitoso && ( // Mostrar mensaje solo si el registro fue exitoso
        <p className="text-success">Cliente registrado exitosamente.</p>
      )}
      <div>
        <h2>Registro de Cliente</h2>
        <form onSubmit={handleFormSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={cliente.nombre}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Apellido:
            <input
              type="text"
              name="apellido"
              value={cliente.apellido}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Edad:
            <input
              type="number"
              name="edad"
              value={cliente.edad}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Tipo de Documento:
            <input
              type="text"
              name="tipoDocumento"
              value={cliente.tipoDocumento}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Número de Documento:
            <input
              type="text"
              name="numDocumento"
              value={cliente.numDocumento}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Correo Electrónico:
            <input
              type="email"
              name="correo"
              value={cliente.correo}
              onChange={handleInputChange}
              required
            />
          </label>
          <button type="button" onClick={handleFormSubmit} disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </button>


        </form>
      </div>
    </div>
  );
};

export default RegistroCliente;
