import React from 'react';
import FormDep from '../../Components/Crear/FormCli';

const Create = () => {
  console.log("carga")
  
  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <div className='col-md-12'>
          <h2 className='text-center mt-4'>Crear Cliente</h2>
          
          <FormDep id={null} title='Crear Cliente' />
        </div>
      </div>
    </div>
  );
}

export default Create;

