import React from 'react';

const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50">
      <div className="bg-white dark:bg-gray-400 rounded-lg shadow-lg p-[2px]">
        {children}
      </div>
    </div>
  );
};

export default Dialog;
