import React from 'react';
import FormDep from '../../Components/Crear/FormPro';

const Create = () => {
  
  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <div className='col-md-12'>
          <h2 className='text-center mt-4'>Crear Productos</h2>
          
          <FormDep id={null} title='Crear Bodegas' />
        </div>
      </div>
    </div>
  );
}

export default Create;

