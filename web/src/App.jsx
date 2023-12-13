import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import './App.scss';
import Navb from './Components/Nav';
import ProtecdRoutes from './Components/ProtectedRoutes';
import VistaAdministrador from './redi/admi';
import VistaCaja from './redi/caj';
import VistaContador from './redi/cont';
import VistaGerente from './redi/bod';




function App() {
  const cargo = sessionStorage.getItem("cargo");
  return (
    <Router>
      <Navb/>
      <Routes>
      <Route path="/administradorv/*" element={<VistaAdministrador cargo={cargo} />} />
        <Route path="/cajav/*" element={<VistaCaja cargo={cargo} />} />
        <Route path="/contadorv/*" element={<VistaContador cargo={cargo} />} />
        <Route path="/bodegav/*" element={<VistaGerente />} />
      </Routes>
    </Router>
  );
}


export default App;