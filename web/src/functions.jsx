import axios from 'axios';
import Swal from 'sweetalert2';
import storage from './Storage/storage';

export const show_alerta = (msj, icon) => {
  Swal.fire({ title: msj, icon: icon, buttonsStyling: true });
};

export const sendRequest = async (method, params, url, redir = '', token = true) => {
  if (token) {
    const authToken = storage.get('authToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;
  }

  let res;
  await axios({ method: method, url: url, data: params })
    .then((response) => {
      res = response.data;
      if (method !== 'GET') show_alerta(response.data.message, 'success');
      setTimeout(() => (redir !== '') ? (window.location.href = redir) : '', 200);
    })
    .catch((errors) => {
      let desc = '';
      res = errors.response.data;
      errors.response.data.errors.forEach((e) => {
        desc = desc + ' ' + e;
      });
      show_alerta(desc, 'error');
    });

  return res;
};

export const confirmation = async (name, url, redir) => {
  const alert = Swal.mixin({ buttonsStyling: true });
  alert
    .fire({
      title: 'Are you sure to delete ' + name + '?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '<i class="fa-solid fa-check"></i> yes, delete',
      cancelButtonText: '<i class="fa-solid fa-ban"></i> cancel',
    })
    .then((result) => {
      if (result.isConfirmed) {
        sendRequest('DELETE', {}, url, redir);
      }
    });
};

export default show_alerta;