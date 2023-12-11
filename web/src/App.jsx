import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import SideBar from './Components/SideBar';
import Navb from './Components/Nav';
import Home from './Views/Home/Home';
import Bodega from './Views/Bodega/Index';
import CreateBodega from './Views/Bodega/Create'
import EditBodega from './Views/Bodega/Edit'
import Empleado from './Views/Empleados/Index';
import CreateEmpleado from './Views/Empleados/Create';
import EditEmpleado from './Views/Empleados/Edit';
import Clientes from './Views/Clientes/index';
import CrearClientes from './Views/Clientes/Create';
import EditClientes from './Views/Clientes/Edit';
import Productos from './Views/Productos/index';
import CrearProductos from './Views/Productos/Create';
import EditProductos from './Views/Productos/Edit';
import Caja from './Views/Caja/Index';
import Inventario from './Views/Inventario/Index';
import Pago from './Views/Pagos/Index';
import Proveedor from './Views/Proveedor/Index';
import CrearProveedor from './Views/Proveedor/Create';
import EditProveedor from './Views/Proveedor/Edit';
import Login from './Views/Login';
import Registro from './Views/Registro';
import Perfil from './Views/Perfil/index';
import Categorias from './Views/Categorias/index';
import ProtecdRoutes from './Components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <div>
        <Navb />
        <div className='flex'>
          <SideBar />
          <div className='content'>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/bodega" element={<Bodega />}/>
              <Route path="/createbodega" element={<CreateBodega/>}/>
              <Route path="/editbodega/:id" element={<EditBodega />} />
              <Route path="/empleado" element={<Empleado/>}/>
              <Route path="/createempleado" element={<CreateEmpleado/>}/>
              <Route path="/editempleado/:id" element={<EditEmpleado/>}/>
              <Route path="/clientes" element={<Clientes/>}/>
              <Route path="/crearclientes" element={<CrearClientes/>}/>
              <Route path="/editclientes/:id" element={<EditClientes/>}/>
              <Route path="/productos" element={<Productos/>}/>
              <Route path="/crearproductos" element={<CrearProductos/>}/>
              <Route path="/Editproductos/:id" element={<EditProductos/>}/>
              <Route path="/pago" element={<Pago/>}/>
              <Route path="/inventario" element={<Inventario/>}/>
              <Route path="/caja" element={<Caja/>}/>
              <Route path="/proveedor" element={<Proveedor/>}/>
              <Route path="/createproveedor" element={<CrearProveedor/>}/>
              <Route path="/editproveedor/:id" element={<EditProveedor/>}/>
              <Route path="/perfil" element={<Perfil/>}/>
              <Route path="/categorias" element={<Categorias/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;