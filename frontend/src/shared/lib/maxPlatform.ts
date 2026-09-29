export const isMaxApp = (): boolean => {
  return typeof window !== 'undefined' && Boolean(window.WebApp?.initData);
};

export const getMaxPlatform = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  return window.WebApp?.platform || 'web';
};

export const isDesktopPlatform = (): boolean => {
  const p = getMaxPlatform();
  return p === 'desktop' || p === 'macos' || p === 'tdesktop' || p === 'weba';
};
