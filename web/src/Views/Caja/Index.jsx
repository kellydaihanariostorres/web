
import React, { useState } from "react";
import RegistroCliente from "./BusquedCliente"; // Importa el componente RegistroCliente

function EnterpriseInfo() {
  const [buscarCliente, setBuscarCliente] = useState(false); // Estado para controlar si se está buscando un cliente existente o no
  const [clienteExistente, setClienteExistente] = useState(false); // Estado para controlar si se ha encontrado un cliente existente
  const [numeroDocumento, setNumeroDocumento] = useState(""); // Estado para almacenar el número de documento ingresado
  const [clienteRegistrado, setClienteRegistrado] = useState(false); // Estado para controlar si el cliente ha sido registrado

  const handleInputChange = (event) => {
    setNumeroDocumento(event.target.value);
  };

  const handleBuscarCliente = async () => {
    // Aquí debes realizar la lógica de búsqueda del cliente en una base de datos real
    // En esta simulación, simplemente verificamos si el campo de número de documento está vacío
    const clienteExiste = Math.random() < 0.5; // Simulación aleatoria de resultado de búsqueda
    setClienteExistente(clienteExiste);
    setBuscarCliente(true);
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
            {buscarCliente ? (
              clienteExistente ? (
                <>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="numeroDocumento">
                      Número de documento:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={numeroDocumento}
                      onChange={handleInputChange}
                      placeholder="Ingrese el número de documento"
                      aria-label="Número de documento"
                      name="numeroDocumento"
                      id="numeroDocumento"
                      readOnly
                    />
                  </div>
                  <p className="text-success mt-2">Cliente existente. No es necesario registrarlo.</p>
                </>
              ) : (
                <RegistroCliente
                  numeroDocumento={numeroDocumento}
                  onClienteRegistrado={setClienteRegistrado}
                />
              )
            ) : (
              <div className="mb-3">
                <label className="form-label" htmlFor="numeroDocumento">
                  Número de documento:
                </label>
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
              </div>
            )}
          </div>
        </div>
        {!clienteExistente && !clienteRegistrado && !buscarCliente && (
          <div className="d-grid">
            <button type="button" className="btn btn-primary" onClick={handleBuscarCliente}>
              Buscar Cliente
            </button>
          </div>
        )}
      </form>
    </>
  );
}

export default EnterpriseInfo;
