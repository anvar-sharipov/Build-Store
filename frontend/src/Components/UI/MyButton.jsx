import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const variantClasses = {
  green: "gap-1 border-2 border-green-500 rounded-md px-3 py-1 hover:bg-green-500 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2", 
  blue: "gap-1 border-2 border-blue-500 rounded-md px-3 py-1 hover:bg-blue-500 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  red: "gap-1 border-2 border-red-500 rounded-md px-3 py-1 hover:bg-red-500 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
  disabled: "bg-gray-400 cursor-not-allowed"
};

const MyButton = forwardRef(({children, variant, disabled, className = '', ...props}, ref) => {
  const variantClass = variantClasses[variant] || '';
  const disabledClass = disabled ? variantClasses.disabled : '';
  const combinedClassName = `${variantClass} ${disabledClass} ${className}`.trim();

  return (
    <motion.button
      ref={ref}  // вот тут передаем ref дальше
      className={combinedClassName}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  )
});

export default MyButton;
