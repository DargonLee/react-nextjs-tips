import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive' | 'Sean';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
  className?: string;
}

export function Button({ 
  variant = 'primary', 
  children, 
  onClick, 
  disabled = false, 
  type = 'button', 
  style, 
  className 
}: ButtonProps) {
  // 🐍 Python: Like function parameters with defaults
  // def button(variant='primary', children=None, on_click=None, disabled=False):
  
  return (
    <button 
      className={`btn btn-${variant} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;