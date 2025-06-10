import React, { forwardRef } from "react";

const MyInput = forwardRef(({
  label,
  onKeyDown,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  disabled,
}, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}  // вот тут пробрасываем ref!
        disabled={disabled}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        onKeyDown={onKeyDown}
        autoComplete="off"
        className={`px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 ${className}`}
      />
    </div>
  );
});

export default MyInput;
