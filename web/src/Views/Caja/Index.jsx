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

        if (productName !== '' && !isNaN(productPrice)) {
          var newRow =
            '<tr><td>' + productName + '</td><td>' + productPrice + '</td></tr>';
          $('#productTableBody').append(newRow);

          total += productPrice;
          $('#totalAmount').text(total.toFixed(2));

          $('#productName').val('');
          $('#productPrice').val('');
        }
      });
    });
  }, []);

  return (
    <div className="col-11 col-xl-11 col-xxl-11" style={{ paddingTop: '94px', background: '#eaeaeb', borderColor: 'var(--acent-color)', marginTop: '0px', marginRight: '108px', paddingRight: '39px', paddingLeft: '75px', marginLeft: '48px', marginBottom: '-96px', paddingBottom: '80px' }}>
      <a className="btn btn-primary" role="button" style={{ background: 'var(--primary-color)', borderColor: 'var(--acent-color)', borderRadius: '45px', marginBottom: '0px', marginTop: '-92px' }} href="/RegistrarClientee.html">
        Registro
      </a>
      <div style={{ marginLeft: '152px', marginRight: '126px' }}>
        <div className="container mt-5">
          <h2>Detalle de Factura</h2>
          <form id="invoiceForm">
            <div className="form-group">
              <label htmlFor="productName" className="form-label">
                Nombre del producto:
              </label>
              <input type="text" className="form-control" id="productName" placeholder="Ingrese el nombre del producto" />
            </div>
            <div className="form-group">
              <label htmlFor="productPrice" className="form-label">
                Precio del producto:
              </label>
              <input type="number" className="form-control" id="productPrice" placeholder="Ingrese el precio del producto" />
            </div>
            <div className="form-group">
              <label htmlFor="productName" className="form-label">
                Cantidad de productos:
              </label>
              <input type="text" id="productName-1" placeholder="Ingrese la cantidad de productos" style={{ boxShadow: '0px 0px' }} />
              <button className="btn btn-primary" id="addProductBtn" type="button" style={{ borderRadius: '45px', borderColor: 'var(--primary-color)', background: 'var(--primary-color)', marginTop: '16px' }}>
                Agregar producto
              </button>
            </div>
          </form>
          <div id="productList" className="mt-5">
            <h4>Lista de Productos</h4>
            <div>
              <table className="table">
                <thead style={{ background: 'var(--color-text)' }}>
                  <tr>
                    <th style={{ borderColor: 'var(--color-text)', background: 'var(--color-text)', color: 'var(--bs-light)' }}>Producto</th>
                    <th style={{ background: 'var(--color-text)', color: 'var(--bs-light)' }}>Precio Unitario</th>
                    {/* Agrega más encabezados de tabla según sea necesario */}
                  </tr>
                </thead>
                <tbody id="productTableBody" style={{ background: 'var(--color-text)' }}></tbody>
                <tfoot style={{ background: 'var(--color-text)' }}>
                  <tr style={{ background: 'var(--color-text)' }}>
                    <td style={{ background: 'var(--color-text)', borderColor: 'var(--color-text)', color: 'var(--bs-light)' }}>Total:</td>
                    <td id="totalAmount" style={{ background: 'var(--color-text)', borderColor: 'var(--color-text)', color: 'var(--bs-light)' }}>0</td>
                    {/* Agrega más celdas de pie de página según sea necesario */}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        <a className="btn btn-secondary" role="button" id="cancelBtn" style={{ borderColor: 'var(--primary-color)', borderRadius: '45px', background: 'var(--primary-color)', paddingRight: '12px' }} href="/home.html">
          Cancelar
        </a>
        <a className="btn btn-primary" role="button" id="confirmBtn" style={{ background: 'var(--primary-color)', borderColor: 'var(--acent-color)', borderRadius: '45px', transform: 'translate(36px)' }} href="/Factura.html">
          Confirmar
        </a>
      </div>
    </div>
  );
};

export default Factura;
