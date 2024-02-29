import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import './App.scss';
import ProtecdRoutes from './Components/ProtectedRoutes';
import VistaAdministrador from './redi/admi';
import VistaCaja from './redi/caj';
import VistaContador from './redi/cont';
import VistaGerente from './redi/bod';
import Login from '../src/Views/Login';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtecdRoutes/>}>
        <Route path="/administradorv/*" element={<VistaAdministrador />} />
        <Route path="/cajav/*" element={<VistaCaja />} />
        <Route path="/contadorv/*" element={<VistaContador />} />
        <Route path="/bodegav/*" element={<VistaGerente />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;