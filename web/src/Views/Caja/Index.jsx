import React, { useEffect, useState, useRef } from 'react';
import { sendRequest } from '../../functions';
import 'bootstrap/dist/css/bootstrap.min.css';

const Caja = ({ id }) => {
  const [fechaCompra, setFechaCompra] = useState('');
  const [ivaCompra, setIvaCompra] = useState(0.18);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);

  const NombreInput = useRef();
  const [productList, setProductList] = useState([]);

  let method = 'POST';
  let url = 'api/facturas';
  let redirect = '';

  useEffect(() => {
    if (id) {
      getBodega();
    }
  }, [id]);

  const getBodega = async () => {
    const res = await sendRequest('GET', '', `api/facturas/${id}`);
    const bodega = res.data;

    setFechaCompra(bodega.fechaCompra || getCurrentDate());
    setIvaCompra(bodega.ivaCompra || 0.18);
    setSubtotal(bodega.subtotal || 0);
    setTotal(bodega.total || 0);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
  };

  const calculateTotal = () => {
    let calculatedTotal = 0;
    productList.forEach((product) => {
      calculatedTotal += product.productPrice * product.productQuantity;
    });
    return calculatedTotal;
  };

  useEffect(() => {
    setTotal(calculateTotal());
  }, [productList]);

  const handleAddProduct = () => {
    if (productName && productPrice && productQuantity) {
      const product = {
        productName,
        productPrice,
        productQuantity,
      };

      setProductList((prevList) => [...prevList, product]);

      
      setProductName('');
      setProductPrice(0);
      setProductQuantity(0);
    }
  };

  const handleConfirm = () => {
    
  };

  const save = async (e) => {
    e.preventDefault();

    if (id) {
      method = 'PUT';
      url = `api/bodegas/${id}`;
      redirect = '/';
    }

    const res = await sendRequest(
      method,
      { fechaCompra, ivaCompra, subtotal, total: calculateTotal(), productList },
      url,
      redirect
    );

    if (method === 'POST' && res.status === true) {
      setFechaCompra('');
      setIvaCompra(0.18);
      setSubtotal(0);
      setTotal(0);
      setProductList([]);
    }
  };

  return (
    <div className="col-11 col-xl-11 col-xxl-11">
      <a
        className="btn btn-primary"
        role="button"
        href="/crearclientes"
        style={{
          background: '#440000',
          borderColor: '#440000',
          borderRadius: '45px',
          transform: 'translate(36px)',
          color: 'white',
        }}
      >
        Registro
      </a>
      <div
        style={{
          marginLeft: '152px',
          marginRight: '126px',
          maxHeight: 'calc(100vh - 290px)',
          overflow: 'auto',
        }}
      >
        <div className="container mt-5">
          <h2 style={{ color: 'black' }}>Detalle de Factura</h2>
          <form id="invoiceForm">
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
                min="0"
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
                min="0"
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
          </form>
          <div id="productList" className="mt-5">
            <h4 style={{ color: 'black' }}>Lista de Productos</h4>
            <div>
              <table className="table">
                <thead style={{ background: 'var(--color-text)' }}>
                  <tr>
                    <th style={{ borderColor: 'var(--color-text)', background: 'var(--color-text)', color: 'black' }}>
                      Producto
                    </th>
                    <th style={{ background: 'var(--color-text)', color: 'black' }}>Precio Unitario</th>
                    <th style={{ background: 'var(--color-text)', color: 'black' }}>Cantidad</th>
                  </tr>
                </thead>
                <tbody id="productTableBody" style={{ background: 'var(--color-text)' }}>
                  {productList.map((product, index) => (
                    <tr key={index}>
                      <td>{product.productName}</td>
                      <td>{product.productPrice}</td>
                      <td>{product.productQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <a
        className="btn btn-secondary"
        role="button"
        id="cancelBtn"
        href="/home"
        style={{
          background: '#440000',
          borderColor: '#440000',
          borderRadius: '45px',
          transform: 'translate(36px)',
          color: 'white',
        }}
      >
        Cancelar
      </a>
      <button
        className="btn btn-primary"
        id="confirmBtn"
        type="button"
        style={{
          background: '#440000',
          borderColor: '#440000',
          borderRadius: '45px',
          transform: 'translate(36px)',
          color: 'white',
        }}
        onClick={handleConfirm}
      >
        Confirmar
      </button>
      <tfoot
        style={{ background: 'var(--color-text)', marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}
      >
        <tr style={{ background: 'var(--color-text)' }}>
          <td style={{ background: 'var(--color-text)', borderColor: 'var(--color-text)', color: 'black' }}>Total:</td>
          <td id="totalAmount" style={{ background: 'var(--color-text)', borderColor: 'var(--color-text)', color: 'black' }}>
            {total}
          </td>
        </tr>
      </tfoot>
    </div>
  );
};

export default Caja;
