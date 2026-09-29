import React, { useEffect, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface ResponsiveGuardProps {
  children: React.ReactNode;
  role?: string;
  minWidth?: number;
  fallback?: React.ReactNode;
}

export const ResponsiveGuard: React.FC<ResponsiveGuardProps> = ({
  children,
  role,
  minWidth = 0,
  fallback,
}) => {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDesktopMode = role === 'uk_staff';
  const isPlatformDesktop = typeof window !== 'undefined' && (window.WebApp?.platform === 'desktop' || isLargeScreen);

  if (isDesktopMode && !isPlatformDesktop && width < (minWidth || 1024)) {
    return fallback || <ScreenTooSmallFallback type="desktop" />;
  }

  if (!isDesktopMode && width < (minWidth || 320)) {
    return fallback || <ScreenTooSmallFallback type="mobile" />;
  }


  return <>{children}</>;
};

interface ScreenTooSmallFallbackProps {
  type: 'mobile' | 'desktop';
}

export const ScreenTooSmallFallback: React.FC<ScreenTooSmallFallbackProps> = ({ type }) => {
  return (
    <div className="fixed inset-0 bg-surface flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center justify-center px-6 text-center max-w-sm">
        <div className="w-20 h-20 mb-6 flex items-center justify-center bg-primary/10 rounded-full">
          <span className="material-symbols-outlined text-4xl text-primary">desktop_mac</span>
        </div>

        <h1 className="text-xl font-bold text-on-surface mb-2">
          {type === 'desktop'
            ? 'Панель УК доступна на компьютере'
            : 'Экран слишком узкий'}
        </h1>

        <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
          {type === 'desktop'
            ? 'Пожалуйста, откройте приложение на компьютере с шириной экрана не менее 1024px.'
            : 'Пожалуйста, разверните окно браузера.'}
        </p>

        <div className="flex flex-col gap-2 w-full text-xs text-on-surface-variant bg-surface-container rounded-xl p-4 text-left">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>Минимальная ширина: {type === 'desktop' ? '1024px' : '320px'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>Текущая ширина: {typeof window !== 'undefined' ? window.innerWidth : 0}px</span>
          </div>
        </div>
      </div>
    </div>
  );
};
