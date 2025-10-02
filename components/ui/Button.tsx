
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-8 py-3 text-sm font-semibold uppercase tracking-wider rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform duration-200 transform hover:scale-105';
  
  const variantClasses = {
    primary: 'bg-kazumi-black text-white hover:bg-gray-800 focus:ring-kazumi-black',
    secondary: 'bg-transparent border border-kazumi-black text-kazumi-black hover:bg-kazumi-black hover:text-white focus:ring-kazumi-black',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
