import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '../VistasLogin/Administrador';
import Home from '../Views/Home/Home';
import Bodega from '../Views/Bodega/Index';
import CreateBodega from '../Views/Bodega/Create';
import EditBodega from '../Views/Bodega/Edit';
import Empleado from '../Views/Empleados/Index';
import CreateEmpleado from '../Views/Empleados/Create';
import EditEmpleado from '../Views/Empleados/Edit';
import Clientes from '../Views/Clientes/index';
import CrearClientes from '../Views/Clientes/Create';
import EditClientes from '../Views/Clientes/Edit';
import Productos from '../Views/Productos/index';
import CrearProductos from '../Views/Productos/Create';
import EditProductos from '../Views/Productos/Edit';
import Caja from '../Views/Caja/Index';
import Inventario from '../Views/Inventario/Index';
import Pago from '../Views/Pagos/Index';
import Proveedor from '../Views/Proveedor/Index';
import CrearProveedor from '../Views/Proveedor/Create';
import EditProveedor from '../Views/Proveedor/Edit';
import Perfil from '../Views/Perfil/index';
import Factura from '../Views/Caja/Factura';

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


function VistaAdministrador({ cargo }) {
  return (
    <div style={styles.flex}>
      <SideBar cargo={cargo} />
      <div className="content" style={styles.content}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="bodega/*" element={<Bodega />} />
          <Route path="createbodega/*" element={<CreateBodega />} />
          <Route path="editbodega/:id/*" element={<EditBodega />} />
          <Route path="empleado/*" element={<Empleado />} />
          <Route path="createempleado/*" element={<CreateEmpleado />} />
          <Route path="editempleado/:id/*" element={<EditEmpleado />} />
          <Route path="clientes/*" element={<Clientes rutaBase="/administradorv/clientes" />} />
          <Route path="crearclientes/*" element={<CrearClientes />} />
          <Route path="editclientes/:id/*" element={<EditClientes />} />
          <Route path="productos/*" element={<Productos />} />
          <Route path="crearproductos/*" element={<CrearProductos />} />
          <Route path="Editproductos/:id/*" element={<EditProductos />} />
          <Route path="pago/*" element={<Pago />} />
          <Route path="inventario/*" element={<Inventario />} />
          <Route path="caja/*" element={<Caja />} />
          <Route path="proveedor/*" element={<Proveedor />} />
          <Route path="createproveedor/*" element={<CrearProveedor />} />
          <Route path="editproveedor/:id/*" element={<EditProveedor />} />
          <Route path="perfil/*" element={<Perfil />} />
          <Route path="facturas/*" element={<Factura />} />
        </Routes>
      </div>
    </div>
  );
}

export default VistaAdministrador;
