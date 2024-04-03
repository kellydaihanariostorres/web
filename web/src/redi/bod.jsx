import React from 'react';
import SideBar from '../VistasLogin/Gerente';// menu
import { Routes, Route } from 'react-router-dom';
import Home from '../Views/Home/Home';
import Bodega from '../Views/Bodega/Bodega_bodega';
import Productos from '../Views/Productos/index';
import Inventario from '../Views/Inventario/Index';
import Proveedor from '../Views/Proveedor/Proveedores_bodega';
import Navb from '../Components/Nav';
import Facturaproveedor from '../Views/Proveedor/Factura';
import Pedidos from '../Views/Proveedor/Pedidos'

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
// solo es llamado de vistas al menu

function Vistabodega({ cargo }) {
  return (
   <div>
    <Navb/>
    <div style={styles.flex}>
      <SideBar cargo={cargo} />
      <div className="content">
        <Routes>
              <Route index element={<Home />} />
              <Route path="/productos/*" element={<Productos/>}/>
              <Route path="/inventario/*" element={<Inventario/>}/>
              <Route path="/proveedores/*" element={<Proveedor/>}/>
              <Route path="bodegas/*" element={<Bodega />} />
              <Route path="pedido/*" element={<Pedidos/>} />
              <Route path="facturaproveedor/*" element={<Facturaproveedor />} />
        </Routes>
      </div>
    </div> 
  </div>
  );
}


export default Vistabodega;
