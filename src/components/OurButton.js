import React from 'react';

function OurButton({ text, onClickDo, variant = 'gray', classNameProps = '', type = '', style='', disabled = false }) {
  const baseStyles = "px-5 py-2 text-base font-medium rounded-3xl transition-colors";

  let buttonStyles = "";

  switch (variant) {
    case 'blue':
      buttonStyles = "bg-blue-600 text-white hover:bg-blue-700";
      break;
    case 'red':
      buttonStyles = "bg-red-600 text-white hover:bg-red-700";
      break;
    case 'gray':
    default:
      buttonStyles = "bg-white text-black border border-gray-300 shadow-sm hover:shadow-md";
      break;
  }

  return (
    <button
      disabled={disabled}
      onClick={onClickDo}
      className={`${baseStyles} ${buttonStyles} ${classNameProps}`}
      {...(type !== "" ? { type } : {})}
      {...(style !== "" ? { style } : {})}
    >
      {text}
    </button>
  );
}

export default OurButton;