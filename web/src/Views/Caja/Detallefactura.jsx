import React, { useState } from "react";
import SearchComponent from './SearchComponent';

const CrearFacturaComponent = () => {
    const [productos, setProductos] = useState([]);
    const [detalleProductos, setDetalleProductos] = useState({ subtotal: 0, iva: 0, total: 0 });
    const [productList, setProductList] = useState([]);
    const [searchText, setSearchText] = useState("");
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

    const handleSuggestionClick = (producto) => {
        handleAgregarProducto(producto);
    };

    const overflowStyle = {
        overflowX: productos.length > 3 ? "auto" : "hidden"
    };

    return (
        <div className="container mt-3 mb-3" style={{ backgroundColor: "white", width: "80%", margin: "0 auto"}}>
            <div style={{ height: "auto", marginLeft: '50%', height: "10vh"}}>
                <SearchComponent
                    productList={productList}
                    handleSuggestionClick={handleSuggestionClick}
                    setResults={setProductList}
                    searchText={searchText}
                    setSearchText={setSearchText} />
            </div>
            
            <div className="card card-body table-responsive mt-3" style={{ backgroundColor: "white", height: "auto", ...overflowStyle }}> 
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
                            <tr key={producto.idProducto}>
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
            <div>
                <p>Subtotal: {detalleProductos.subtotal}</p>
            </div>
            <div>
                <p>IVA: {detalleProductos.iva}</p>
            </div>
            <div>
                <p>Total: {detalleProductos.total}</p>
            </div>
        </div>
    );
};

export default CrearFacturaComponent;
