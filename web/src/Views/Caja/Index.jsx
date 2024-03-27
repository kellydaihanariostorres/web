import React, { useState, useEffect } from "react";
import axios from "axios";
import RegistroCliente from "./BusquedCliente"; // Importa el componente de registro de cliente

function EnterpriseInfo() {
  const [buscarCliente, setBuscarCliente] = useState(false);
  const [clienteExistente, setClienteExistente] = useState(false);
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [mostrarFormularioRegistro, setMostrarFormularioRegistro] = useState(false);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("https://localhost:7284/api/clientes");
        setClientes(response.data);
        console.log("Clientes cargados:", response.data); // Verificar los clientes cargados en la consola
      } catch (error) {
        console.error("Error al obtener clientes:", error);
        setError("Error al obtener clientes");
      }
    };
    fetchClientes();
  }, []);

  const handleInputChange = (event) => {
    setNumeroDocumento(event.target.value);
  };

  const handleBuscarCliente = () => {
    const clienteEncontrado = clientes.find(
      (cliente) => cliente.numDocumento === parseInt(numeroDocumento.trim())
    );
    console.log("Cliente encontrado:", clienteEncontrado);
    if (clienteEncontrado) {
      setClienteExistente(true);
    } else {
      setClienteExistente(false);
      setMostrarFormularioRegistro(true); // Mostrar el formulario de registro si no se encuentra el cliente
    }
    setBuscarCliente(true);
  };

  const handleCancelarRegistro = () => {
    setBuscarCliente(false);
    setNumeroDocumento("");
    setMostrarFormularioRegistro(false); // Ocultar el formulario de registro al cancelar
  };

  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{
          width: "100%",
          minHeight: "80vh",
          height: "auto",
          display: "flex",
          justifyContent: "center",
          padding: "15px",
          alignItems: "center"
        }}
      >
        <div className="row">
          <div className="col-6">
            <h1>Informacion de factura</h1>
            {/* Resto del código */}
          </div>
          <div className="col-6">
            <h1>Informacion del cliente</h1>
            {buscarCliente && clienteExistente && (
              <>
                <div className="mb-3">
                  <label className="form-label" htmlFor="numeroDocumento">
                    Número de documento:
                  </label>
                  <p>{numeroDocumento}</p>
                </div>
                <p className="text-success mt-2">Cliente encontrado.</p>
              </>
            )}
            {mostrarFormularioRegistro && (
              <RegistroCliente
                numeroDocumento={numeroDocumento}
                onClienteRegistrado={() => setMostrarFormularioRegistro(false)} // Ocultar el formulario al registrar el cliente
              />
            )}
          </div>
        </div>
        {!buscarCliente && (
          <div className="d-grid">
            <input
              type="text"
              className="form-control"
              value={numeroDocumento}
              onChange={handleInputChange}
              placeholder="Ingrese el número de documento"
              aria-label="Número de documento"
              name="numeroDocumento"
              id="numeroDocumento"
            />
            <button type="button" className="btn btn-primary mt-2" onClick={handleBuscarCliente}>
              Buscar Cliente
            </button>
            {error && <p className="text-danger">{error}</p>}
          </div>
        )}
        {buscarCliente && !clienteExistente && !mostrarFormularioRegistro && (
          <div className="d-grid">
            <p className="text-danger mt-2">Cliente no encontrado. Por favor, registre al cliente.</p>
            <button type="button" className="btn btn-primary mt-2" onClick={handleCancelarRegistro}>
              Cancelar
            </button>
          </div>
        )}
      </form>
    </>
  );
}

export default EnterpriseInfo;
