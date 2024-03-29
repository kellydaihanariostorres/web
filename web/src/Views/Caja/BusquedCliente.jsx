import React, { useState } from "react";
import axios from "axios";

const RegistroCliente = ({ numeroDocumento, onClienteRegistrado }) => {
  const apiUrl = "https://localhost:7284/api/clientes";

  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    tipoDocumento: "CC",
    numDocumento: numeroDocumento ? numeroDocumento : "",
    correo: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;
  
    if (name === "nombre" || name === "apellido") {
      newValue = value.replace(/[^a-zA-Z\s]/g, "");
    } else if (name === "edad") {
      newValue = value.replace(/\D/g, "");
      const parsedValue = parseInt(newValue);
      if (isNaN(parsedValue) || parsedValue < 18) {
        setError("La edad debe ser igual o mayor a 18 años.");
      } else {
        setError(null);
      }
    } else if (name === "numDocumento") {
      newValue = value.replace(/\D/g, "");
    } else if (name === "tipoDocumento") {
      newValue = value.toUpperCase() === "CC" ? "CC" : "";
    } else if (name === "correo") {
      newValue = value.trim();
      const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        newValue
      );
      if (!isValidEmail && newValue !== "") {
        setError("El correo electrónico ingresado no es válido.");
      } else {
        setError(null);
      }
    }

    setCliente({
      ...cliente,
      [name]: newValue
    });
  };

  const registrarCliente = async () => {
    try {
      setLoading(true);
      const response = await axios.post(apiUrl, cliente);
      const nuevoCliente = response.data;
      onClienteRegistrado(nuevoCliente);
      setRegistroExitoso(true);
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
      if (!cliente.nombre || !cliente.apellido || !cliente.edad || !cliente.numDocumento || !cliente.correo) {
        setError("Por favor complete todos los campos.");
        return;
      }

      await registrarCliente();
    } catch (error) {
      console.error("Error al registrar el cliente:", error);
      setError("Error al registrar el cliente. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div>
      {error && <p className="text-danger">{error}</p>}
      {registroExitoso && (
        <p className="text-success">Cliente registrado exitosamente.</p>
      )}
      <div>
        <h2>Registro de Cliente</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="nombre" className="form-label">Nombre:</label>
              <input
                type="text"
                name="nombre"
                className="form-control form-control-sm"
                id="nombre"
                placeholder="Ingrese el Nombre"
                value={cliente.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="apellido" className="form-label">Apellido:</label>
              <input
                type="text"
                name="apellido"
                className="form-control form-control-sm"
                id="apellido"
                placeholder="Ingrese el Apellido"
                value={cliente.apellido}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="edad" className="form-label">Edad:</label>
              <input
                type="text"
                name="edad"
                className="form-control"
                id="edad"
                placeholder="Ingrese la Edad"
                value={cliente.edad}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="tipoDocumento" className="form-label">Tipo de Documento:</label>
              <input
                type="text"
                name="tipoDocumento"
                className="form-control"
                id="tipoDocumento"
                placeholder="Ingrese el Tipo de documento"
                value={cliente.tipoDocumento}
                onChange={handleInputChange}
                disabled
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="numDocumento" className="form-label">Número de Documento:</label>
              <input
                type="text"
                name="numDocumento"
                className="form-control"
                id="numDocumento"
                placeholder="Ingrese el número de documento"
                value={cliente.numDocumento}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="correo" className="form-label">Correo Electrónico:</label>
              <input
                type="email"
                name="correo"
                className="form-control"
                id="correo"
                placeholder="Ingrese el correo"
                value={cliente.correo}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success mt-2" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistroCliente;
