import { BrowserRouter,Route,Routes } from "react-router-dom";
import Nav from './Components/Nav';
import Bodega from './Views/Bodega/Index';
import CreateBodega from './Views/Bodega/Create';
import Administrador from './Views/Administrador/Index';
import CreateAdministrador from './Views/Administrador/Create';
import EditAdministrador from './Views/Administrador/Edit';
import Empleado from './Views/Empleados/Index';
import CreateEmpleado from './Views/Empleados/Create';
import EditEmpleado from './Views/Empleados/Edit';
import Login from './Views/Login';
import Registro from './Views/Registro';
import ProtectedRoutes from './Components/ProtectedRoutes';

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/registro" element={<Registro />}/>
        <Route element={<ProtectedRoutes/>}>
          
        </Route>
        <Route path="/bodega" element={<Bodega />}/>
        <Route path="/createbodega" element={<CreateBodega/>}/>
        <Route path="/administrador" element={<Administrador/>}/>
        <Route path="/createadministrador" element={<CreateAdministrador/>}/>
        <Route path="/editadministrador" element={<EditAdministrador/>}/>
        <Route path="/empleado" element={<Empleado/>}/>
        <Route path="/createempleado" element={<CreateEmpleado/>}/>
        <Route path="/editempleado" element={<EditEmpleado/>}/>
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
