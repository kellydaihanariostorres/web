import React, { useEffect } from 'react';
import { sendRequest } from '../../functions';

const Venta = ({ venta }) => {
  // Extrae los datos necesarios para la venta
  const { id, fechaCompra, ivaCompra, subtotal, total, productList } = venta;

  useEffect(() => {
    const enviarVenta = async () => {
      try {
        // Envía la venta a la API
        await sendRequest('POST', { id, fechaCompra, ivaCompra, subtotal, total }, 'https://localhost:7284/api/factura');
      } catch (error) {
        console.error('Error al enviar la venta:', error);
      }
    };

    // Llama a la función para enviar la venta cuando se monte o renderice el componente
    enviarVenta();
  }, [venta]);


  return (
    <div>
      <h3>Factura</h3>
      <p>ID: {id}</p>
      <p>Fecha de Compra: {fechaCompra}</p>
      <p>IVA: {ivaCompra}</p>
      <p>Subtotal: {subtotal}</p>
      <p>Total: {total}</p>
      <h4>Lista de Productos</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {productList.map((product, index) => (
            <tr key={index}>
              <td>{product.productName}</td>
              <td>{product.productPrice}</td>
              <td>{product.productQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Venta;
