import React from 'react';

export interface AvatarProps {
  src?: string | null;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  text = 'АС',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={text}
        className={`${sizeStyles[size]} rounded-full object-cover shadow-sm ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeStyles[size]} rounded-full bg-gradient-to-tr from-[#0088cc] to-sky-400 text-white font-bold flex items-center justify-center shadow-sm tracking-wide ${className}`}
    >
      {text}
    </div>
  );
};
