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
            actualizarInventario(productList);
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

  const actualizarInventario = async (productosVendidos) => {
    try {
      for (const producto of productosVendidos) {
        // Obtener el producto del inventario para obtener la cantidad actual
        const response = await fetch(`https://localhost:7284/api/productos/${producto.idProducto}`);
        if (!response.ok) {
          const errorData = await response.json();
          console.error(errorData);
          console.error('Hubo un error al obtener el producto del inventario:', errorData.message);
          return; // Salir de la función si hay un error
        }
        const productoInventario = await response.json();
  
        // Sumar la cantidad vendida de la cantidad actual en el inventario
        const nuevaCantidad = productoInventario.cantidad + producto.cantidad;
  
        // Actualizar el inventario con la nueva cantidad
        const updateResponse = await fetch(`https://localhost:7284/api/productos/${producto.idProducto}`, {
          method: 'PUT',
          body: JSON.stringify({
            ...productoInventario, // Mantener otros datos del producto intactos
            cantidad: nuevaCantidad
          }),
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });
  
        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          console.error(errorData);
          console.error('Hubo un error al actualizar el inventario:', errorData.message);
          return; // Salir de la función si hay un error
        }
      }
      console.log('El inventario se ha actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar el inventario:', error);
      alert('Hubo un error al actualizar el inventario. Por favor, inténtelo de nuevo.');
    }
  };
  
  

  const [ventaExitosa, setVentaExitosa] = useState(false);

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
      <p>Fecha de Vencimiento: {fechaVencimiento instanceof Date ? fechaVencimiento.toLocaleDateString() : ''}</p>
      <p>Total Bruto: {totalBruto}</p>
      <p>Total Retefuente: {totalRetefuente}</p>
      <p>Total Pago: {totalPago}</p>
      <p>ID Proveedor: {idProveedor}</p>
      <p>Bodega ID: {bodegaId}</p>
      {productList && productList.length > 0 && productList.map((producto) => (
        <div key={producto.idProducto}>
          <p>ID del Producto: {producto.idProducto}</p>
          <p>Cantidad: {producto.cantidad}</p>
        </div>
      ))}
    </div>
  );
};

export default Venta;
