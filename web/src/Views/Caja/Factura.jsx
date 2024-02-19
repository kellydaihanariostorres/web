import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManageFacturas = () => {
  const apiUrl = 'https://localhost:7284/api/factura';
  const [facturas, setFacturas] = useState([]);
  const [id, setId] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');
  const [ivaCompra, setIvaCompra] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);

  useEffect(() => {
    getFacturas();
  }, []);

  const getFacturas = async () => {
    try {
      const response = await axios.get(apiUrl);
      setFacturas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (op, id, fechaCompra, ivaCompra, subtotal, total) => {
    setOperation(op);
    setId(id);

    if (op === 1) {
      setTitle('Registrar factura');
      setFechaCompra('');
      setIvaCompra(0);
      setSubtotal(0);
      setTotal(0);
    } else if (op === 2) {
      setTitle('Editar factura');
      setFechaCompra(fechaCompra);
      setIvaCompra(ivaCompra);
      setSubtotal(subtotal);
      setTotal(total);
    }

    document.getElementById('modalFacturas').addEventListener('shown.bs.modal', function () {
      document.getElementById('fechaCompra').focus();
    });
  };

  const validar = () => {
    if (!fechaCompra.trim() || !ivaCompra || !subtotal || !total) {
      show_alerta('Completa todos los campos', 'warning');
    } else {
      const parametros = { id, fechaCompra, ivaCompra, subtotal, total };
      const metodo = operation === 1 ? 'POST' : 'PUT';
      enviarSolicitud(metodo, parametros);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    const idParam = id || '';
    try {
      const response = await axios[metodo.toLowerCase()](
        idParam ? `${apiUrl}/${idParam}` : apiUrl,
        parametros
      );
      console.log('Response:', response);
      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);
      getFacturas();
      setId('');
      setFechaCompra('');
      setIvaCompra(0);
      setSubtotal(0);
      setTotal(0);
    } catch (error) {
      show_alerta('Error de solicitud', 'error');
      console.error(error);
    }
  };
  
  const deleteFactura = async (id) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro quieres eliminar la factura con ID ${id}?`,
      icon: 'question',
      text: 'No se podrá dar marcha atrás',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/${id}`);
          show_alerta('Factura eliminada exitosamente', 'success');
        } catch (error) {
          show_alerta('Error al eliminar la factura', 'error');
          console.error(error);
        } finally {
          getFacturas();
          setId('');
          setFechaCompra('');
          setIvaCompra(0);
          setSubtotal(0);
          setTotal(0);
        }
      } else {
        show_alerta('La factura no fue eliminada', 'info');
      }
    });
  };

  const show_alerta = (mensaje, tipo) => {
    alert(`${tipo}: ${mensaje}`);
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <div className='col-md-4 offset-md-4'>
          
        </div>
      </div>
      <div className='row mt-3'>
        <div className='col-12 col-lg-8 offset-0 offset-lg-2 mx-auto text-center' style={{ width: '100%' }}>
          <div>
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    #
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Fecha de Compra
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    IVA
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Subtotal
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}>
                    Total
                  </th>
                  <th className='table-header' style={{ background: '#440000', color: 'white' }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {facturas.map((factura, i) => (
                  <tr key={factura.id}>
                    <td style={{ background: '#dadada' }}>{i + 1}</td>
                    <td style={{ background: '#dadada' }}>{factura.fechaCompra}</td>
                    <td style={{ background: '#dadada' }}>{factura.ivaCompra}</td>
                    <td style={{ background: '#dadada' }}>{factura.subtotal}</td>
                    <td style={{ background: '#dadada' }}>{factura.total}</td>
                    <td style={{ background: '#dadada' }}>
                      <button
                        onClick={() =>
                          openModal(
                            2,
                            factura.id,
                            factura.fechaCompra,
                            factura.ivaCompra,
                            factura.subtotal,
                            factura.total
                          )
                        }
                        className='btn btn-warning'
                        data-bs-toggle='modal'
                        data-bs-target='#modalFacturas'
                        style={{ background: '#440000', color: 'white' }}
                      >
                        <i className='fa-solid fa-edit'></i>
                      </button>
                      &nbsp;
                      <button
                        onClick={() => deleteFactura(factura.id)}
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
          </div>
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
                  <i className='fa-solid fa-percent'></i>
                </span>
                <input
                  type='number'
                  id='ivaCompra'
                  className='form-control'
                  placeholder='IVA'
                  value={ivaCompra}
                  onChange={(e) => setIvaCompra(parseFloat(e.target.value))}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-dollar-sign'></i>
                </span>
                <input
                  type='number'
                  id='subtotal'
                  className='form-control'
                  placeholder='Subtotal'
                  value={subtotal}
                  onChange={(e) => setSubtotal(parseFloat(e.target.value))}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'>
                  <i className='fa-solid fa-dollar-sign'></i>
                </span>
                <input
                  type='number'
                  id='total'
                  className='form-control'
                  placeholder='Total'
                  value={total}
                  onChange={(e) => setTotal(parseFloat(e.target.value))}
                />
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar(id)} className='btn btn-success'>
                  <i className='fa-solid fa-floppy-disk'></i> Guardar
                </button>
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageFacturas;
