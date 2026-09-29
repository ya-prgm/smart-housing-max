import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'outline';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white rounded-3xl p-5 border border-slate-100/90 shadow-card',
    flat: 'bg-slate-50 rounded-2xl p-4 border border-slate-200/60',
    outline: 'bg-white rounded-2xl p-4 border border-slate-200',
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
