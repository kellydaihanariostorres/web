import React, { useEffect, useState } from 'react';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { show_alerta } from '../../functions';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManageFacturas = () => {
  const apiUrl = 'https://localhost:7284/api/factura';
  const [facturas, setFacturas] = useState([]);
  const [idFactura, setIdFactura] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [ivaCompra, setIvaCompra] = useState(0.18);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [idProducto, setIdProducto] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [empleadoId, setEmpleadoId] = useState('');
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getFacturas(pageNumber, pageSize);
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

  const openModal = (op, factura) => {
    setOperation(op);
    setIdFactura(factura.idFactura);

    if (op === 1) {
      setTitle('Registrar factura');
      setFechaCompra('');
      setCantidad(0);
      setIvaCompra(0.18);
      setSubtotal(0);
      setTotal(0);
      setIdProducto('');
      setClienteId('');
      setEmpleadoId('');
    } else if (op === 2) {
      setTitle('Editar factura');
      setFechaCompra(factura.fechaCompra);
      setCantidad(factura.cantidad);
      setIvaCompra(factura.ivaCompra);
      setSubtotal(factura.subtotal);
      setTotal(factura.total);
      setIdProducto(factura.idProducto);
      setClienteId(factura.clienteId);
      setEmpleadoId(factura.empleadoId);
    }

    document.getElementById('modalFacturas').addEventListener('shown.bs.modal', function () {
      document.getElementById('fechaCompra').focus();
    });
  };

  const validar = () => {
    if (
      fechaCompra.trim() === '' ||
      isNaN(ivaCompra) ||
      isNaN(subtotal) ||
      isNaN(total) ||
      cantidad === '' ||
      idProducto.trim() === '' ||
      clienteId.trim() === '' ||
      empleadoId.trim() === ''
    ) {
      show_alerta('Completa todos los campos', 'warning');
    } else {
      const parametros = { fechaCompra, cantidad, ivaCompra, subtotal, total, idProducto, clienteId, empleadoId };
      const metodo = operation === 1 ? 'POST' : 'PUT';
      enviarSolicitud(metodo, parametros);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    try {
      const response = await axios[metodo.toLowerCase()](
        operation === 1 ? apiUrl : `${apiUrl}/${idFactura}`,
        parametros
      );
      const msj = operation === 1 ? 'Factura registrada exitosamente' : 'Factura editada exitosamente';
      show_alerta(msj, 'success');
      getFacturas();
      setIdFactura('');
      setFechaCompra('');
      setCantidad(0);
      setIvaCompra(0.18);
      setSubtotal(0);
      setTotal(0);
      setIdProducto('');
      setClienteId('');
      setEmpleadoId('');
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
      const filteredFacturas = facturas.filter((factura) => factura.idFactura.toLowerCase().includes(text.toLowerCase()));
      setFacturas(filteredFacturas);
    }
  };

  const deleteFactura = (idFactura) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro quieres eliminar la factura ${idFactura}?`,
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
          setFechaCompra('');
          setCantidad(0);
          setIvaCompra(0.18);
          setSubtotal(0);
          setTotal(0);
          setIdProducto('');
          setClienteId('');
          setEmpleadoId('');
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className='input-group mb-3'>
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
                    ID Factura
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Fecha de Compra
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Cantidad
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    IVA Compra
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Subtotal
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Total
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    ID Producto
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Cliente ID
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Empleado ID
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {facturas
                .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
                .map((factura, i) => (
                  <tr key={factura.idFactura}>
                    <td style={{ background: '#dadada' }}>{i + 1}</td>
                    <td style={{ background: '#dadada' }}>{factura.idFactura}</td>
                    <td style={{ background: '#dadada' }}>{factura.fechaCompra}</td>
                    <td style={{ background: '#dadada' }}>{factura.cantidad}</td>
                    <td style={{ background: '#dadada' }}>{factura.ivaCompra}</td>
                    <td style={{ background: '#dadada' }}>{factura.subtotal}</td>
                    <td style={{ background: '#dadada' }}>{factura.total}</td>
                    <td style={{ background: '#dadada' }}>{factura.idProducto}</td>
                    <td style={{ background: '#dadada' }}>{factura.clienteId}</td>
                    <td style={{ background: '#dadada' }}>{factura.empleadoId}</td>
                    <td style={{ background: '#dadada' }}>
                      &nbsp;
                      <button
                        onClick={() => deleteFactura(factura.idFactura)}
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
              <input type='hidden' id='idFactura' />
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-calendar'></i>
                </span>
                <input
                  type='datetime-local'
                  id='fechaCompra'
                  className='form-control'
                  value={fechaCompra}
                  onChange={(e) => setFechaCompra(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-cubes'></i>
                </span>
                <input
                  type='text'
                  id='cantidad'
                  className='form-control'
                  placeholder='Cantidad'
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-percent'></i>
                </span>
                <input
                  type='text'
                  id='ivaCompra'
                  className='form-control'
                  placeholder='IVA Compra'
                  value={ivaCompra}
                  onChange={(e) => setIvaCompra(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-dollar-sign'></i>
                </span>
                <input
                  type='text'
                  id='subtotal'
                  className='form-control'
                  placeholder='Subtotal'
                  value={subtotal}
                  onChange={(e) => setSubtotal(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-dollar-sign'></i>
                </span>
                <input
                  type='text'
                  id='total'
                  className='form-control'
                  placeholder='Total'
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-cubes'></i>
                </span>
                <input
                  type='text'
                  id='idProducto'
                  className='form-control'
                  placeholder='ID Producto'
                  value={idProducto}
                  onChange={(e) => setIdProducto(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-user'></i>
                </span>
                <input
                  type='text'
                  id='clienteId'
                  className='form-control'
                  placeholder='Cliente ID'
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-user'></i>
                </span>
                <input
                  type='text'
                  id='empleadoId'
                  className='form-control'
                  placeholder='Empleado ID'
                  value={empleadoId}
                  onChange={(e) => setEmpleadoId(e.target.value)}
                />
              </div>
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-bs-dismiss='modal'
                style={{ background: '#440000', borderColor: '#440000', color: 'white' }}
              >
                Cerrar
              </button>
              <button
                type='button'
                className='btn btn-primary'
                style={{ background: '#440000', borderColor: '#440000', color: 'white' }}
                onClick={validar}
              >
                {operation === 1 ? 'Registrar' : 'Editar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageFacturas;
