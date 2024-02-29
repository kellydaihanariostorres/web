import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import storage from '../Storage/storage'

export const ProtectedRoutes = ({children }) => {
  const authUser = storage.get('authUser');
  if(!authUser){
    return <Navigate to ='/' />
  }
  return <Outlet />
}

export default ProtectedRoutes

/// protector de rutas si no se logea recrese al login 