import React from 'react';

const Button = ({ onClick, children, className = "", variant = "primary" }) => {
  // Determine button styles based on variant
  let buttonClass = "px-4 py-2 rounded-md shadow-sm focus:outline-none";
  if (variant === "primary") {
    buttonClass += " bg-blue-500 text-white hover:bg-blue-600";
  } else if (variant === "danger") {
    buttonClass += " bg-red-500 text-white hover:bg-red-600";
  } else if (variant === "outline") {
    buttonClass += " border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-black-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:text-gray-50";
  }

  return (
    <button
      onClick={onClick}
      className={`${buttonClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
