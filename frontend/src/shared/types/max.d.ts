export interface MaxUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export type HapticImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
export type HapticNotificationType = 'error' | 'success' | 'warning';

export interface MaxHapticFeedback {
  impactOccurred?: (style: HapticImpactStyle) => void;
  notificationOccurred?: (type: HapticNotificationType) => void;
  selectionChanged?: () => void;
}

export interface MaxBackButton {
  isVisible?: boolean;
  show?: () => void;
  hide?: () => void;
  onClick?: (callback: () => void) => void;
  offClick?: (callback: () => void) => void;
}

export interface MaxMainButton {
  text?: string;
  color?: string;
  textColor?: string;
  isVisible?: boolean;
  isActive?: boolean;
  isProgressVisible?: boolean;
  setText?: (text: string) => void;
  onClick?: (callback: () => void) => void;
  offClick?: (callback: () => void) => void;
  show?: () => void;
  hide?: () => void;
  enable?: () => void;
  disable?: () => void;
  showProgress?: (leaveActive?: boolean) => void;
  hideProgress?: () => void;
}

export interface MaxSecureStorage {
  setItem?: (key: string, value: string) => void;
  getItem?: (key: string) => string | null;
  removeItem?: (key: string) => void;
  clear?: () => void;
}

export interface MaxBiometricManager {
  isInited?: boolean;
  isBiometricAvailable?: boolean;
  biometricType?: 'fingerprint' | 'face' | 'unknown';
  isAccessRequested?: boolean;
  isAccessGranted?: boolean;
  authenticate?: (
    params: { reason: string },
    callback: (isAuthenticated: boolean) => void
  ) => void;
}

export interface MaxWebApp {
  initData?: string;
  initDataUnsafe?: {
    query_id?: string;
    user?: MaxUser;
    auth_date?: number;
    hash?: string;
  };
  version?: string;
  platform?: 'ios' | 'android' | 'desktop' | 'web';
  colorScheme?: 'light' | 'dark';
  themeParams?: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded?: boolean;
  viewportHeight?: number;
  viewportStableHeight?: number;
  BackButton?: MaxBackButton;
  MainButton?: MaxMainButton;
  HapticFeedback?: MaxHapticFeedback;
  SecureStorage?: MaxSecureStorage;
  BiometricManager?: MaxBiometricManager;
  ready?: () => void;
  expand?: () => void;
  close?: () => void;
  enableClosingConfirmation?: () => void;
  disableClosingConfirmation?: () => void;
  sendData?: (data: string) => void;
}

declare global {
  interface Window {
    WebApp?: MaxWebApp;
    PublicKeyCredential?: unknown;
  }
}