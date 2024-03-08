import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Venta from './Venta';
import RegistroClienteModal from './RegistroClienteModal';
import Logo_sistema from '../../../public/logo_sistema.jpg';
import SearchComponent from './SearchComponent'; 

const Caja = ({ id }) => {
  const [fechaCompra, setFechaCompra] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [ivaCompra, setIvaCompra] = useState(0);
  const [total, setTotal] = useState(0);
  const [productList, setProductList] = useState([]);
  const [ventaConfirmada, setVentaConfirmada] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [registroClienteModalOpen, setRegistroClienteModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString();
  };
 
  
  
  const handleSuggestionClick = (suggestion) => {
    setNombreProducto(suggestion.nombreProducto);
    console.log(productList);

  };
  
  const handleAddProduct = () => {
    const newProduct = {
      nombreProducto: nombreProducto, // Asegúrate de que nombreProducto tenga el valor correcto
      productPrice: productPrice,
      productQuantity: productQuantity,
    };
    setProductList([...productList, newProduct]);
  };
  
  const handleDeleteProduct = (index) => {
    const updatedProductList = [...productList];
    updatedProductList.splice(index, 1);
    setProductList(updatedProductList);
  };
  

  const handleConfirm = async () => {
    // Lógica para confirmar la venta
  };

  const handleCancel = () => {
    // Lógica para cancelar la venta
  };

  const handleCloseModal = () => {
    // Lógica para cerrar el modal
  };

  const getDate = () => {
    const date = new Date();
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
    <div style={{
      position: 'fixed',
      top: '60px', // Altura del nav, ajusta según sea necesario
      left: 0,
      width: '100%',
      height: 'calc(100% - 60px)',
      backgroundColor: '#696969'
    }}>
      <button className="btn btn-primary" onClick={handleOpenRegistroClienteModal} style={{ borderRadius: '45px', borderColor: '#440000', background: '#440000', marginTop: '16px', marginLeft: '76px'}}>Registrar Cliente</button>
      <div style={{
            height: '40px',
            borderRadius: '45px',
            marginRight: '100px',
            width: '500px',
            marginLeft: 'auto',
            position: 'absolute',
            right: 0,
            top: '-40px',
          }}>
      <SearchComponent productList={productList} handleSuggestionClick={handleSuggestionClick}  />
      
      <p>Producto seleccionado: {nombreProducto}</p>
    </div>
     
      
      <div className="col-12" style={{backgroundColor: 'white', 
        marginLeft: 'auto', // Márgen izquierdo automático para centrar
        marginRight: 'auto', // Márgen derecho automático para centrar
        marginTop: '16px', 
        maxWidth: 'calc(100% - 150px)', // Ancho reducido con márgenes izquierdo y derecho
        position: 'relative' // Para mantener los elementos hijos en su lugar original
      }}>
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
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', marginLeft: '10px', marginRight: '10px',  }}>
          <div style={{ color: 'black' }}>
            <div style={{ marginBottom: '10px' }}>Empresa: Diablo Rojo</div>
            <div>Dirección: Calle 23 #45 - 67</div>
          </div>
          <div style={{ marginLeft: '20px',marginTop: '20px',  justifyContent: 'space-between',marginRight: '10px'}}>
            <img src={Logo_sistema} alt="logo_sistema" style={{ width: '80px' }} />
          </div>
        </div>
        <hr style={{ margin: '10px 0'}} />
        <div style={{ top: '10px', right: '10px', color: 'black', marginLeft: '10px' }}>
          Fecha de Compra: {getDate()}
        </div>
        <div style={{ top: '10px', right: '10px', color: 'black', marginLeft: '10px' }}>
          ID cliente
        </div>
        <hr style={{ margin: '10px 0' }} />
        
        <div id="productList" className="mt-5" style={{ overflow: 'auto', maxHeight: '300px' }}>
          <div>
            <table className="table">
              <thead style={{ background: 'var(--color-text)' }}>
                <tr>
                  <th style={{ background: 'var(--color-text)', color: 'black'}}>Codigo</th>
                  <th style={{ background: 'var(--color-text)', color: 'black' }}>Articulo</th>
                  <th style={{ background: 'var(--color-text)', color: 'black' }}>Cantidad</th>
                  <th style={{ background: 'var(--color-text)', color: 'black'}}>Presio unitario</th>
                  <th style={{ background: 'var(--color-text)', color: 'black'}}>Total</th>
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

      </div>
      <a className="btn btn-secondary" role="button" id="cancelBtn" href="#!" onClick={handleCancel} style={{ borderRadius: '45px', borderColor: '#440000', background: '#440000', marginTop: '16px', marginLeft: '76px' }}>Cancelar</a>
      <button className="btn btn-primary" id="confirmBtn" type="button" onClick={handleConfirm} style={{ borderRadius: '45px', borderColor: '#440000', background: '#440000', marginTop: '96px' }}>Confirmar</button>
      <div style={{ marginTop: '10px', textAlign: 'right', marginRight: '16px' }}>
        <div style={{ display: 'inline-block', background: 'white', padding: '10px', marginRight: '10px' }}>
          <h5 style={{ marginBottom: '0' }}>Subtotal: {subtotal}</h5>
        </div>

        <div style={{ display: 'inline-block', background: 'white', padding: '10px', marginRight: '10px' }}>
          <h5 style={{ marginBottom: '0' }}>IVA: {ivaCompra}</h5>
        </div>

        <div style={{ display: 'inline-block', background: 'white', padding: '10px' }}>
          <h5 style={{ marginBottom: '0' }}>Total: {total}</h5>
        </div>
      </div>
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
