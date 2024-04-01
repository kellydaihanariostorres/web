import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManageFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [detalleFactura, setDetalleFactura] = useState(null);
  const [cacheKey, setCacheKey] = useState('');

  useEffect(() => {
    getFacturas();
  }, [cacheKey]); // Se ejecuta cada vez que cacheKey cambia

  const getFacturas = async () => {
    try {
      // Añadir parámetros para manejar la caché
      const response = await axios.get(`https://localhost:7284/api/factura?cacheKey=${cacheKey}&forceRefresh=${Date.now()}`);
      const filterFactura = response.data.filter(
        (factura) => factura.estado !== 'Desactivado' && !localStorage.getItem(`eliminado_${factura.idFactura}`)
      );
      setFacturas(filterFactura);
    } catch (error) {
      console.error(error);
    }
  };

  const showDetalleFactura = (factura) => {
    setDetalleFactura(factura);
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
            <th>ID Factura</th>
            <th>Fecha de Compra</th>
            <th>IVA Compra</th>
            <th>Subtotal</th>
            <th>Total</th>
            <th>Cliente ID</th>
            <th>Empleado ID</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura, index) => (
            <tr key={factura.idFactura}>
              <td>{index + 1}</td>
              <td>{factura.idFactura}</td>
              <td>{factura.fechaCompra}</td>
              <td>{factura.ivaCompra}</td>
              <td>{factura.subtotal}</td>
              <td>{factura.total}</td>
              <td>{factura.clienteId}</td>
              <td>{factura.empleadoId}</td>
              <td>
                <button className='btn btn-info' onClick={() => showDetalleFactura(factura)}>
                  Ver Detalles
                </button>
                <button className='btn btn-danger' onClick={() => desactivarFactura(factura.idFactura, factura.idFactura)}>
                  Desactivar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
