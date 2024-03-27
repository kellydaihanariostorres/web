import React, { useState } from "react";
import axios from "axios";

const RegistroCliente = ({ numeroDocumento, onClienteRegistrado }) => {
  const apiUrl = "https://localhost:7284/api/clientes"; // URL de la API

  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    tipoDocumento: "",
    numDocumento: numeroDocumento,
    correo: "",
  });

  const [loading, setLoading] = useState(false);
  const [clienteExistente, setClienteExistente] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCliente({
      ...cliente,
      [name]: value,
    });
  };



  const registrarCliente = async () => {
    try {
      setLoading(true);
      // Realizar una llamada a la API para registrar al nuevo cliente
      const response = await axios.post(apiUrl, cliente);
      const nuevoCliente = response.data; // Suponiendo que la API devuelve los datos del cliente recién registrado

      // Llamar a la función proporcionada por el padre para informar que el cliente ha sido registrado
      onClienteRegistrado(nuevoCliente);
      setRegistroExitoso(true);
    } catch (error) {
      console.error("Error al registrar el cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!clienteExistente) {
      registrarCliente();
    }
  };

  return (
    <div>
      {registroExitoso ? (
        <div>
          <p>Registro exitoso del cliente con número de documento: {numeroDocumento}</p>
        </div>
      ) : (
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
              Correo Electrónico:
              <input
                type="email"
                name="correo"
                value={cliente.correo}
                onChange={handleInputChange}
                required
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegistroCliente;
