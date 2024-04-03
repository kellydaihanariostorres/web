import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'bootstrap-icons/font/bootstrap-icons.css';


const ManageFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [detalleFactura, setDetalleFactura] = useState(null);
  const [cacheKey, setCacheKey] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [productos, setProductos] = useState([]);
  


  useEffect(() => {
    getFacturas();
    getProductos();
  }, [cacheKey]); // Se ejecuta cada vez que cacheKey cambia


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getFacturas();
    }, 500); // Retraso de 500 milisegundos
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, cacheKey]); // Agregar searchTerm como dependencia adicional
  

  const getProductos = async () => {
    try {
      const response = await axios.get('https://localhost:7284/api/productos');
      setProductos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  

  const getFacturas = async () => {
    try {
      // Añadir parámetros para manejar la caché
      const response = await axios.get(`https://localhost:7284/api/facturaproveedor?cacheKey=${cacheKey}&forceRefresh=${Date.now()}`);
      const filterFactura = response.data.filter(
        (factura) => factura.estado !== 'Desactivado' && !localStorage.getItem(`eliminado_${factura.idFacturaProveedor}`)
      );
  
      // Obtener nombres de proveedor y bodega
      for (const factura of filterFactura) {
        const proveedor = await axios.get(`https://localhost:7284/api/proveedor/${factura.idProveedor}`);
        factura.nombreProveedor = proveedor.data.nombre;
      
        const bodega = await axios.get(`https://localhost:7284/api/bodegas/${factura.bodegaId}`);
        factura.nombreBodega = bodega.data.nombre;
      }
  
      // Aplicar filtro por nombre del proveedor si searchTerm está presente
      const filteredFacturas = searchTerm ? filterFactura.filter(factura => factura.nombreProveedor.toLowerCase().includes(searchTerm.toLowerCase())) : filterFactura;
  
      setFacturas(filteredFacturas);
    } catch (error) {
      console.error(error);
    }
  };
  
  

// Dentro de la función showDetalleFactura
// Dentro de la función showDetalleFactura
const showDetalleFactura = async (facturaId) => {
  try {
    const detallesResponse = await axios.get(`https://localhost:7284/api/DetalleFacturaproveedor?idFacturaProveedor=${facturaId}`);
    const detalles = detallesResponse.data;
    const detallesConNombres = await Promise.all(detalles.map(async (detalle) => {
      // Asegurarse de que productos esté cargado antes de buscar
      if (productos.length > 0) {
        const producto = productos.find(producto => producto.idProducto === detalle.idProducto);
        const nombreProducto = producto ? producto.nombreProducto : 'Nombre no encontrado';
        return { ...detalle, nombreProducto };
      } else {
        return { ...detalle, nombreProducto: 'Nombre no encontrado' };
      }
    }));
    // Obtener solo los detalles que corresponden al ID de factura proporcionado
    const detallesFacturaSeleccionada = detallesConNombres.filter(detalle => detalle.idFacturaProveedor === facturaId);
    // Crear un objeto que contenga tanto la información de la factura como los detalles
    const factura = facturas.find(factura => factura.idFacturaProveedor === facturaId);
    const facturaConDetalles = { ...factura, detalles: detallesFacturaSeleccionada };
    // Configurar el estado de detalleFactura con el objeto creado
    setDetalleFactura(facturaConDetalles);
  } catch (error) {
    console.error(error);
  }
};





  const desactivarFactura = async (idFactura, nombre) => {
    try {
      const factura = await axios.get(`https://localhost:7284/api/facturaproveedor/${idFactura}`);
      const parametros = {
        idFacturaProveedor: factura.data.idFacturaProveedor,
        fechageneracion: factura.data.fechageneracion,
        fechaexpedicion: factura.data.fechaexpedicion,
        fechavencimiento: factura.data.fechavencimiento,
        cantidad: factura.data.cantidad,
        totalBruto: factura.data.totalBruto,
        totalretefuente: factura.data.totalretefuente,
        totalpago: factura.data.totalpago,
        estado: 'Desactivado',
        idProveedor: factura.data.idProveedor,
        bodegaId: factura.data.bodegaId
      };
      await axios.put(`https://localhost:7284/api/facturaproveedor/${idFactura}`, parametros);
      Swal.fire(`Factura ${nombre} desactivada exitosamente`, '', 'success');
      getFacturas(); // Actualizar la lista de facturas después de desactivar una
      setCacheKey(Date.now().toString()); // Actualizar la clave de la caché
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Ha ocurrido un error al desactivar la factura', 'error');
    }
  };

  // Obtener índices del primer y último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = facturas.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filtrar facturas por el nombre del proveedor
 

  // Estilos de la tabla
  const tableStyles = {
    fontSize: '0.8rem', // Tamaño de la fuente reducido
    padding: '0.25rem' // Espaciado reducido entre celdas
  };

  // Estilos para los botones de paginación
  const paginationButtonStyles = {
    marginRight: '100px',
    background: '#440000',
    color: 'white',

  };

  const filteredFacturas = currentItems.filter(factura =>
    factura.nombreProveedor.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  

  return (
    <div>

      <table className='table table-bordered' style={tableStyles}>
        <thead className='thead-dark'>
          <tr>
            <th style={{ background: '#440000', color: 'white' }}>#</th>
            <th style={{ background: '#440000', color: 'white' }}>ID Factura</th>
            <th style={{ background: '#440000', color: 'white' }}>Fecha de Generación</th>
            <th style={{ background: '#440000', color: 'white' }}>Fecha de Expedición</th>
            <th style={{ background: '#440000', color: 'white' }}>Fecha de Vencimiento</th>
            <th style={{ background: '#440000', color: 'white' }}>Total Bruto</th>
            <th style={{ background: '#440000', color: 'white' }}>Total Retefuente</th>
            <th style={{ background: '#440000', color: 'white' }}>Total Pago</th>
            <th style={{ background: '#440000', color: 'white' }}>Proveedor</th>
            <th style={{ background: '#440000', color: 'white' }}>Bodega</th>
            <th style={{ background: '#440000', color: 'white' }}></th>
          </tr>
        </thead>
        <tbody>
        {filteredFacturas.map((factura, index) => (
          <tr key={factura.idFacturaProveedor}>
            <td style={{ background: '#dadada' }}>{indexOfFirstItem + index + 1}</td>
            <td style={{ background: '#dadada' }}>{factura.idFacturaProveedor}</td>
            <td style={{ background: '#dadada' }}>{factura.fechageneracion}</td>
            <td style={{ background: '#dadada' }}>{factura.fechaexpedicion}</td>
            <td style={{ background: '#dadada' }}>{factura.fechavencimiento}</td>
            <td style={{ background: '#dadada' }}>{factura.totalBruto}</td>
            <td style={{ background: '#dadada' }}>{factura.totalretefuente}</td>
            <td style={{ background: '#dadada' }}>{factura.totalpago}</td>
            <td style={{ background: '#dadada' }}>{factura.nombreProveedor}</td> 
            <td style={{ background: '#dadada' }}>{factura.nombreBodega}</td> 
            <td style={{ background: '#dadada' }}>
            <button
                onClick={() => showDetalleFactura(factura.idFacturaProveedor)}
                className='btn btn-danger'
                style={{ background: '#440000', color: 'white' }}
            >
                <i className='fa-solid fa-eye'></i>

            </button>
                        <button
                          onClick={() => desactivarFactura(factura.idFacturaProveedor, factura.idFacturaProveedor)}
                          className='btn btn-danger'
                          style={{ background: '#440000', color: 'white' }}
                        >
                          <i className='fa-solid fa-trash'></i>
                        </button>

              
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      {/* Botones de paginación */}
      <ul className="pagination">
        <li className="page-item">
          <Button
            className="page-link"
            onClick={() => paginate(currentPage === 1 ? 1 : currentPage - 1)}
            style={paginationButtonStyles}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
        </li>
        <li className="page-item">
          <Button
            className="page-link"
            onClick={() => paginate(currentPage + 1)}
            style={paginationButtonStyles}
            disabled={currentPage === Math.ceil(facturas.length / itemsPerPage)}
          >
            Siguiente
          </Button>
        </li>
      </ul>

      <Modal show={detalleFactura !== null} onHide={() => setDetalleFactura(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detalleFactura && (
            <div>
              <p>ID de Factura: {detalleFactura.idFacturaProveedor}</p>
              <p>Fecha de Generación: {detalleFactura.fechageneracion}</p>
              <p>Fecha de Expedición: {detalleFactura.fechaexpedicion}</p>
              <p>Fecha de Vencimiento: {detalleFactura.fechavencimiento}</p>
              <p>Proveedor: {detalleFactura.nombreProveedor}</p>
              <p>Bodega: {detalleFactura.nombreBodega}</p>
              <p>Total Bruto: {detalleFactura.totalBruto}</p>
              <p>Total retefuente: {detalleFactura.totalretefuente}</p>
              <p>Total: {detalleFactura.totalpago}</p>
              <p>Detalles:</p>
              <table className="table">
              <thead>
                <tr>
                  <th>Nombre Producto</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {detalleFactura.detalles && detalleFactura.detalles.map((detalle, index) => (
                  <tr key={index}>
                    <td>{detalle.nombreProducto}</td>
                    <td>{detalle.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setDetalleFactura(null)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageFacturas;
