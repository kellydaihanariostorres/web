import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '../VistasLogin/Administrador';// menu
import Home from '../Views/Home/Home';
import Bodega from '../Views/Bodega/Index';
import Empleado from '../Views/Empleados/Index';
import Clientes from '../Views/Clientes/index';
import Productos from '../Views/Productos/index';
import Caja from '../Views/Caja/Index';
import Inventario from '../Views/Inventario/Index';
import Proveedor from '../Views/Proveedor/Index';
import Factura from '../Views/Caja/Factura';
import Navb from '../Components/Nav';
import Registro from '../Views/Registro';
import Venta from '../Views/Caja/Venta';
import FacturaProveedor from '../Views/Proveedor/Factura';
import Pedidos from '../Views/Proveedor/Pedidos';

const styles = {
  flex: {
    display: 'flex',
    backgroundColor: '#999999',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    padding: '20px',
    margin: '0 auto',
    backgroundColor: '#999999',
  },
};

// En esta paina encontramos el ruteo para el administrador el cual yiene la vistas de todos  los demas componentes.
// solo es llamado de vistas al menu

function VistaAdministrador({ cargo }) {
  return (
  <div>
    <Navb />
    <div style={styles.flex}>
      <SideBar cargo={cargo} />
      <div className="content" style={styles.content}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="bodega/*" element={<Bodega />} />
          <Route path="empleado/*" element={<Empleado />} />
          <Route path="clientes/*" element={<Clientes rutaBase="/administradorv/clientes" />} />
          <Route path="productos/*" element={<Productos />} />
          <Route path="inventario/*" element={<Inventario />} />
          <Route path="caja/*" element={<Caja />} />
          <Route path="proveedor/*" element={<Proveedor />} />
          <Route path="facturas/*" element={<Factura />} />
          <Route path="registro/*" element={<Registro />} />
          <Route path="venta/*" element={<Venta />} />
          <Route path="facturaproveedor/*" element={<FacturaProveedor/>} />
          <Route path="pedido/*" element={<Pedidos/>} />
        </Routes>

      </div>
    </div>
  </div>
  );
}

export default VistaAdministrador;
