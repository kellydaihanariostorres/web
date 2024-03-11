import React, { useEffect } from 'react';
import { sendRequest } from '../../functions';

const Venta = ({ venta, clienteId, empleadoId }) => {
  // Extrae los datos necesarios para la venta
  const { idFactura, fechaCompra, ivaCompra, subtotal, total, productList } = venta;

  useEffect(() => {
    const enviarVenta = async () => {
      try {
        // Envía la venta a la API
        await sendRequest('POST', {
          idFactura,
          fechaCompra,
          ivaCompra,
          subtotal,
          total,
          productList,
          clienteId,
          empleadoId
        }, 'https://localhost:7284/api/factura');
      } catch (error) {
        console.error('Error al enviar la venta:', error);
      }
    };

    // Llama a la función para enviar la venta cuando se monte o renderice el componente
    enviarVenta();
  }, [fechaCompra, ivaCompra, subtotal, total, productList, clienteId, empleadoId]);

  return (
    <div>
      <h3>Factura</h3>
      <p>Fecha de Compra: {fechaCompra}</p>
      <p>ID del Cliente: {clienteId}</p>
      <p>IVA: {ivaCompra}</p>
      <p>Subtotal: {subtotal}</p>
      <p>Total: {total}</p>
      <h4>Lista de Productos</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre del Producto</th>
            <th>Precio Unitario</th>
          </tr>
        </thead>
        <tbody>
          {productList.map((product, index) => (
            <tr key={index}>
              <td>{product.nombreProducto}</td>
              <td>{product.precioProducto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Venta;
