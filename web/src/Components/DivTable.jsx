import React from 'react'

const DivTable = ({children, col, off, classLoad, classTable}) => {
  return (
    <div className='rpw mt-3'>
      <div className={'col-md'+col+'offset-md.'+off}>
        <div className={'card border-wite text-center'+classLoad}>
         
        </div>
      </div>
      <div className={'table-responsive'+ classTable}>
        {children}
      </div>
    </div>
  )
}

export default DivTable