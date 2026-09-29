import React from 'react';

export interface IconProps {
  name: string;
  size?: number | string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size, className = '' }) => {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={size ? { fontSize: typeof size === 'number' ? `${size}px` : size } : undefined}
    >
      {name}
    </span>
  );
};
