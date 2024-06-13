import React from 'react';

const FormField = ({ label, id, type = "text", value, onChange }) => (
  <div className="grid items-center grid-cols-4 gap-4">
    <label htmlFor={id} className="text-right">{label}</label>
    {type === 'textarea' ? (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        className="col-span-3 border rounded-md p-2"
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="col-span-3 border rounded-md p-2"
      />
    )}
  </div>
);

export default FormField;
