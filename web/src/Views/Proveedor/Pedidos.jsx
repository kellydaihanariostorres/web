import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchComponent from '../Caja/SearchComponent';
import Logo_sistema from '../Caja/logo_sistema.jpg';
import ListProveedor from './listproveedore';
import ListBodega from './ListBodega';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Caja = () => {
  const [fechaCompra, setFechaCompra] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [ivaCompra, setIvaCompra] = useState(0);
  const [total, setTotal] = useState(0);
  const [productList, setProductList] = useState([]);
  const [ventaConfirmada, setVentaConfirmada] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [registroClienteModalOpen, setRegistroClienteModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [idProveedor, setIdProveedor] = useState(null);
  const [updateComponent, setUpdateComponent] = useState(false);
  const [buscarClienteModalOpen, setBuscarClienteModalOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [buscarBodegaModalOpen, setBuscarBodegaModalOpen] = useState(false);
  const [idBodega, setIdBodega] = useState(null);
  const [fechaExpedicion, setFechaExpedicion] = useState(new Date());
  const [fechaVencimiento, setFechaVencimiento] = useState(new Date());
  const [bodegas, setBodegas] = useState([]);

  useEffect(() => {
    if (productList.length > 0) {
      calcularSubtotal(productList);
    }
  }, [productList]);

  useEffect(() => {
    calcularTotal();
    calcularIVA();
  }, [subtotal]);

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString();
  };

  const handleOpenRegistroClienteModal = () => {
    setRegistroClienteModalOpen(true);
  };

  const handleSuggestionClick = (suggestion) => {
    if (idProveedor) {
      const updatedProductList = [...productList, { ...suggestion, cantidad: 1 }];
      setProductList(updatedProductList);
    } else {
      alert('Debe seleccionar un proveedor antes de agregar un producto');
    }
  };

  const handleDeleteProduct = (index) => {
    const updatedProductList = [...productList];
    updatedProductList.splice(index, 1);
    setProductList(updatedProductList);
  };

  const handleConfirm = () => {
    if (productList.length > 0 && idProveedor && idBodega) {
      const ventaConfirmada = {
        fechaCompra: new Date().toISOString(),
        productList: productList,
        idProveedor: idProveedor,
        idBodega: idBodega,
        subtotal: subtotal,
        ivaCompra: ivaCompra,
        total: total,
      };
      setVentaConfirmada(ventaConfirmada);
      enviarVenta(ventaConfirmada);
    } else {
      alert('Debe seleccionar al menos un producto, un proveedor y una bodega antes de confirmar la venta');
    }
  };

  const enviarVenta = async (ventaConfirmada) => {
    try {
      let ventaExitosa = true;
      for (const producto of ventaConfirmada.productList) {
        const ventaData = {
          fechaCompra: ventaConfirmada.fechaCompra,
          ivaCompra: ventaConfirmada.ivaCompra,
          subtotal: ventaConfirmada.subtotal,
          total: ventaConfirmada.total,
          idProducto: producto.idProducto,
          idProveedor: ventaConfirmada.idProveedor,
          cantidad: producto.cantidad
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
          break;
        }
      }

      if (ventaExitosa) {
        console.log('La venta se ha registrado correctamente.');
        setModalOpen(true);
      } else {
        alert('Hubo un error al registrar la venta. Por favor, inténtelo de nuevo.');
      }
    } catch (error) {
      console.error('Error al enviar la venta:', error);
      alert('Hubo un error al enviar la venta. Por favor, inténtelo de nuevo.');
    }
  };

  const calcularSubtotal = (updatedProductList) => {
    let total = 0;
    updatedProductList.forEach((producto) => {
      total += parseFloat(producto.precioProducto);
    });
    setSubtotal(total);
  };

  const calcularIVA = () => {
    const iva = subtotal * 0.19;
    setIvaCompra(iva);
  };

  const calcularTotal = () => {
    const totalVenta = subtotal + ivaCompra;
    setTotal(totalVenta);
  };

  const handleCancel = () => {
    setProductList([]);
    setIdProveedor(null);
    setSubtotal(0);
    setIvaCompra(0);
    setTotal(0);
  };

  const getDate = () => {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  };

  const handleCloseRegistroClienteModal = () => {
    setRegistroClienteModalOpen(false);
  };

  const handleClienteGuardado = (idProveedor) => {
    console.log('ID del cliente guardado:', idProveedor);
    setIdProveedor(idProveedor);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setRegistroClienteModalOpen(false);
  };

  const handleOpenBuscarClienteModal = () => {
    setBuscarClienteModalOpen(true);
  };

  const handleClienteClick = (idProveedor) => {
    setClienteSeleccionado(idProveedor);
    setIdProveedor(idProveedor);
  };

  const handleOpenBuscarBodegaModal = () => {
    setBuscarBodegaModalOpen(true);
  };
  const handleProveedorClick = (idProveedor) => {
    setIdProveedor(idProveedor);
    handleCloseModal();
  };
  const handleProveedorSeleccionado = (idProveedor) => {
    setIdProveedor(idProveedor);
  };
 
  const handleBodegaSeleccionada = (idBodega) => {
    setIdBodega(idBodega);
  };
  
  return (
    <div className="container-fluid">
      <div style={{ marginLeft: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <div style={{ marginRight: '20px' }}>
            <button className="btn btn-primary" onClick={handleOpenRegistroClienteModal} style={{ borderRadius: '45px', borderColor: '#440000', background: '#440000', marginTop: '16px' }}>Buscar Proveedor</button>
          </div>
          <div>
            <button className="btn btn-primary" onClick={handleOpenBuscarClienteModal} style={{ borderRadius: '45px', borderColor: '#440000', background: '#440000', marginTop: '16px' }}>Buscar Bodega</button>
          </div>
        </div>
      </div>
      <div style={{
        height: '40px',
        borderRadius: '45px',
        marginRight: '100px',
        width: '500px',
        marginLeft: 'auto',
        position: 'absolute',
        right: 0,
        top: '-20px',
      }}>
        <SearchComponent
          productList={productList}
          handleSuggestionClick={handleSuggestionClick}
          setResults={setProductList}
          searchText={searchText}
          setSearchText={setSearchText}
          style={{ zIndex: 9999 }}
        />
      </div>
      <div className="container-fluid" style={{ paddingLeft: '0', paddingRight: '0' }}>
        <div className="col-12" style={{ backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', marginTop: '16px', paddingLeft: '0', paddingRight: '0', position: 'relative' }}>
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
                      <ListProveedor handleProveedorClick={handleProveedorSeleccionado} />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {buscarClienteModalOpen && (
            <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Buscar Bodega</h5>
                    <button type="button" className="close" aria-label="Close" onClick={() => setBuscarClienteModalOpen(false)}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <ListBodega bodegas={bodegas} onBodegaSeleccionada={handleBodegaSeleccionada} />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setBuscarClienteModalOpen(false)}>Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', marginLeft: '10px', marginRight: '10px', }}>
            <div style={{ color: 'black' }}>
              <div style={{ marginBottom: '10px' }}>Empresa: Diablo Rojo</div>
            </div>
            <div style={{ marginLeft: '20px', marginTop: '20px', justifyContent: 'space-between', marginRight: '10px' }}>
              <img src={Logo_sistema} alt="logo_sistema" style={{ width: '80px' }} />
            </div>
          </div>
          <hr style={{ margin: '10px 0' }} />
          <div style={{ top: '10px', right: '10px', color: 'black', marginLeft: '10px' }}>
            Fecha de Generacion: {getDate()}
          </div>
          <div>
            <div style={{ top: '10px', right: '10px', color: 'black', marginLeft: '10px' }}>
              Fecha de Expedicion:
              <DatePicker selected={fechaExpedicion} onChange={date => setFechaExpedicion(date)} />
            </div>
            <div style={{ top: '10px', right: '10px', color: 'black', marginLeft: '10px' }}>
              Fecha de Vencimiento:
              <DatePicker selected={fechaVencimiento} onChange={date => setFechaVencimiento(date)} />
            </div>
          </div>
          <div style={{ top: '10px', right: '10px', color: 'black', marginLeft: '10px' }}>
            ID Proveedor: {idProveedor}
          </div>
          <div style={{ top: '10px', right: '10px', color: 'black', marginLeft: '10px' }}>
            ID Bodega: {idBodega}
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
                    <th style={{ background: 'var(--color-text)', color: 'black' }}>Cantidad</th>
                  </tr>
                </thead>
                <tbody id="productTableBody" style={{ background: 'var(--color-text)' }}>
                  {productList && productList.map((product, index) => (
                    <tr key={index}>
                      <td>{product.idProducto}</td>
                      <td>{product.nombreProducto}</td>
                      <td>{product.precioProducto}</td>
                      <td>
                        <input type="number" value={product.cantidad} onChange={(e) => {
                          const updatedProductList = [...productList];
                          updatedProductList[index].cantidad = parseInt(e.target.value);
                          setProductList(updatedProductList);
                        }} />
                      </td>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', marginLeft: '10px', marginRight: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a className="btn btn-secondary" role="button" id="cancelBtn" href="#!" onClick={handleCancel} style={{ borderRadius: '45px', borderColor: '#440000', background: '#440000', marginTop: '16px', marginRight: '10px' }}>Cancelar</a>
            <button className="btn btn-primary" id="confirmBtn" type="button" onClick={handleConfirm} style={{ borderRadius: '45px', borderColor: '#440000', background: '#440000', marginTop: '16px' }}>Confirmar</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'inline-block', background: 'white', padding: '10px', marginRight: '10px' }}>
              <h5 style={{ marginBottom: '0' }}>total Bruto: {subtotal}</h5>
            </div>
            <div style={{ display: 'inline-block', background: 'white', padding: '10px', marginRight: '10px' }}>
              <h5 style={{ marginBottom: '0' }}>Retefuente: {ivaCompra}</h5>
            </div>
            <div style={{ display: 'inline-block', background: 'white', padding: '10px' }}>
              <h5 style={{ marginBottom: '0' }}>total: {total}</h5>
            </div>
          </div>
        </div>
        {modalOpen && (
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Venta Confirmada</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setModalOpen(false)}>
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
    </div>
  );
};

export default Caja;
