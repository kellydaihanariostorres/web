import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const Factura = () => {
  useEffect(() => {
    $(document).ready(function () {
      var total = 0;

      $('#addProductBtn').click(function () {
        var productName = $('#productName').val();
        var productPrice = parseFloat($('#productPrice').val());
        var productQuantity = parseInt($('#productQuantity').val());

        if (productName !== '' && !isNaN(productPrice) && !isNaN(productQuantity) && productQuantity > 0) {
          var newRow = `<tr><td>${productName}</td><td>${productPrice}</td><td>${calculateIVA(productPrice)}</td><td>${productQuantity}</td></tr>`;
          $('#productTableBody').append(newRow);

          total += productPrice * productQuantity;
          $('#totalAmount').text(total.toFixed(2));

          $('#productName').val('');
          $('#productPrice').val('');
          $('#productQuantity').val('');
        }
      });

      function calculateIVA(price) {
        // Aquí puedes agregar tu lógica para calcular el IVA
        // Por ejemplo, supongamos que el IVA es el 10% del precio
        return (price * 0.1).toFixed(2);
      }
    });
  }, []);

  return (
    <div className="col-11 col-xl-11 col-xxl-11" style={{ paddingTop: '94px', background: '#eaeaeb', borderColor: 'var(--acent-color)', marginTop: '0px', marginRight: '108px', paddingRight: '39px', paddingLeft: '75px', marginLeft: '48px', marginBottom: '-96px', paddingBottom: '80px', overflow: 'hidden' }}>
      <a className="btn btn-primary" role="button" style={{ background: '#440000', borderColor: '#440000', borderRadius: '45px', marginBottom: '0px', marginTop: '-92px' }} href="/crearclientes">
        Registro
      </a>
      <div style={{ marginLeft: '152px', marginRight: '126px', maxHeight: 'calc(100vh - 290px)', overflow: 'auto' }}>
        <div className="container mt-5">
          <h2 style={{ color: 'black' }}>Detalle de Factura</h2>
          <form id="invoiceForm">
            <div className="form-group">
              <label htmlFor="productName" className="form-label" style={{ color: 'black' }}>
                Nombre del producto:
              </label>
              <input type="text" className="form-control" id="productName" placeholder="Ingrese el nombre del producto" />
            </div>
            <div className="form-group">
              <label htmlFor="productPrice" className="form-label" style={{ color: 'black' }}>
                Precio del producto:
              </label>
              <input type="number" className="form-control" id="productPrice" placeholder="0" min="0" />
            </div>
            <div className="form-group">
              <label htmlFor="productQuantity" className="form-label" style={{ color: 'black' }}>
                Cantidad de productos:
              </label>
              <input type="number" className="form-control" id="productQuantity" placeholder="0" min="0" />
              <button className="btn btn-primary" id="addProductBtn" type="button" style={{ borderRadius: '45px', borderColor: '#440000', background: '#440000', marginTop: '16px' }}>
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
                    <th style={{ borderColor: 'var(--color-text)', background: 'var(--color-text)', color: 'black' }}>Producto</th>
                    <th style={{ background: 'var(--color-text)', color: 'black' }}>Precio Unitario</th>
                    <th style={{ background: 'var(--color-text)', color: 'black' }}>IVA</th>
                    <th style={{ background: 'var(--color-text)', color: 'black' }}>Cantidad</th>
                  </tr>
                </thead>
                <tbody id="productTableBody" style={{ background: 'var(--color-text)' }}></tbody>
              </table>
            </div>
          </div>
        </div>
        
      </div>
      <a className="btn btn-secondary" role="button" id="cancelBtn" style={{ borderColor: '#440000', borderRadius: '45px', background: '#440000', paddingRight: '12px', color: 'white' }} href="/home">
          Cancelar
        </a>
        <a className="btn btn-primary" role="button" id="confirmBtn" style={{ background: '#440000', borderColor: '#440000', borderRadius: '45px', transform: 'translate(36px)', color: 'white' }} href="/Factura">
          Confirmar
        </a>

        <tfoot style={{ background: 'var(--color-text)', marginTop: '10px', display: 'flex', justifyContent: 'flex-end'}}>
                  <tr style={{ background: 'var(--color-text)' }}>
                    <td style={{ background: 'var(--color-text)', borderColor: 'var(--color-text)', color: 'black' }}>Total:</td>
                    <td id="totalAmount" style={{ background: 'var(--color-text)', borderColor: 'var(--color-text)', color: 'black' }}>0</td>
                  </tr>
        </tfoot>
    </div>
  );
};

export default Factura;
