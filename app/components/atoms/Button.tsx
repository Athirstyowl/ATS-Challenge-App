import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: LucideIcon;
  isLoading?: boolean;
  children: ReactNode;
}

export const Button = ({
  children,
  variant = 'primary',
  icon,
  isLoading,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-md flex items-center justify-center transition-colors';
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <Icon icon={icon} size={16} className="mr-2" />}
          {children}
        </>
      )}
    </button>
  );
}; 