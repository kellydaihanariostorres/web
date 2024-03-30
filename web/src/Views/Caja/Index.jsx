import React, { useState, useEffect } from "react";
import axios from "axios";
import RegistroCliente from "./BusquedCliente";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Detallefactura from './Detallefactura';


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
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(""); 
  const [mostrarDetalleFactura, setMostrarDetalleFactura] = useState(false);  
  const MySwal = withReactContent(Swal);
 


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
    const input = event.target.value;
    // Expresión regular para permitir solo números
    const onlyNumbers = /^[0-9\b]+$/;
    if (input === "" || onlyNumbers.test(input)) {
      setNumeroDocumento(input);
    }
  };
  

  const crearFactura = async () => {
    try {
      if (!clienteRegistrado || !empleadoSeleccionado) {
        MySwal.fire({
          icon: 'warning',
          title: '¡Atención!',
          text: 'Por favor, selecciona un cliente y un empleado antes de crear la factura.',
        });
        return;
      }
  
      // Generar una factura temporal con valores temporales
      const facturaTemporal = {
        idFactura: "64b512e7-46ae-4989-a049-a446118099c4",
        fechaCompra: new Date().toISOString(),
        ivaCompra: 1, // Valor temporal
        subtotal: 1, // Valor temporal
        total: 1, // Valor temporal
        clienteId: clienteRegistrado.clienteId,
        empleadoId: empleadoSeleccionado
      };
  
      // Enviar la factura temporal al servidor para su creación
      const response = await axios.post("https://localhost:7284/api/factura", facturaTemporal);
  
      // Si la creación de la factura fue exitosa, puedes hacer algo con la respuesta si es necesario
      console.log("Factura creada:", response.data);
      MySwal.fire({
        icon: 'success',
        title: 'creado exitosamente',
        text: 'Puede comenzar su factura.',
      });

      setMostrarDetalleFactura(true);
      
    } catch (error) {
      console.error("Error al crear la factura:", error);
      MySwal.fire({
        icon: 'error',
        title: 'Error al crear la factura',
        text: 'Hubo un error al crear la factura. Por favor, inténtalo de nuevo.',
      });
    }
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

  const handleCancelarCliente = () => {
    setClienteRegistrado(null);
    setBuscarCliente(false); // Esto vuelve a mostrar la sección de buscar cliente
  };

  
  

  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{
          width: "100%",
          minHeight: "80vh",
          height: "auto",
          justifyContent: "center",
          padding: "-135px",
          alignItems: "center",
         
        }}
      >
        <div className="row" style={{border: "1px solid white", boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)", backgroundColor: "white" }} >
        <div className="col-md-6 mb-3">
          <h1>Informacion de factura</h1>
          <div className="row">
            <div className="col-md-6">
              <p>Fecha actual:</p>
              <p style={{ backgroundColor: "white", borderRadius: "10px", padding: "10px", border: "1px solid black"}}>{fechaActual}</p>
            </div>
            <div className="col-md-6">
              <p>Direccion:</p>
              <p style={{ backgroundColor: "white", borderRadius: "10px", padding: "10px", border: "1px solid black"}}>Calle 57</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <p>Telefono:</p>
              <p style={{ backgroundColor: "white", borderRadius: "10px", padding: "10px",border: "1px solid black" }}>3142678354</p>
            </div>
            <div className="col-md-6">
              <p>Empleado:</p>
              <select id="empleado" value={empleadoSeleccionado} onChange={handleEmpleadoChange} style={{ backgroundColor: "white", borderRadius: "10px", padding: "10px" }}>
                <option value="">Seleccionar empleado</option>
                {empleados.map((empleado) => (
                  <option key={empleado.empleadoId} value={empleado.empleadoId}>{empleado.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>


          <div className="col-md-6 mb-3">
            <h1>Informacion del cliente</h1>
            {clienteRegistrado && (
              <div>
                <p className="text-success">Cliente existente.</p>
                <p>Número de documento: </p>
                <p style={{ backgroundColor: "white", borderRadius: "10px", padding: "10px",border: "1px solid black" }}>{clienteRegistrado.numDocumento}</p>
                <button type="button" className="btn btn-primary mt-2" onClick={handleCancelarCliente}>
                  Quitar Cliente
                </button>

                
              </div>
            )}
            {mostrarFormularioRegistro && (
              <RegistroCliente
                numeroDocumento={numeroDocumento}
                onClienteRegistrado={handleClienteRegistrado}
              />
            )}

            {!buscarCliente && (
              <div className="d-grid">
                <p>Buscar cliente</p>
                <input
                  type="text"
                  className="form-control"
                  value={numeroDocumento}
                  onChange={handleInputChange}
                  placeholder="Ingrese el número de documento"
                  aria-label="Número de documento"
                  name="numeroDocumento"
                  id="numeroDocumento"
                  style={{  border: "1px solid black"}}
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
          </div>
        </div>

        
        <div style={{ padding: '10px', width: '107%', marginLeft: '-3%', margin: "0 auto"  }}>
            {mostrarDetalleFactura && (
                // Mostrar la vista de detalle de factura si se activa el estado
                <div style={{ border: "1px solid white", backgroundColor: "white", boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)", padding: '-5vh', }}>
                    <Detallefactura />
                </div>
            )}
        </div>
 
          <div>
            <button type="button" className="btn btn-primary mt-2" onClick={crearFactura}>
              Comensar Factura
            </button>
          </div>     
      </form>
    </>
  );
}

export default EnterpriseInfo;