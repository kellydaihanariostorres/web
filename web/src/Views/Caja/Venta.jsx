import React, { useEffect, useState } from 'react';

const Venta = ({ venta, clienteId, empleadoId }) => {
  const { fechaCompra, ivaCompra, subtotal, total, productList } = venta;
  const [ventaExitosa, setVentaExitosa] = useState(false);

  useEffect(() => {
    const enviarVenta = async () => {
      try {
        let ventaExitosa = true;
        for (const producto of productList) {
          const ventaData = {
            fechaCompra: new Date(fechaCompra).toISOString(),
            ivaCompra: parseFloat(ivaCompra),
            subtotal: parseFloat(subtotal),
            total: parseFloat(total),
            idProducto: producto.idProducto,
            cantidad: producto.cantidad,
            clienteId: clienteId,
            empleadoId: empleadoId
          };

          const response = await fetch('https://localhost:7284/api/factura', {
            method: 'POST',
            body: JSON.stringify(ventaData),
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 10000
          });

          if (!response.ok) {
            ventaExitosa = false;
            const errorData = await response.json();
            console.error('Hubo un error al registrar la venta:', errorData.message);
          }
        }

        if (ventaExitosa) {
          console.log('La venta se ha registrado correctamente.');
          setVentaExitosa(true); // Indicar que la venta fue exitosa
        } else {
          alert('Hubo un error al registrar la venta. Por favor, inténtelo de nuevo.');
        }
      } catch (error) {
        console.error('Error al enviar la venta:', error);
        alert('Hubo un error al enviar la venta. Por favor, inténtelo de nuevo.');
      }
    };

    enviarVenta();
  }, [venta, clienteId, empleadoId]);

  // Función para limpiar el 
  // Dentro del componente Venta
const limpiarFormatoFactura = () => {
  setVentaExitosa(false); // Reiniciar el estado de venta exitosa
  // Limpiar otros elementos del formato de factura si es necesario
  setVentaConfirmada(null); // Reiniciar la venta confirmada
};


  return (
    <div>
      {ventaExitosa && (
        <div className="alert alert-success" role="alert">
          La venta se ha registrado correctamente.
        </div>
      )}
      <h3>Factura</h3>
      <p>Fecha de Compra: {fechaCompra}</p>
      <p>ID Empleado: {empleadoId}</p>
      <p>ID del Cliente: {clienteId}</p>
      {productList.map((producto) => (
        <div key={producto.idProducto}>
          <p>ID del Producto: {producto.idProducto}</p>
          <p>Cantidad: {producto.cantidad}</p>
        </div>
      ))}
      <p>IVA: {ivaCompra}</p>
      <p>Subtotal: {subtotal}</p>
      <p>Total: {total}</p>
    </div>
  );
};

export default Venta;
