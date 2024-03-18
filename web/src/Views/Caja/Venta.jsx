import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Importar axios para realizar solicitudes HTTP

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
            console.error(errorData);
            console.error('Hubo un error al registrar la venta:', errorData.message);
          }
        }

        if (ventaExitosa) {
          console.log('La venta se ha registrado correctamente.');
          setVentaExitosa(true); // Indicar que la venta fue exitosa
          // Restar la cantidad vendida del inventario después de registrar la venta exitosamente
          await actualizarInventario(productList);
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

  // Función para restar la cantidad del inventario de un producto vendido
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
  
        // Restar la cantidad vendida de la cantidad actual en el inventario
        const nuevaCantidad = productoInventario.cantidad - producto.cantidad;
  
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
