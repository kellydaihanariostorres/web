import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Venta from './Venta';
import RegistroClienteModal from './RegistroClienteModal';
import Logo_sistema from './logo_sistema.jpg';
import SearchComponent from './SearchComponent'; 

const Caja = () => {
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
  const [clienteId, setClienteId] = useState(null);
  const [updateComponent, setUpdateComponent] = useState(false); // Nuevo estado para forzar la actualización del componente
  const [empleadoId, setEmpleadoId] = useState('');

  useEffect(() => {
    calcularSubtotal();
    calcularIVA();
    calcularTotal();
  }, [productList]); // Ejecutar cada vez que cambie la lista de productos
  
  useEffect(() => {
    // Esta función se ejecutará cada vez que el estado de updateComponent cambie,
    // lo que forzará la actualización del componente
    setUpdateComponent(false); // Reinicia el estado después de la actualización
  }, [updateComponent]);

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString();
  };

  const handleOpenRegistroClienteModal = () => {
    setRegistroClienteModalOpen(true); // Abre el modal de registro de cliente
  };
  
  const handleSuggestionClick = (suggestion) => {
    const newProduct = {
      idProducto: suggestion.idProducto,
      nombreProducto: suggestion.nombreProducto,
      precioProducto: suggestion.precioProducto, // Corregido aquí
    };
    setProductList([...productList, newProduct]);
    calcularSubtotal();
    calcularIVA();
    calcularTotal();
  };
  
  const handleDeleteProduct = (index) => {
    const updatedProductList = [...productList];
    updatedProductList.splice(index, 1);
    setProductList(updatedProductList);
    calcularSubtotal();
    calcularIVA();
    calcularTotal();
  };
  
  const handleConfirm = async () => {
    // Lógica para confirmar la venta
    const ventaConfirmada = {
      fechaCompra: getCurrentDate(),
      productList: productList,
      idCliente: clienteId,
      idEmpleado: empleadoId,
      subtotal: subtotal,
      iva: ivaCompra,
      total: total
    };
    setVentaConfirmada(ventaConfirmada);
    setModalOpen(true); // Establecer modalOpen en true para mostrar el modal de confirmación
  };
  
  
  const calcularSubtotal = () => {
    let total = 0;
    productList.forEach(producto => {
      total += parseFloat(producto.precioProducto);
    });
    setSubtotal(total);
  };

  // Función para calcular el IVA
  const calcularIVA = () => {
    const iva = subtotal * 0.19; // Suponiendo que el IVA es del 19%
    setIvaCompra(iva);
  };

  // Función para calcular el total
  const calcularTotal = () => {
    const total = subtotal + ivaCompra;
    setTotal(total);
  };
  
  const handleCancel = () => {
    // Limpiar la lista de productos
    setProductList([]);
    // Limpiar el ID del cliente
    setClienteId(null);
    // Limpiar la sumatoria del subtotal
    setSubtotal(0);
    // Limpiar la sumatoria del IVA
    setIvaCompra(0);
    // Limpiar la sumatoria del total
    setTotal(0);
  };
  
  

  const getDate = () => {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  };

  const handleCloseRegistroClienteModal = () => {
    // Cierra el formulario de registro de cliente
    setRegistroClienteModalOpen(false);
  };

  const handleClienteGuardado = (clienteId) => {
    console.log("ID del cliente guardado:", clienteId); // Verificar si se guarda el ID del cliente correctamente
    setClienteId(clienteId); // Guardar el ID del cliente
    handleCloseModal(); // Cerrar el modal después de guardar el cliente
  };
  
  
  const handleCloseModal = () => {
    setRegistroClienteModalOpen(false); // Asegúrate de cambiar el estado a false para cerrar la ventana emergente
  };
  
  return (
    <div>
      <button className="btn btn-primary" onClick={handleOpenRegistroClienteModal} style={{ borderRadius: '45px', borderColor: '#440000', background: '#440000', marginTop: '16px',marginLeft: 'auto',marginRight: '1160px'}}>Registrar Cliente</button>
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
          <SearchComponent 
            productList={productList} 
            handleSuggestionClick={handleSuggestionClick} 
            setResults={setProductList} // Asegúrate de pasar setProductList
            style={{ zIndex: 9999 }} 
          />
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
                  <button type="button" className="close" aria-label="Close" onClick={handleCloseModal}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <RegistroClienteModal handleClienteGuardado={handleClienteGuardado} /> {/* Pasar la función handleClienteGuardado como prop */}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cerrar</button>
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
          ID cliente: {clienteId}
        </div>
        <div style={{ top: '10px', right: '10px', color: 'black', marginLeft: '10px' }}>
          ID Empleado: <input type="text" value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} />
        </div>


        <hr style={{ margin: '10px 0' }} />
        
        <div id="productList" className="mt-5" style={{ overflow: 'auto', maxHeight: '300px' }}>
        <div>
          <table className="table">
            <thead style={{ background: 'var(--color-text)' }}>
              <tr>
              <th style={{ background: 'var(--color-text)', color: 'black' }}>ID</th>
                <th style={{ background: 'var(--color-text)', color: 'black' }}>Nombre</th>
                <th style={{ background: 'var(--color-text)', color: 'black' }}>Precio Unitario</th>
              </tr>
            </thead>
            <tbody id="productTableBody" style={{ background: 'var(--color-text)' }}>
              {productList && productList.map((product, index) => (
                <tr key={index}>
                  <td>{product.idProducto}</td>
                  <td>{product.nombreProducto}</td>
                  <td>{product.precioProducto}</td>
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
                <Venta venta={ventaConfirmada} clienteId={clienteId} empleadoId={empleadoId} />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Caja;
