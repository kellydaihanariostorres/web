import React from 'react';
import { Link } from 'react-router-dom';


function SideBar({ cargo }) {
  return (
    <div>
     
      <h2>Menú Lateral</h2>
      <nav>
        {cargo === 'administrador' && (
          <>
            <Link to='/' className='text-white rounded py-2 w-100 d-inline-block px-2' activeclassname="activa"><FaIcons.FaHome className='me-3'/>
                INICIO
            </Link>
            <Link to='/clientes' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaQq  className='me-3'/>
                CLIENTES
            </Link>
            <Link to='/empleado' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaPray  className='me-2'/>
                EMPLEADOS
            </Link>
            <Link to='/productos' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaArchive className='me-2'/>
                PRODUCTOS
            </Link>
            <Link to='/proveedor' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaRegHandLizard className='me-2'/>
                PROVEEDOR
            </Link>
            <Link to='/pago' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaRegCreditCard className='me-3'/>
                PAGOS
            </Link>
            <Link to='/caja' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaBarcode className='me-2'/>
                CAJA
            </Link>
            <Link to='/bodega' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaArchway className='me-2'/>
                BODEGAS
            </Link>
            <Link to='/inventario' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaClipboard className='me-2'/>
                INVENTARIO
            </Link>
            <Link to='/facturas' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaClipboard className='me-2'/>
                FACTURAS
            </Link>
          </>
        )}
        {cargo === 'caja' && (
          <>
            
            <Link to='/facturas' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaClipboard className='me-2'/>
                FACTURAS
            </Link>
            
          </>
        )}
        {cargo === 'gerente' && (
          <>
            <Link to='/' className='text-white rounded py-2 w-100 d-inline-block px-2' activeclassname="activa"><FaIcons.FaHome className='me-3'/>
                INICIO
            </Link>
            <Link to='/bodega' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaArchway className='me-2'/>
                BODEGAS
            </Link>
            <Link to='/inventario' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaClipboard className='me-2'/>
                INVENTARIO
            </Link>
            <Link to='/productos' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaArchive className='me-2'/>
                PRODUCTOS
            </Link>
            <Link to='/proveedor' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaRegHandLizard className='me-2'/>
                PROVEEDOR
            </Link>
            
          </>
        )}
        {cargo === 'contador' && (
          <>
            <Link to='/' className='text-white rounded py-2 w-100 d-inline-block px-2' activeclassname="activa"><FaIcons.FaHome className='me-3'/>
                INICIO
            </Link>
            <Link to='/pago' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaRegCreditCard className='me-3'/>
                PAGOS
            </Link>
            <Link to='/proveedor' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaRegHandLizard className='me-2'/>
                PROVEEDOR
            </Link>
            <Link to='/empleado' className='text-white rounded py-2 w-100 d-inline-block px-2'><FaIcons.FaPray  className='me-2'/>
                EMPLEADOS
            </Link>
            
          </>
        )}
        
      </nav>
    </div>
  );
}

export default SideBar;
