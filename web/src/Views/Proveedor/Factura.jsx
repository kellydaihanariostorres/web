import React, { useEffect, useState } from 'react';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { show_alerta } from '../../functions';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManageFacturaProveedores = () => {
  const apiUrl = 'https://localhost:7284/api/facturaproveedor';
  const [facturas, setFacturas] = useState([]);
  const [idFactura, setIdFactura] = useState('');
  const [fechageneracion, setFechageneracion] = useState('');
  const [fechaexpedicion, setFechaexpedicion] = useState('');
  const [fechavencimiento, setFechavencimiento] = useState('');
  const [totalBruto, setTotalBruto] = useState('');
  const [totalretefuente, setTotalretefuente] = useState('');
  const [totalpago, setTotalpago] = useState('');
  const [idProveedor, setIdProveedor] = useState('');
  const [bodegaId, setBodegaId] = useState('');
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1); 

  useEffect(() => {
    getFacturas();
  }, [pageNumber, pageSize]);

  const getFacturas = async () => {
    try {
      const response = await axios.get(apiUrl);
      setFacturas(response.data);
      setTotalPages(Math.ceil(response.data.length / pageSize));
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  const openModal = (op, id, fechageneracion, fechaexpedicion, fechavencimiento, totalBruto, totalretefuente, totalpago, idProveedor, bodegaId) => {
    setOperation(op);
    setIdFactura(id);

    if (op === 1) {
      setTitle('Registrar factura de proveedor');
      setFechageneracion('');
      setFechaexpedicion('');
      setFechavencimiento('');
      setTotalBruto('');
      setTotalretefuente('');
      setTotalpago('');
      setIdProveedor('');
      setBodegaId('');
    } else if (op === 2) {
      setTitle('Editar factura de proveedor');
      setFechageneracion(fechageneracion);
      setFechaexpedicion(fechaexpedicion);
      setFechavencimiento(fechavencimiento);
      setTotalBruto(totalBruto);
      setTotalretefuente(totalretefuente);
      setTotalpago(totalpago);
      setIdProveedor(idProveedor);
      setBodegaId(bodegaId);
    }

    document.getElementById('modalFacturas').addEventListener('shown.bs.modal', function () {
      document.getElementById('fechageneracion').focus();
    });
  };

  const validar = () => {
    if (
      fechageneracion.trim() === '' ||
      fechaexpedicion.trim() === '' ||
      fechavencimiento.trim() === '' ||
      totalBruto.trim() === '' ||
      totalretefuente.trim() === '' ||
      totalpago.trim() === '' ||
      idProveedor.trim() === '' ||
      bodegaId.trim() === ''
    ) {
      show_alerta('Completa todos los campos', 'warning');
    } else {
      const parametros = { fechageneracion, fechaexpedicion, fechavencimiento, totalBruto, totalretefuente, totalpago, idProveedor, bodegaId };
      const metodo = operation === 1 ? 'POST' : 'PUT';
      enviarSolicitud(metodo, parametros);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    const idFacturaParam = idFactura || '';
    try {
      const response = await axios[metodo.toLowerCase()](
        idFacturaParam ? `${apiUrl}/${idFacturaParam}` : apiUrl,
        parametros
      );
      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);
      getFacturas();
      setIdFactura('');
      setFechageneracion('');
      setFechaexpedicion('');
      setFechavencimiento('');
      setTotalBruto('');
      setTotalretefuente('');
      setTotalpago('');
      setIdProveedor('');
      setBodegaId('');
    } catch (error) {
      show_alerta('Error de solicitud', 'error');
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    if (text.trim() === '') {
      setPageNumber(1);
      getFacturas();
    } else {
      const filteredFacturas = facturas.filter((factura) =>
        factura.idFacturaProveedor.toLowerCase().includes(text.toLowerCase())
      );
      setFacturas(filteredFacturas);
    }
  };

  const deleteFactura = (idFactura, fechageneracion) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro quieres eliminar la factura del proveedor generada el ${fechageneracion}?`,
      icon: 'question',
      text: 'No se podrá dar marcha atrás',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/${idFactura}`);
          show_alerta('Factura eliminada exitosamente', 'success');
        } catch (error) {
          show_alerta('Error al eliminar la factura', 'error');
          console.error(error);
        } finally {
          getFacturas();
          setIdFactura('');
          setFechageneracion('');
          setFechaexpedicion('');
          setFechavencimiento('');
          setTotalBruto('');
          setTotalretefuente('');
          setTotalpago('');
          setIdProveedor('');
          setBodegaId('');
        }
      } else {
        show_alerta('La factura no fue eliminada', 'info');
      }
    });
  };

  const showPreviousButton = pageNumber > 1;
  const showNextButton = pageNumber < totalPages;

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <div className='col-md-4 offset-md-4'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className='input-group mb-3' style={{ marginLeft: 'auto', marginRight: '20px', }}>
              <input
                type='text'
                className='form-control'
                placeholder='Buscar factura'
                aria-label='Buscar factura'
                aria-describedby='button-addon2'
                onChange={handleSearch}
                value={searchText}
                style={{ height: '40px', borderRadius: '45px', marginRight: '100px', width: '500px', marginLeft: 'auto', position: 'absolute', right: 0 }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='row mt-3'>
        <div className='col-12 col-lg-8 offset-0 offset-lg-2 mx-auto text-center' style={{ width: '100%' }}>
          <DivTable col='6' off='3'>
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    #
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Fecha Generación
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Fecha Expedición
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Fecha Vencimiento
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Total Bruto
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Total Retefuente
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Total Pago
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    ID Proveedor
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Bodega ID
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {facturas
                  .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
                  .map((factura, i) => (
                    <tr key={factura.idFacturaProveedor}>
                      <td style={{ background: '#dadada' }}>{i + 1}</td>
                      <td style={{ background: '#dadada' }}>{factura.fechageneracion}</td>
                      <td style={{ background: '#dadada' }}>{factura.fechaexpedicion}</td>
                      <td style={{ background: '#dadada' }}>{factura.fechavencimiento}</td>
                      <td style={{ background: '#dadada' }}>{factura.totalBruto}</td>
                      <td style={{ background: '#dadada' }}>{factura.totalretefuente}</td>
                      <td style={{ background: '#dadada' }}>{factura.totalpago}</td>
                      <td style={{ background: '#dadada' }}>{factura.idProveedor}</td>
                      <td style={{ background: '#dadada' }}>{factura.bodegaId}</td>
                      <td style={{ background: '#dadada' }}>
                        
                        &nbsp;
                        <button
                          onClick={() => deleteFactura(factura.idFacturaProveedor, factura.fechageneracion)}
                          className='btn btn-danger'
                          style={{ background: '#440000', color: 'white' }}
                        >
                          <i className='fa-solid fa-trash'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className='d-flex justify-content-between'>
              {showPreviousButton && (
                <button onClick={handlePreviousPage} style={{ background: '#440000', borderColor: '#440000', color: 'white' }}>
                  Anterior
                </button>
              )}
              <span>
                Página {pageNumber} de {totalPages}
              </span>
              {showNextButton && (
                <button onClick={handleNextPage} style={{ background: '#440000', borderColor: '#440000', color: 'white' }}>
                  Siguiente
                </button>
              )}
            </div>
          </DivTable>
        </div>
      </div>
      <div id='modalFacturas' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='id' />
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-calendar-day'></i>
                </span>
                <input
                  type='date'
                  id='fechageneracion'
                  className='form-control'
                  placeholder='Fecha Generación'
                  value={fechageneracion}
                  onChange={(e) => setFechageneracion(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-calendar-day'></i>
                </span>
                <input
                  type='date'
                  id='fechaexpedicion'
                  className='form-control'
                  placeholder='Fecha Expedición'
                  value={fechaexpedicion}
                  onChange={(e) => setFechaexpedicion(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-calendar-day'></i>
                </span>
                <input
                  type='date'
                  id='fechavencimiento'
                  className='form-control'
                  placeholder='Fecha Vencimiento'
                  value={fechavencimiento}
                  onChange={(e) => setFechavencimiento(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-coins'></i>
                </span>
                <input
                  type='text'
                  id='totalBruto'
                  className='form-control'
                  placeholder='Total Bruto'
                  value={totalBruto}
                  onChange={(e) => setTotalBruto(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-coins'></i>
                </span>
                <input
                  type='text'
                  id='totalretefuente'
                  className='form-control'
                  placeholder='Total Retefuente'
                  value={totalretefuente}
                  onChange={(e) => setTotalretefuente(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-coins'></i>
                </span>
                <input
                  type='text'
                  id='totalpago'
                  className='form-control'
                  placeholder='Total Pago'
                  value={totalpago}
                  onChange={(e) => setTotalpago(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-id-card'></i>
                </span>
                <input
                  type='text'
                  id='idProveedor'
                  className='form-control'
                  placeholder='ID Proveedor'
                  value={idProveedor}
                  onChange={(e) => setIdProveedor(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-id-card'></i>
                </span>
                <input
                  type='text'
                  id='bodegaId'
                  className='form-control'
                  placeholder='Bodega ID'
                  value={bodegaId}
                  onChange={(e) => setBodegaId(e.target.value)}
                />
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                Cerrar
              </button>
              <button type='button' className='btn btn-primary' onClick={validar}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageFacturaProveedores;
