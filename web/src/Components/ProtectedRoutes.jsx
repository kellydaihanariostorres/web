import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import storage from '../Storage/storage'

const ProtectedRoutes = ({ children }) => {
  const authToken = storage.get('authToken');
  
  // Verificar si el token está presente y es válido (no ha expirado)
  if (!authToken) {
    return <Navigate to='/' />;
  }
  
  // Verificar si el token está presente y es válido (no ha expirado) aquí
  
  return <Outlet />;
};

export default  ProtectedRoutes;

/// protector de rutas si no se logea recrese al login 