import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Detallefactura from './Detallefactura';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function EnterpriseInfo() {
  const [buscarProveedor, setBuscarProveedor] = useState(false);
  const [proveedorExistente, setProveedorExistente] = useState(false);
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState(null);
  const [mostrarFormularioRegistro, setMostrarFormularioRegistro] = useState(false);
  const [proveedorRegistrado, setProveedorRegistrado] = useState(null);
  const [fechaActual, setFechaActual] = useState("");
  const [bodegas, setBodegas] = useState([]);
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState(""); 
  const [mostrarDetalleFactura, setMostrarDetalleFactura] = useState(false);  
  const [idFacturaCreada, setIdFacturaCreada] = useState("");
  const [mostrarBotones, setMostrarBotones] = useState(true); 
  const MySwal = withReactContent(Swal);
  const [documentoProveedorEncontrado, setDocumentoProveedorEncontrado] = useState("");
  const [facturaCreada, setFacturaCreada] = useState(false);
  const [fechaexpedicion, setFechaexpedicion] = useState(new Date());
  const [fechavencimiento, setFechavencimiento] = useState(new Date());
  const [idProveedor, setIdProveedor] = useState("");

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get("https://localhost:7284/api/proveedor", {
          headers: {
            "Cache-Control": "no-cache"
          }
        });
        setProveedores(response.data);
        console.log("Proveedores cargados:", response.data);
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        setError("Error al obtener proveedores");
      }
    };

    const fetchBodegas = async () => {
      try {
        const response = await axios.get("https://localhost:7284/api/bodegas", {
          headers: {
            "Cache-Control": "no-cache"
          }
        });
    
        // Filtrar bodegas activas
        const bodegasActivas = response.data.filter(bodega => bodega.estado === 'Activo');
    
        setBodegas(bodegasActivas);
        console.log("Bodegas activas cargadas:", bodegasActivas);
      } catch (error) {
        console.error("Error al obtener bodegas:", error);
        setError("Error al obtener bodegas");
      }
    };
    

    fetchProveedores();
    fetchBodegas();

    // Obtener la fecha actual al cargar el componente
    const fecha = new Date();
    const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
    setFechaActual(fechaFormateada);
  }, [buscarProveedor]);

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
      if (!proveedorRegistrado || !bodegaSeleccionada) {
        MySwal.fire({
          icon: 'warning',
          title: '¡Atención!',
          text: 'Por favor, selecciona un proveedor y una bodega antes de crear la factura.',
        });
        return;
      }
  
      // Obtener la fecha actual para la fecha de generación
      const fechaGeneracion = new Date().toISOString();
  
      // Generar una factura temporal con valores temporales
      const facturaTemporal = {
        idFacturaProveedor: "85ab7ca7-664d-4b20-b5de-024705497d4a",
        fechageneracion: fechaGeneracion,
        fechaexpedicion: fechaexpedicion.toISOString(),
        fechavencimiento: fechavencimiento.toISOString(),
        cantidad: 1,
        totalBruto: 200000,
        totalretefuente: 10000,
        totalpago: 210000,
        estado: "Activo",
        idProveedor: proveedorRegistrado.idProveedor, // Incluir el ID del proveedor correctamente
        bodegaId: bodegaSeleccionada,
      };
  
      // Enviar la factura temporal al servidor para su creación
      const response = await axios.post("https://localhost:7284/api/facturaproveedor", facturaTemporal);
  
      // Si la creación de la factura fue exitosa, puedes hacer algo con la respuesta si es necesario
      console.log("Factura creada:", response.data);
      MySwal.fire({
        icon: 'success',
        title: 'Creado exitosamente',
        text: 'Puede comenzar su factura.',
      });
  
      setIdFacturaCreada(response.data.idFacturaProveedor);
      setMostrarDetalleFactura(true);
      setMostrarBotones(false);
      setFacturaCreada(true);
  
    } catch (error) {
      console.error("Error al crear la factura:", error);
      MySwal.fire({
        icon: 'error',
        title: 'Error al crear la factura',
        text: 'Hubo un error al crear la factura. Por favor, inténtalo de nuevo.',
      });
    }
  };
  
  
  
  const handleBuscarProveedor = () => {
    const proveedorEncontrado = proveedores.find(
      (proveedor) => proveedor.numDocumento === parseInt(numeroDocumento.trim())
    );
  
    console.log("Proveedor encontrado:", proveedorEncontrado);
  
    if (proveedorEncontrado) {
      if (proveedorEncontrado.estado === 'Desactivado') {
        console.log('Proveedor desactivado');
        setProveedorExistente(false);
        setDocumentoProveedorEncontrado(proveedorEncontrado.numDocumento);
      } else {
        console.log('Proveedor activo');
        setProveedorExistente(true);
        setProveedorRegistrado(proveedorEncontrado);
        setIdProveedor(proveedorEncontrado.idProveedor); // <-- Aquí establece el ID del proveedor
      }
    } else {
      console.log('Proveedor no encontrado. Mostrando formulario de registro.');
      setProveedorExistente(false);
      setMostrarFormularioRegistro(true);
    }
    
    setBuscarProveedor(true);
  };
  
  const handleCancelarRegistro = () => {
    setBuscarProveedor(false);
    setNumeroDocumento("");
    setMostrarFormularioRegistro(false);
  };

 
  
  const handleBodegaChange = (event) => {
    setBodegaSeleccionada(event.target.value);
  };

  const handleCancelarProveedor = () => {
    setProveedorRegistrado(null);
    setBuscarProveedor(false);
    setProveedorExistente(false);
    setMostrarBotones(true);
    setDocumentoProveedorEncontrado(""); // Reset documentoProveedorEncontrado
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
              <p>Fecha de vencimiento</p>
              <div>
                  <DatePicker
                    className='form-control'
                    selected={fechavencimiento}
                    onChange={(date) => setFechavencimiento(date)}
                    dateFormat='yyyy-MM-dd'
                    minDate={new Date()}// Establece la fecha mínima como la fecha actual
                  />
              </div>
            </div>
            <div className="col-md-6">
              <p>Fecha de expedicion:</p>
              <div>
                  <DatePicker
                    className='form-control'
                    selected={fechaexpedicion}
                    onChange={(date) => setFechaexpedicion(date)}
                    dateFormat='yyyy-MM-dd'
                    minDate={new Date()}// Establece la fecha mínima como la fecha actual
                  />
              </div>
            </div>
            
          </div>
          <div className="row">
            <div className="col-md-6">
              <p>Telefono:</p>
              <p style={{ backgroundColor: "white", borderRadius: "10px", padding: "10px",border: "1px solid black" }}>3142678354</p>
            </div>
            <div className="col-md-6">
              <p>Bodega:</p>
              <select
                  id="bodega"
                  value={bodegaSeleccionada}
                  onChange={handleBodegaChange}
                  disabled={facturaCreada} // Aquí deshabilitamos el campo si la factura ha sido creada
                  style={{ backgroundColor: "white", borderRadius: "10px", padding: "10px" }}
                >
                  <option value="">Seleccionar bodega</option>
                  {bodegas.map((bodega) => (
                    <option key={bodega.bodegaId} value={bodega.bodegaId}>{bodega.nombre}</option>
                  ))}
                </select>
            </div>
          </div>
        </div>


          <div className="col-md-6 mb-3">
            <h1>Informacion del proveedor</h1>
            {proveedorRegistrado && (
              <div>
                <p className="text-success">Proveedor existente.</p>
                <p>Número de documento: </p>
                <p style={{ backgroundColor: "white", borderRadius: "10px", padding: "10px",border: "1px solid black" }}>{proveedorRegistrado.numDocumento}</p>
                {mostrarBotones && ( // Ocultar el botón "Quitar Proveedor" cuando mostrarBotones sea falso
                  <button type="button" className="btn btn-primary mt-2" onClick={handleCancelarProveedor}>
                    Quitar Proveedor
                  </button>
                )}

                
              </div>
            )}
          {!proveedorExistente && (
              <div style={{ marginTop: '10px' }}>
                {documentoProveedorEncontrado && (
                  <div>
                    <p className="text-danger">
                      El proveedor con número de documento {documentoProveedorEncontrado} está desactivado.
                    </p>
                    {mostrarBotones && ( // Ocultar el botón "Quitar Proveedor" cuando mostrarBotones sea falso
                      <button type="button" className="btn btn-primary mt-2" onClick={handleCancelarProveedor}>
                        Quitar 
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {!buscarProveedor && (
              <div className="d-grid">
                <p>Buscar proveedor</p>
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
                <button type="button" className="btn btn-primary mt-2" onClick={handleBuscarProveedor}>
                  Buscar proveedor
                </button>
                {error && <p className="text-danger">{error}</p>}
              </div>
            )}  

            {!proveedorExistente && mostrarFormularioRegistro && ( // Mostrar mensaje solo si no se encontró el proveedor y se debe registrar
              <div className="d-grid">
                <p className="text-danger mt-2">Proveedor no encontrado. Por favor, registre al proveedor.</p>
                <button type="button" className="btn btn-primary mt-2" onClick={handleCancelarRegistro}>
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        
        <div style={{ padding: '10px', width: '104%', marginLeft: '-2.8%', margin: "0 auto"  }}>
            {mostrarDetalleFactura && idFacturaCreada && ( // Verificar que idFacturaCreada no esté vacío
        // Pasar el idFacturaCreada como prop al componente Detallefactura
                <div style={{ border: "1px solid white", backgroundColor: "white", boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)", padding: '-5vh', }}>
                    <Detallefactura idFacturaProveedor={idFacturaCreada} /> {/* Asegurarse de que el nombre del prop sea idFacturaProveedor */}
                </div>
            )}

        </div>
 
        {mostrarBotones && ( // Mostrar los botones solo si mostrarBotones es verdadero
          <div>
            <button type="button" className="btn btn-primary mt-2" onClick={crearFactura}>
              Comenzar Factura
            </button>
          </div>
        )}     
      </form>
    </>
  );
}

export default EnterpriseInfo;