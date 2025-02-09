import React, { useState } from "react";
import ValidateMessage from "./validateMessage";

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  helperText,
  className = "",
  validationMessage,
  validationType = "info",
  children,
}) => {
  const [builtinValidationMessage, setBuiltinValidationMessage] = useState("");

  const handleBlur = (event) => {
    if (!event.target.validity.valid) {
      setBuiltinValidationMessage(event.target.validationMessage);
    } else {
      setBuiltinValidationMessage("");
    }
  };

  const handleChange = (e) => {
    // Pass both name and value to parent's onChange
    onChange({ target: { name: name, value: e.target.value } });
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      {label && (
        <label className="text-base font-medium text-gray-700">{label}</label>
      )}

      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md 
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}`}
        >
          {children}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md 
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}`}
        />
      )}

      {helperText && (
        <span className="text-sm text-gray-500">{helperText}</span>
      )}

      <ValidateMessage
        message={builtinValidationMessage || validationMessage}
        type={validationType}
      />
    </div>
  );
};

export default InputField;
