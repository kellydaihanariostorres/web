import React, { forwardRef, useEffect, useRef } from 'react';

export default forwardRef (({
      type = 'text',
      icon = 'user',
      placeholder = '',
      name,
      id,
      value,
      className,
      required,
      isFocused,
      handleChange,
    },
    ref
  ) => {
    const input = ref ? ref : useRef();

    useEffect(() => {
      if (isFocused) {
        input.current.focus();
      }
    }, [isFocused]);

    const inputStyles = {
      backgroundColor: 'black !important',
      color: 'white !important',
      
    };

    return (
      <div className='input-group mb-3'>
        <span className='input-group-text'>
          <i className={'fa-solid ' + icon}></i>
        </span>
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          id={id}
          value={value}
          className={`${className} custom-input`} 
          ref={input}
          required={required}
          onChange={(e) => handleChange(e)}
          
        />
      </div>
    );
  }
);


