import React, { useEffect } from 'react';

const Venta = ({ venta }) => {
  const { fechaCompra, ivaCompra, subtotal, total, productList, idProveedor, idBodega } = venta;

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
            idProveedor: idProveedor,
            cantidad: producto.cantidad,
            idBodega: idBodega
          };

          const response = await fetch('https://localhost:7284/api/facturaproveedor', {
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
  }, [venta]);

  return (
    <div>
      <h3>Factura</h3>
      <p>Fecha de Compra: {fechaCompra}</p>
      <p>IVA: {ivaCompra}</p>
      <p>Subtotal: {subtotal}</p>
      <p>Total: {total}</p>
      <p>ID Proveedor: {idProveedor}</p>
      <p>ID Bodega: {idBodega}</p>
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
