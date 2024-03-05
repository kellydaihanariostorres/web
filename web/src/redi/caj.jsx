import React from 'react';
import SideBar from '../VistasLogin/Caja';//menu
import { Routes, Route } from 'react-router-dom';
import Clientes from '../Views/Clientes/index';
import Productos from '../Views/Productos/index';
import Caja from '../Views/Caja/Index';
import Factura from '../Views/Caja/Factura';
import Navb from '../Components/Nav';
import Venta from '../Views/Caja/Venta';

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

// En esta paina encontramos el ruteo para el caja el cual yiene la vistas de todos  los demas componentes.
// solo es llamado de vistas a al menu

function Vistacaja({ cargo }) {
  console.log("Renderizando VistaCaja");
  return (
   <div>
    <Navb/>
    <div style={styles.flex}>
      <SideBar cargo={cargo} />
      <div className="content">
      <Routes>
        <Route index element={<Caja />} />
        <Route path="clientes/*" element={<Clientes />} />    
        <Route path="caja/*" element={<Venta />} />
      </Routes>
      </div>
    </div>
    </div> 
  );
}

export default Vistacaja;
