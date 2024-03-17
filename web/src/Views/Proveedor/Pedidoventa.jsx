import React, { useEffect, useState } from 'react';

const Venta = ({ venta }) => {
  const { fechaCompra, fechaExpedicion, fechaVencimiento, totalBruto, totalRetefuente, totalPago, productList, idProveedor, bodegaId } = venta;

  useEffect(() => {
    const enviarVenta = async () => {
      try {
        if (productList && productList.length > 0) {
          let ventaExitosa = true;
          for (const producto of productList) {
            const ventaData = {
              fechaCompra: fechaCompra instanceof Date ? fechaCompra.toISOString() : null,
              fechaExpedicion: fechaExpedicion instanceof Date ? fechaExpedicion.toISOString() : null,
              fechaVencimiento: fechaVencimiento instanceof Date ? fechaVencimiento.toISOString() : null,
              cantidad: producto.cantidad,
              totalBruto: totalBruto,
              totalRetefuente: totalRetefuente,
              totalPago: totalPago,
              idProveedor: idProveedor,
              bodegaId: bodegaId,
              idProducto: producto.idProducto,
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
              console.error(errorData);
              console.error('Hubo un error al registrar la venta:', errorData.message);
            }
          }

          if (ventaExitosa) {
            console.log('La venta se ha registrado correctamente.');
            setVentaExitosa(true);
          } else {
            alert('Hubo un error al registrar la venta. Por favor, inténtelo de nuevo.');
          }
        } else {
          console.log('No hay productos en la lista de productos.');
        }
      } catch (error) {
        console.error('Error al enviar la venta:', error);
        alert('Hubo un error al enviar la venta. Por favor, inténtelo de nuevo.');
      }
    };
    
    enviarVenta();
  }, [venta]);

  const [ventaExitosa, setVentaExitosa] = useState(false);

  const limpiarFormatoFactura = () => {
    setVentaExitosa(false); // Reiniciar el estado de venta exitosa
    // Limpiar otros elementos del formato de factura si es necesario
    // setVentaConfirmada(null); // Reiniciar la venta confirmada (Comentado para evitar error)
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
      <p>Fecha de Expedición: {fechaExpedicion instanceof Date ? fechaExpedicion.toLocaleDateString() : ''}</p>
      {/* Corrección: Mostrar la fecha de vencimiento proporcionada en la solicitud */}
      <p>Fecha de Vencimiento: {fechaVencimiento instanceof Date ? fechaVencimiento.toLocaleDateString() : ''}</p>
      <p>Total Bruto: {totalBruto}</p>
      <p>Total Retefuente: {totalRetefuente}</p>
      <p>Total Pago: {totalPago}</p>
      <p>ID Proveedor: {idProveedor}</p>
      <p>Bodega ID: {bodegaId}</p>
      {productList && productList.length > 0 && productList.map((producto) => (
        <div key={producto.idProducto}>
          <p>ID del Producto: {producto.idProducto}</p>
          {/* Corrección: Mostrar la cantidad de producto proporcionada en la solicitud */}
          <p>Cantidad: {producto.cantidad}</p>
        </div>
      ))}
    </div>
  );
};

export default Venta;
