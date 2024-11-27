import React from 'react';

interface InputBoxProps {
  label: string;
  type:string;
  placeholder: string;
  inputClassName?: string;
  value: string | number; // The current value of the input field
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ label, type,placeholder, inputClassName,value,onChange}) => {
  return (
    <div className="mb-4">
      <label className="mb-1">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        className={`mx-3 ${inputClassName}`} 
        value={value} 
        onChange={onChange}
      />
    </div>
  );
};

export default InputBox;