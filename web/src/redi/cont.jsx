import React from 'react';
import SideBar from '../VistasLogin/Cotador';//menu
import { Routes, Route } from 'react-router-dom';
import Home from '../Views/Home/Home';
import Bodega from '../Views/Bodega/Index';
import Empleado from '../Views/Empleados/Index';
import Clientes from '../Views/Clientes/index';
import Productos from '../Views/Productos/index';
import Caja from '../Views/Caja/Index';
import Inventario from '../Views/Inventario/Index';
import Pago from '../Views/Pagos/Index';
import Proveedor from '../Views/Proveedor/Index';
import Factura from '../Views/Caja/Factura';
import Navb from '../Components/Nav';

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

// En esta paina encontramos el ruteo para el contador el cual yiene la vistas de todos  los demas componentes.
// solo es llamado de vistas a al menu 

function Vistacontador({ cargo }) {
  return (
   <div> 
    <Navb/>
    <div style={styles.flex}>
      <SideBar cargo={cargo} />
      <div className="content">
        <Routes>
              <Route index element={<Home />} />    
              <Route path="/empleado/*" element={<Empleado/>}/>
              <Route path="/pago/*" element={<Pago/>}/>
              <Route path="/proveedor/*" element={<Proveedor/>}/>
              <Route path="proveedor/*" element={<Proveedor />} />
        </Routes>
      </div>
    </div>
    </div>
  );
}

export default Vistacontador;
