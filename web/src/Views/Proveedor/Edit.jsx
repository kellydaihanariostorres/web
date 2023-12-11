import React from 'react'
import { useParams } from 'react-router-dom';
import FormCli from '../../Components/Crear/FormProv';
const Edit = () => {
    const {id} = useParams();
  return (
    <FormCli id={id} title='Editar cliente'></FormCli>
  )
}

export default Edit