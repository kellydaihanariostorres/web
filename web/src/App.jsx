import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import ProtectedRoutes from '../src/Components/ProtectedRoutes';
import VistaAdministrador from './redi/admi';
import VistaCaja from './redi/caj';
import VistaGerente from './redi/bod';
import Login from '../src/Views/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/administradorv/*" element={<VistaAdministrador />} />
          <Route path="/cajav/*" element={<VistaCaja />} />
          <Route path="/bodegav/*" element={<VistaGerente />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
