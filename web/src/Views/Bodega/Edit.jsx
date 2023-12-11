import React from 'react';
import { useParams } from 'react-router-dom';
import FormDep from '../../Components/Crear/FormDep';

const Edit = () => {
    const {id} = useParams();
    return (
      <FormDep id={id} title='Editar cliente'></FormDep>
    )
}

export default Edit