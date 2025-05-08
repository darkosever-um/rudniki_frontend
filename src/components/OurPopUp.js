import React from 'react';
import OurButton from './OurButton';

const OurPopUp = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[50%] overflow-y-auto relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <br/>
        <OurButton
          onClickDo={onClose}
          text={"Vredu"}
          variant='blue'
        />
      </div>
    </div>
  );
};

export default OurPopUp;