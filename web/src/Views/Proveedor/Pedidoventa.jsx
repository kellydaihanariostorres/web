import React, { useEffect } from 'react';

const Venta = ({ venta, clienteId, empleadoId }) => {
  const { fechaCompra, ivaCompra, subtotal, total, productList } = venta;

  useEffect(() => {
    const enviarVenta = async () => {
      try {
        let ventaExitosa = true;
        for (const producto of productList) {
          const ventaData = {
            fechaCompra: new Date(fechaCompra).toISOString(),
            ivaCompra: parseFloat(ivaCompra), // Convertir a número de punto flotante
            subtotal: parseFloat(subtotal), // Convertir a número de punto flotante
            total: parseFloat(total), // Convertir a número de punto flotante
            idProducto: producto.idProducto,
            cantidad: producto.cantidad, // Agregar cantidad
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

  return (
    <div>
      <h3>Factura</h3>
      <p>ID Empleado: {empleadoId}</p>
      <p>Fecha de Compra: {fechaCompra}</p>
      <p>ID del Cliente: {clienteId}</p>
      <p>IVA: {ivaCompra}</p>
      <p>Subtotal: {subtotal}</p>
      <p>Total: {total}</p>
      {productList.map((producto) => (
        <div key={producto.idProducto}>
          <p>ID del Producto: {producto.idProducto}</p>
          <p>Cantidad: {producto.cantidad}</p> {/* Mostrar cantidad */}
          {/* Agrega aquí otros detalles del producto si es necesario */}
        </div>
      ))}
    </div>
  );
};

export default Venta;
