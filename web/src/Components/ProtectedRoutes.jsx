import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import storage from '../Storage/storage';

const ProtectedRoutes = () => {
  const authToken = storage.get('authToken');

  // Verificar si el token está presente y es válido (no ha expirado)
  if (!authToken) {
    return <Navigate to="/" />;
  }

  // Aquí puedes agregar lógica adicional para verificar la validez del token, si es necesario

  return <Outlet />;
};

export default ProtectedRoutes;
