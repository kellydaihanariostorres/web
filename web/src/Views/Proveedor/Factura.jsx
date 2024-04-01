import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManageFacturasProveedor = () => {
  const [facturas, setFacturas] = useState([]);
  const [detalleFactura, setDetalleFactura] = useState(null);
  const [cacheKey, setCacheKey] = useState('');

  useEffect(() => {
    getFacturas();
  }, [cacheKey]); // Se ejecuta cada vez que cacheKey cambia

  const getFacturas = async () => {
    try {
      // Añadir parámetros para manejar la caché
      const response = await axios.get(`https://localhost:7284/api/facturaProveedor?cacheKey=${cacheKey}&forceRefresh=${Date.now()}`);
      const filterFactura = response.data.filter(
        (factura) => factura.estado !== 'Desactivado' && !localStorage.getItem(`eliminado_${factura.idFacturaProveedor}`)
      );
      setFacturas(filterFactura);
    } catch (error) {
      console.error(error);
    }
  };

  const showDetalleFactura = (factura) => {
    setDetalleFactura(factura);
  };

  const desactivarFactura = async (idFacturaProveedor, nombre) => {
    try {
      const factura = await axios.get(`https://localhost:7284/api/facturaProveedor/${idFacturaProveedor}`);
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
      await axios.put(`https://localhost:7284/api/facturaProveedor/${idFacturaProveedor}`, parametros);
      Swal.fire(`Factura ${nombre} desactivada exitosamente`, '', 'success');
      getFacturas(); // Actualizar la lista de facturas después de desactivar una
      setCacheKey(Date.now().toString()); // Actualizar la clave de la caché
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Ha ocurrido un error al desactivar la factura', 'error');
    }
  };

  return (
    <div>
      <table className='table table-bordered'>
        <thead className='thead-dark'>
          <tr>
            <th>#</th>
            <th>ID Factura Proveedor</th>
            <th>Fecha de Generación</th>
            <th>Fecha de Expedición</th>
            <th>Fecha de Vencimiento</th>
            <th>Cantidad</th>
            <th>Total Bruto</th>
            <th>Total Retefuente</th>
            <th>Total Pago</th>
            <th>ID Proveedor</th>
            <th>ID Bodega</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura, index) => (
            <tr key={factura.idFacturaProveedor}>
              <td>{index + 1}</td>
              <td>{factura.idFacturaProveedor}</td>
              <td>{factura.fechageneracion}</td>
              <td>{factura.fechaexpedicion}</td>
              <td>{factura.fechavencimiento}</td>
              <td>{factura.cantidad}</td>
              <td>{factura.totalBruto}</td>
              <td>{factura.totalretefuente}</td>
              <td>{factura.totalpago}</td>
              <td>{factura.idProveedor}</td>
              <td>{factura.bodegaId}</td>
              <td>
                <button className='btn btn-info' onClick={() => showDetalleFactura(factura)}>
                  Ver Detalles
                </button>
                <button className='btn btn-danger' onClick={() => desactivarFactura(factura.idFacturaProveedor, factura.idFacturaProveedor)}>
                  Desactivar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={detalleFactura !== null} onHide={() => setDetalleFactura(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Factura Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detalleFactura && (
            <div>
              <p>ID de Factura Proveedor: {detalleFactura.idFacturaProveedor}</p>
              <p>Fecha de Generación: {detalleFactura.fechageneracion}</p>
              <p>Fecha de Expedición: {detalleFactura.fechaexpedicion}</p>
              <p>Fecha de Vencimiento: {detalleFactura.fechavencimiento}</p>
              <p>Cantidad: {detalleFactura.cantidad}</p>
              <p>Total Bruto: {detalleFactura.totalBruto}</p>
              <p>Total Retefuente: {detalleFactura.totalretefuente}</p>
              <p>Total Pago: {detalleFactura.totalpago}</p>
              <p>ID Proveedor: {detalleFactura.idProveedor}</p>
              <p>ID Bodega: {detalleFactura.bodegaId}</p>
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

export default ManageFacturasProveedor;
