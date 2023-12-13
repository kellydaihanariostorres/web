import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import { show_alerta } from '../../functions';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const ManageBodegas = () => {
  const apiUrl = 'https://localhost:7284/api/bodegas';
  const [bodegas, setBodegas] = useState([]);
  const [bodegaId, setBodegaId] = useState('');
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);

  useEffect(() => {
    getBodegas();
  }, []);

  const getBodegas = async () => {
    try {
      const response = await axios.get(apiUrl);
      setBodegas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (op, id, nombre, direccion, estado, ciudad) => {
    setOperation(op);
    setBodegaId(id);

    if (op === 1) {
      setTitle('Registrar bodega');
      setNombre('');
      setEstado('');
      setDireccion('');
      setCiudad('');
    } else if (op === 2) {
      setTitle('Editar bodega');
      setNombre(nombre);
      setEstado(estado);
      setDireccion(direccion);
      setCiudad(ciudad);
    }

    window.setTimeout(function () {
      document.getElementById('nombre').focus();
    }, 500);
  };

  const validar = () => {
    if (nombre.trim() === '' || direccion.trim() === '' || estado.trim() === '' || ciudad.trim() === '') {
      show_alerta('Completa todos los campos', 'warning');
    } else {
      const parametros = { nombre, direccion, estado, ciudad };
      const metodo = operation === 1 ? 'POST' : 'PUT';
      enviarSolicitud(metodo, parametros);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    const bodegaIdParam = bodegaId || '';
    try {
      const response = await axios[metodo.toLowerCase()](
        bodegaIdParam ? `${apiUrl}/${bodegaIdParam}` : apiUrl,
        parametros
      );
      const tipo = response.data[0];
      const msj = response.data[1];
      show_alerta(msj, tipo);
      if (tipo === 'success') {
        document.getElementById('btnCerrar').click();
        getBodegas();
      }
    } catch (error) {
      show_alerta('Error de solicitud', 'error');
      console.error(error);
    }
  };

  const deleteBodega = (bodegaId, nombre) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro quieres eliminar la bodega ${nombre}?`,
      icon: 'question',
      text: 'No se podrá dar marcha atrás',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/${bodegaId}`);
          show_alerta('Bodega eliminada exitosamente', 'success');
          getBodegas();
        } catch (error) {
          show_alerta('Error al eliminar la bodega', 'error');
          console.error(error);
        }
      } else {
        show_alerta('La bodega no fue eliminada', 'info');
      }
    });
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <div className='col-md-4 offset-md-4'>
          <DivAdd>
            <button
              onClick={() => openModal(1)}
              
              data-bs-toggle='modal'
              data-bs-target='#modalBodegas'
              className='btn btn-dark mx-auto col-3'  style={{ background: '#440000', borderColor: '#440000', borderRadius: '45px', transform: 'translate(36px)', color: 'white' }}
            >
              <i className='fa-solid fa-circle-plus'></i> Añadir
            </button>
          </DivAdd>
        </div>
      </div>
      <div className='row mt-3'>
        <div className='col-12 col-lg-8 offset-0 offset-lg-2 mx-auto text-center' style={{ width: '100%' }}>
          <DivTable col='6' off='3' >
            <table  className='table table-bordered' >
              <thead>
                <tr>
                  <th className='table-header' style={{ background: '#440000', color: 'white'  }}>#</th>
                  <th className='table-header' style={{ background: '#440000', color: 'white'  }}>BODEGA</th>
                  <th className='table-header' style={{  background: '#440000', color: 'white'  }}>ESTADO</th>
                  <th className='table-header' style={{  background: '#440000', color: 'white'  }}>DIRECCIÓN</th>
                  <th className='table-header' style={{  background: '#440000', color: 'white'  }}>CIUDAD</th>
                  <th className='table-header' style={{ background: '#440000', color: 'white'  }}></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {bodegas.map((bodega, i) => (
                  <tr key={bodega.bodegaId}>
                    <td style={{ background: '#dadada' }}>{i + 1}</td>
                    <td style={{ background: '#dadada' }}>{bodega.nombre}</td>
                    <td style={{ background: '#dadada' }}>{bodega.estado}</td>
                    <td style={{ background: '#dadada' }}>{bodega.direccion}</td>
                    <td style={{ background: '#dadada' }}>{bodega.ciudad}</td>
                    <td style={{ background: '#dadada' }}>
                      <button
                        onClick={() => openModal(2, bodega.bodegaId, bodega.nombre, bodega.direccion, bodega.estado, bodega.ciudad)}
                        className='btn btn-warning'
                        data-bs-toggle='modal'
                        data-bs-target='#modalBodegas'
                        style={{ background: '#440000' , color: 'white' }}
                      >
                        <i className='fa-solid fa-edit'></i>
                      </button>
                      &nbsp;
                      <button
                        onClick={() => deleteBodega(bodega.bodegaId, bodega.nombre)}
                        className='btn btn-danger'
                        style={{ background: '#440000' , color: 'white' }}
                      >
                        <i className='fa-solid fa-trash'></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DivTable>
        </div>
      </div>
      <div id='modalBodegas' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='id' />
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input
                  type='text'
                  id='nombre'
                  className='form-control'
                  placeholder='Nombre'
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input
                  type='text'
                  id='direccion'
                  className='form-control'
                  placeholder='Dirección'
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input
                  type='text'
                  id='estado'
                  className='form-control'
                  placeholder='Estado'
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input
                  type='text'
                  id='ciudad'
                  className='form-control'
                  placeholder='Ciudad'
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                />
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar(bodegaId)} className='btn btn-success'>
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

export default ManageBodegas;
