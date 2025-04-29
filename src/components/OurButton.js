import React from 'react';

function OurButton({ text, onClickDo, variant = 'gray' }) {
    const baseStyles = "px-5 py-2 text-base font-medium rounded-3xl transition-colors";
    const blueButtonStyles = "bg-blue-600 text-white hover:bg-blue-700";
    const whiteButtonStyles = "bg-white text-black border border-gray-300 shadow-sm hover:shadow-md";
  
    // Apply styles based on the variant
    const buttonStyles = variant === 'blue' ? blueButtonStyles : whiteButtonStyles;
  
    return (
      <button
        onClick={onClickDo}
        className={`${baseStyles} ${buttonStyles}`}
      >
        {text}
      </button>
    );
  }

export default OurButton;