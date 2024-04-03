import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
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
  }, [cacheKey]); 

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getFacturas();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, cacheKey]);

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
      const response = await axios.get(`https://localhost:7284/api/factura?cacheKey=${cacheKey}&forceRefresh=${Date.now()}`);
      const filterFactura = response.data.filter(
        (factura) => factura.estado !== 'Desactivado' && !localStorage.getItem(`eliminado_${factura.idFactura}`)
      );

      const filteredFacturas = searchTerm ? filterFactura.filter(factura => factura.clienteId.toLowerCase().includes(searchTerm.toLowerCase())) : filterFactura;

      setFacturas(filteredFacturas);
    } catch (error) {
      console.error(error);
    }
  };

  const showDetalleFactura = async (facturaId) => {
    try {
      const detallesResponse = await axios.get(`https://localhost:7284/api/DetalleFactura?idFactura=${facturaId}`);
      const detalles = detallesResponse.data;
      const detallesConNombres = await Promise.all(detalles.map(async (detalle) => {
        if (productos.length > 0) {
          const producto = productos.find(producto => producto.idProducto === detalle.idProducto);
          const nombreProducto = producto ? producto.nombreProducto : 'Nombre no encontrado';
          return { ...detalle, nombreProducto };
        } else {
          return { ...detalle, nombreProducto: 'Nombre no encontrado' };
        }
      }));

      const detallesFacturaSeleccionada = detallesConNombres.filter(detalle => detalle.idFactura === facturaId);
      const factura = facturas.find(factura => factura.idFactura === facturaId);
      const facturaConDetalles = { ...factura, detalles: detallesFacturaSeleccionada };
      setDetalleFactura(facturaConDetalles);
    } catch (error) {
      console.error(error);
    }
  };

  const desactivarFactura = async (idFactura, nombre) => {
    try {
      const factura = await axios.get(`https://localhost:7284/api/factura/${idFactura}`);
      const parametros = {
        idFactura: factura.data.idFactura,
        fechaCompra: factura.data.fechaCompra,
        ivaCompra: factura.data.ivaCompra,
        subtotal: factura.data.subtotal,
        total: factura.data.total,
        estado: 'Desactivado',
        clienteId: factura.data.clienteId,
        empleadoId: factura.data.empleadoId
      };
      await axios.put(`https://localhost:7284/api/factura/${idFactura}`, parametros);
      Swal.fire(`Factura ${nombre} desactivada exitosamente`, '', 'success');
      getFacturas();
      setCacheKey(Date.now().toString());
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Ha ocurrido un error al desactivar la factura', 'error');
    }
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = facturas.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const tableStyles = {
    fontSize: '0.8rem',
    padding: '0.25rem'
  };

  const paginationButtonStyles = {
    marginRight: '100px',
    background: '#440000',
    color: 'white',
  };

  const filteredFacturas = currentItems.filter(factura =>
    factura.clienteId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <table className='table table-bordered' style={tableStyles}>
        <thead className='thead-dark'>
          <tr>
            <th style={{ background: '#440000', color: 'white' }}>#</th>
            <th style={{ background: '#440000', color: 'white' }}>ID Factura</th>
            <th style={{ background: '#440000', color: 'white' }}>Fecha de Compra</th>
            <th style={{ background: '#440000', color: 'white' }}>IVA Compra</th>
            <th style={{ background: '#440000', color: 'white' }}>Subtotal</th>
            <th style={{ background: '#440000', color: 'white' }}>Total</th>
            <th style={{ background: '#440000', color: 'white' }}>Cliente ID</th>
            <th style={{ background: '#440000', color: 'white' }}>Empleado ID</th>
            <th style={{ background: '#440000', color: 'white' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredFacturas.map((factura, index) => (
            <tr key={factura.idFactura}>
              <td style={{ background: '#dadada' }}>{indexOfFirstItem + index + 1}</td>
              <td style={{ background: '#dadada' }}>{factura.idFactura}</td>
              <td style={{ background: '#dadada' }}>{factura.fechaCompra}</td>
              <td style={{ background: '#dadada' }}>{factura.ivaCompra}</td>
              <td style={{ background: '#dadada' }}>{factura.subtotal}</td>
              <td style={{ background: '#dadada' }}>{factura.total}</td>
              <td style={{ background: '#dadada' }}>{factura.clienteId}</td>
              <td style={{ background: '#dadada' }}>{factura.empleadoId}</td>
              <td style={{ background: '#dadada' }}>
                <button
                onClick={() => showDetalleFactura(factura.idFactura)}
                className='btn btn-danger'
                style={{ background: '#440000', color: 'white' }}
                >
                <i className='fa-solid fa-eye'></i>
               </button>

               <button
                onClick={() => desactivarFactura(factura.idFactura, factura.idFactura)}
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
              <p>ID de Factura: {detalleFactura.idFactura}</p>
              <p>Fecha de Compra: {detalleFactura.fechaCompra}</p>
              <p>IVA Compra: {detalleFactura.ivaCompra}</p>
              <p>Subtotal: {detalleFactura.subtotal}</p>
              <p>Total: {detalleFactura.total}</p>
              <p>Cliente ID: {detalleFactura.clienteId}</p>
              <p>Empleado ID: {detalleFactura.empleadoId}</p>
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
