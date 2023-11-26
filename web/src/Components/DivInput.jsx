import React, { forwardRef, useEffect, useRef } from 'react';

const DivInput = forwardRef(
  (
    {
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
          className={className}
          ref={input}
          required={required}
          onChange={(e) => handleChange(e)}
        />
      </div>
    );
  }
);

export default DivInput;