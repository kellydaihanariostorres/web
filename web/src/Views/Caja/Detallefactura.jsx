import React, { useState } from "react";
import axios from "axios";
import { v4 as uuid } from 'uuid'; // Importa la función uuid para generar identificadores únicos
import SearchComponent from './SearchComponent'; // Asumiendo que tienes un componente de búsqueda para buscar productos

const CrearFacturaComponent = ({ idFactura }) => {
    const [productos, setProductos] = useState([]);
    const [detalleProductos, setDetalleProductos] = useState({ subtotal: 0, iva: 0, total: 0 });
    const iva = 0.19;

    const handleAgregarProducto = (producto) => {
        const updatedProductos = [...productos, producto];
        setProductos(updatedProductos);
        recalcularDetalleProductos(updatedProductos);
    };

    const handleEliminarProducto = (index) => {
        const updatedProductos = [...productos];
        updatedProductos.splice(index, 1);
        setProductos(updatedProductos);
        recalcularDetalleProductos(updatedProductos);
    };

    const handleEditarCantidad = (idProducto, nuevaCantidad) => {
        const updatedProductos = productos.map(producto => {
            if (producto.idProducto === idProducto) {
                return { ...producto, cantidad: nuevaCantidad };
            }
            return producto;
        });
        setProductos(updatedProductos);
        recalcularDetalleProductos(updatedProductos);
    };

    const recalcularDetalleProductos = (productos) => {
        const subtotal = productos.reduce((total, prod) => total + (prod.cantidad * prod.precioProducto), 0);
        const totalIVA = subtotal * iva;
        const total = subtotal + totalIVA;

        setDetalleProductos({
            subtotal: subtotal,
            iva: totalIVA,
            total: total
        });
    };

    const handleImprimirFactura = async () => {
        try {
            // Itera sobre cada producto y envía un detalle de factura por cada uno
            await Promise.all(productos.map(async (producto) => {
                const detalleFactura = {
                    valorUnitario: producto.precioProducto,
                    cantidad: producto.cantidad,
                    idFactura: idFactura,
                    idProducto: producto.idProducto
                };
                await axios.post("https://localhost:7284/api/DetalleFactura", detalleFactura);
            }));

            // Mostrar un mensaje de éxito después de imprimir todas las facturas
            alert("Factura impresa con éxito");

            // Limpiar la lista de productos después de imprimir la factura
            setProductos([]);
        } catch (error) {
            console.error("Error al imprimir la factura:", error);
            // Manejar cualquier error que pueda ocurrir durante la impresión de la factura
            alert("Ocurrió un error al imprimir la factura. Por favor, inténtalo de nuevo.");
        }
    };

    return (
        <div className="container mt-3 mb-3" style={{ backgroundColor: "white", width: "80%", margin: "0 auto"}}>
            <div style={{ height: "auto", marginLeft: '50%', height: "10vh"}}>
                <SearchComponent
                    productList={productos} // Asegúrate de pasar la lista de productos al componente de búsqueda
                    handleSuggestionClick={handleAgregarProducto} // Maneja la función de agregar producto al hacer clic en una sugerencia de búsqueda
                    setResults={setProductos} // Actualiza la lista de productos al hacer una búsqueda
                />
            </div>
            
            <div className="card card-body table-responsive mt-3" style={{ backgroundColor: "white", height: "auto"}}>
                {/* Aquí se muestra la tabla de productos */}
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ID Producto</th>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody> 
                        {productos.map((producto, index) => (
                            <tr key={`${producto.idProducto}-${index}`}>
                                <td>{producto.idProducto}</td>
                                <td>{producto.nombreProducto}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={producto.cantidad}
                                        onChange={(e) => handleEditarCantidad(producto.idProducto, parseInt(e.target.value))}
                                    />
                                </td>
                                <td>{producto.precioProducto}</td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => handleEliminarProducto(index)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div style={{ textAlign: "right" }}>
                {/* Aquí se muestra el resumen de la factura (subtotal, IVA, total) */}
                <div style={{ color: "black", border: "1px solid black", padding: "3px 70px", marginBottom: "10px", display: "inline-block" }}>
                    <p>Subt: {detalleProductos.subtotal}</p>
                </div>
                <div style={{ color: "black", border: "1px solid black", padding: "3px 70px", marginBottom: "10px", display: "inline-block" }}>
                    <p>IVA: {detalleProductos.iva}</p>
                </div>
                <div style={{ color: "black", border: "1px solid black", padding: "3px 70px", marginBottom: "10px", display: "inline-block" }}>
                    <p>Total: {detalleProductos.total}</p>
                </div>
            </div>
            
            <div> 
                <button onClick={handleImprimirFactura} style={{
                    backgroundColor: "green",
                    borderRadius: "50px",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    cursor: "pointer"
                    }}>Imprimir Factura
                </button>
            </div>
        </div>
    );
};

export default CrearFacturaComponent;