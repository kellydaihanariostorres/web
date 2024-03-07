import React, { useState } from 'react';
import { sendRequest } from '../../functions';
import 'bootstrap/dist/css/bootstrap.min.css';
import Venta from './Venta'; // Importa el componente Venta
import RegistroClienteModal from './RegistroClienteModal'; // Importa el componente de ventana emergente de registro de cliente

const Caja = ({ id }) => {
  const [fechaCompra, setFechaCompra] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [ivaCompra, setIvaCompra] = useState(0);
  const [total, setTotal] = useState(0);
  const [productList, setProductList] = useState([]);
  const [ventaConfirmada, setVentaConfirmada] = useState(null); // Estado para almacenar la venta confirmada
  const [modalOpen, setModalOpen] = useState(false);
  const [registroClienteModalOpen, setRegistroClienteModalOpen] = useState(false); // Estado para controlar la ventana emergente de registro de cliente

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString();
    
  };

  const handleAddProduct = () => {
    const product = {
      productName: productName,
      productPrice: parseFloat(productPrice),
      productQuantity: parseInt(productQuantity)
    };
    const updatedProductList = [...productList, product];
    setProductList(updatedProductList);
    const subtotalCalc = updatedProductList.reduce((acc, curr) => acc + curr.productPrice * curr.productQuantity, 0);
    setSubtotal(subtotalCalc);
    const ivaCalc = subtotalCalc * 0.18;
    setIvaCompra(ivaCalc);
    setTotal(subtotalCalc + ivaCalc);
    setProductName('');
    setProductPrice('');
    setProductQuantity('');
  };

  const handleDeleteProduct = (index) => {
    const updatedProductList = [...productList];
    updatedProductList.splice(index, 1);
    setProductList(updatedProductList);
    const subtotalCalc = updatedProductList.reduce((acc, curr) => acc + curr.productPrice * curr.productQuantity, 0);
    setSubtotal(subtotalCalc);
    const ivaCalc = subtotalCalc * 0.18;
    setIvaCompra(ivaCalc);
    setTotal(subtotalCalc + ivaCalc);
  };

  const handleConfirm = async () => {
    // Aquí guarda los datos necesarios para la venta en el estado del componente
    const venta = {
      id: id || '',
      fechaCompra: getCurrentDate(),
      ivaCompra: ivaCompra,
      subtotal: subtotal,
      total: total,
      productList: productList
    };

    // Muestra la ventana emergente de Venta con los datos guardados
    setVentaConfirmada(venta);
    setModalOpen(true);

    // Envía la venta a la API
    await sendRequest('POST', venta, 'https://localhost:7284/api/factura');
  };

  const handleCancel = () => {
    // Implementa la lógica de cancelación si es necesario
  };

  const handleCloseModal = () => {
    setRegistroClienteModalOpen(false); // Cerrar la ventana emergente de registro de cliente
    setModalOpen(false); // Cerrar la ventana de confirmación de venta
    
    // Limpiar los campos y restablecer los estados
    setFechaCompra('');
    setProductName('');
    setProductPrice('');
    setProductQuantity('');
    setSubtotal(0);
    setIvaCompra(0);
    setTotal(0);
    setProductList([]);
    setVentaConfirmada(null);
  };

  const getDate = () => {
    const date = new Date();
    // Formatea la fecha en el formato deseado, por ejemplo: DD/MM/YYYY
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  };
  
  const handleOpenRegistroClienteModal = () => {
    setRegistroClienteModalOpen(true);
  };

  const handleCloseRegistroClienteModal = () => {
    setRegistroClienteModalOpen(false);
  };

  return (
    <div className="col-11 col-xl-11 col-xxl-11">
      {registroClienteModalOpen && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registrar Cliente</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <RegistroClienteModal RegistroClienteModal={ventaConfirmada} />
              </div>
            </div>
          </div>
        </div>
      )}
      <div style={{  top: '10px', right: '10px', color: 'black' }}>
        Fecha de Compra: {getDate()}
      </div>
      <div className="form-group">
        <label htmlFor="productName" className="form-label" style={{ color: 'black' }}>
          Nombre del producto:
        </label>
        <input
          type="text"
          className="form-control"
          id="productName"
          placeholder="Ingrese el nombre del producto"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="productPrice" className="form-label" style={{ color: 'black' }}>
          Precio del producto:
        </label>
        <input
          type="number"
          className="form-control"
          id="productPrice"
          placeholder="0"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="productQuantity" className="form-label" style={{ color: 'black' }}>
          Cantidad de productos:
        </label>
        <input
          type="number"
          className="form-control"
          id="productQuantity"
          placeholder="0"
          value={productQuantity}
          onChange={(e) => setProductQuantity(e.target.value)}
        />
        <button
          className="btn btn-primary"
          id="addProductBtn"
          type="button"
          style={{ borderRadius: '45px', borderColor: '#440000', background: '#440000', marginTop: '16px' }}
          onClick={handleAddProduct}
        >
          Agregar producto
        </button>
      </div>

      <div id="productList" className="mt-5" style={{ overflow: 'auto', maxHeight: '300px' }}>
        <h4 style={{ color: 'black' }}>Lista de Productos</h4>
        <div>
          <table className="table">
            <thead style={{ background: 'var(--color-text)' }}>
              <tr>
                <th style={{ borderColor: 'var(--color-text)', background: 'var(--color-text)', color: 'black' }}>Producto</th>
                <th style={{ background: 'var(--color-text)', color: 'black' }}>Precio Unitario</th>
                <th style={{ background: 'var(--color-text)', color: 'black' }}>Cantidad</th>
                <th style={{ background: 'var(--color-text)', color: 'black' }}>Acciones</th>
              </tr>
            </thead>
            <tbody id="productTableBody" style={{ background: 'var(--color-text)' }}>
              {productList && productList.map((product, index) => (
                <tr key={index}>
                  <td>{product.productName}</td>
                  <td>{product.productPrice}</td>
                  <td>{product.productQuantity}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDeleteProduct(index)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: 'white', padding: '10px', marginTop: '10px' }}>
        <h5>Subtotal: {subtotal}</h5>
      </div>

      <div style={{ background: 'white', padding: '10px', marginTop: '10px' }}>
        <h5>Iva: {ivaCompra}</h5>
      </div>

      <div style={{ background: 'white', padding: '10px', marginTop: '10px' }}>
        <h5>Total: {total}</h5>
      </div>

      <button className="btn btn-primary" onClick={handleOpenRegistroClienteModal} style={{ borderRadius: '45px', borderColor: '#440000', background: '#440000', marginTop: '16px' }}>Registrar Cliente</button>

      <a className="btn btn-secondary" role="button" id="cancelBtn" href="#!" onClick={handleCancel} style={{ borderRadius: '45px', borderColor: '#440000', background: '#440000', marginTop: '16px', marginLeft: '16px' }}>Cancelar</a>
      <button className="btn btn-primary" id="confirmBtn" type="button" onClick={handleConfirm} style={{ borderRadius: '45px', borderColor: '#440000', background: '#440000', marginTop: '16px' }}>Confirmar</button>
      {modalOpen && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Venta Confirmada</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <Venta venta={ventaConfirmada} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Caja;
