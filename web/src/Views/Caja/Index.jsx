import React, { useState, useEffect } from "react";
import axios from "axios";
import RegistroCliente from "./BusquedCliente";

function EnterpriseInfo() {
  const [buscarCliente, setBuscarCliente] = useState(false);
  const [clienteExistente, setClienteExistente] = useState(false);
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [mostrarFormularioRegistro, setMostrarFormularioRegistro] = useState(false);
  const [clienteRegistrado, setClienteRegistrado] = useState(null);
  const [fechaActual, setFechaActual] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(""); // Estado para el empleado seleccionado

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("https://localhost:7284/api/clientes");
        setClientes(response.data);
        console.log("Clientes cargados:", response.data);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
        setError("Error al obtener clientes");
      }
    };

    const fetchEmpleados = async () => {
      try {
        const response = await axios.get("https://localhost:7284/api/empleados");
        setEmpleados(response.data);
        console.log("Empleados cargados:", response.data);
      } catch (error) {
        console.error("Error al obtener empleados:", error);
        setError("Error al obtener empleados");
      }
    };

    fetchClientes();
    fetchEmpleados();

    // Obtener la fecha actual al cargar el componente
    const fecha = new Date();
    const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
    setFechaActual(fechaFormateada);
  }, [buscarCliente]);

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
      setClienteRegistrado(clienteEncontrado); // Almacenar los datos del cliente encontrado
    } else {
      setClienteExistente(false);
      setMostrarFormularioRegistro(true);
    }
    setBuscarCliente(true);
  };

  const handleCancelarRegistro = () => {
    setBuscarCliente(false);
    setNumeroDocumento("");
    setMostrarFormularioRegistro(false);
  };

  const handleClienteRegistrado = (cliente) => {
    setBuscarCliente(true);
    setMostrarFormularioRegistro(false);
    setClienteRegistrado(cliente);
  };
  
  const handleEmpleadoChange = (event) => {
    setEmpleadoSeleccionado(event.target.value);
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
            <p>Fecha actual: {fechaActual}</p> 
            <p>Direccion: Calle 57 </p> 
            <p>Telefono:3142678354</p> 
            <div>
              <label htmlFor="empleado">Empleado:</label>
              <select id="empleado" value={empleadoSeleccionado} onChange={handleEmpleadoChange}>
                <option value="">Seleccionar empleado</option>
                {empleados.map((empleado) => (
                  <option key={empleado.empleadoId} value={empleado.empleadoId}>{empleado.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-6">
            <h1>Informacion del cliente</h1>
            {clienteRegistrado && (
              <div>
                <p className="text-success">Cliente registrado exitosamente.</p>
                <p>Número de documento: {clienteRegistrado.numDocumento}</p>
                <p>ID: {clienteRegistrado.clienteId}</p>
              </div>
            )}
            {mostrarFormularioRegistro && (
              <RegistroCliente
                numeroDocumento={numeroDocumento}
                onClienteRegistrado={handleClienteRegistrado}
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
        {!clienteExistente && mostrarFormularioRegistro && ( // Mostrar mensaje solo si no se encontró el cliente y se debe registrar
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
