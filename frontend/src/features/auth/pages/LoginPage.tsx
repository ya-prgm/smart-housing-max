import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EsiaButton } from '../components/EsiaButton';
import { authApi } from '../api';
import { useHaptic } from '../../../shared/hooks/useHaptic';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { impact, notification } = useHaptic();

  const [viewMode, setViewMode] = useState<'welcome' | 'credentials'>('welcome');
  const [identifier, setIdentifier] = useState('123-456-789 01');
  const [password, setPassword] = useState('demo_password');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStartLogin = () => {
    impact('light');
    setViewMode('credentials');
  };

  const handleQuickSelectRole = (snils: string) => {
    impact('light');
    setIdentifier(snils);
    setPassword('demo_password');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    impact('medium');
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await authApi.loginWithEsia(identifier, password);
      notification('success');

      if (response.hasPin) {
        navigate('/auth/pin-enter');
      } else {
        navigate('/auth/pin-setup');
      }
    } catch {
      notification('error');
      setErrorMessage('Неверный логин или пароль в ЕСИА');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWelcome = () => {
    impact('light');
    if (viewMode === 'credentials') {
      setViewMode('welcome');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="bg-[#18181b] sm:bg-[#E2E7EE] flex justify-center items-center min-h-screen p-0 sm:p-4 font-sans antialiased text-gray-900 select-none">
      <main className="w-full max-w-[412px] h-[100dvh] sm:h-[860px] bg-white sm:bg-[#EEF2F6] flex flex-col justify-between shadow-2xl relative sm:rounded-[36px] overflow-hidden sm:border sm:border-slate-300">
        <header className="w-full flex items-center px-4 pt-3 pb-1 z-10">
          <button
            type="button"
            onClick={handleBackToWelcome}
            className="p-2 -ml-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </header>

        {viewMode === 'welcome' ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-12">
            <div className="w-32 h-32 mb-6 flex items-center justify-center">
              <img
                alt="Госуслуги"
                className="w-full h-full object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnouAPZGoCqWMFo556OLHG3KYADGNVnmsYLb4kKGiMG0yPww2iJRcQ-bK5J7lTbTK_beSiSrO5fZv8GonHQ-4a8Xv56CVSq4w90cDtKaa53FOqAe48ulzx30oThbv0Q6WgylCI6St_F_ZLxq3GmqTYv_ePReuFxZ-aB_wrXWSBeqzoi0IMwzDb2rXAFRqBd9DCQZFFaloIghG90NsmHOfl_AQO50u_LGfX9J9NSHZ9BSqsdRyaeDPbQjNRjvOM0m5S"
              />
            </div>

            <h1 className="text-[22px] sm:text-[23px] font-semibold text-gray-900 text-center tracking-tight mb-8">
              Войдите через Госуслуги
            </h1>

            <div className="w-full max-w-[340px] flex flex-col items-center gap-4">
              <EsiaButton onClick={handleStartLogin} text="По логину и паролю" />

              <p className="text-center text-[13.5px] leading-[1.4] text-gray-500 font-normal px-2">
                Для авторизации нужна подтверждённая учётная запись.{' '}
                <a
                  className="text-[#3056D3] hover:underline font-normal inline-block ml-0.5"
                  href="#help"
                  onClick={(e) => {
                    e.preventDefault();
                    impact('light');
                  }}
                >
                  Нужна помощь?
                </a>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 px-3.5 pt-1 pb-4 flex flex-col justify-start overflow-y-auto">
            <div className="w-full bg-white rounded-[22px] border border-[#D5DCE5] shadow-sm px-5 py-6 flex flex-col items-center">
              <div className="w-full max-w-[210px] my-1 flex justify-center items-center">
                <img
                  alt="Госуслуги"
                  className="w-full h-auto object-contain select-none"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMXM2xw4s5Sk8Or4ZdY9Czzf9ODqy104SKACQrD87jnYSysKvcSS9bkblUDax5k3xqU8H5I1H-gpo9_pu82Ui9fMuOupWfGf4JIUuz6IwREVI_2eoTzn5PTbw40OJpD7OmhuvnMmAxjDWEInSh73wyX2WPMbqNBwFmAmPgcSfm3BuImruT-3SyylzV7_qKycOWvsqv7C-Q4z04_O1rUNOkakb7W5plqWG3pon9mWwlDBjgysjLWzxRkW2Kx-6zw0yY"
                />
              </div>

              <div className="w-full flex items-center justify-center gap-1.5 my-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleQuickSelectRole('123-456-789 01')}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                    identifier === '123-456-789 01' ? 'bg-[#0C73FE] text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Житель
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelectRole('987-654-321 00')}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                    identifier === '987-654-321 00' ? 'bg-[#0C73FE] text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Председатель
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelectRole('111-222-333 44')}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                    identifier === '111-222-333 44' ? 'bg-[#0C73FE] text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  УК
                </button>
              </div>

              {errorMessage && (
                <div className="w-full mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs text-center font-medium">
                  {errorMessage}
                </div>
              )}

              <form className="w-full flex flex-col" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-[13px] font-medium text-[#475467] mb-1.5 text-left"
                    htmlFor="login-identifier"
                  >
                    Телефон / Эл. почта / СНИЛС
                  </label>
                  <input
                    id="login-identifier"
                    name="identifier"
                    type="text"
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Введите данные"
                    className="w-full h-[46px] px-3.5 text-[15px] text-slate-800 bg-white border border-[#CFD6DE] rounded-xl transition duration-150 ease-in-out focus:border-[#0b5dd7] focus:ring-2 focus:ring-[#0b5dd7]/20 focus:outline-none"
                  />
                </div>

                <div className="mb-2">
                  <label
                    className="block text-[13px] font-medium text-[#475467] mb-1.5 text-left"
                    htmlFor="login-password"
                  >
                    Пароль
                  </label>
                  <div className="relative w-full">
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Введите пароль"
                      className="w-full h-[46px] pl-3.5 pr-11 text-[15px] text-slate-800 bg-white border border-[#CFD6DE] rounded-xl transition duration-150 ease-in-out focus:border-[#0b5dd7] focus:ring-2 focus:ring-[#0b5dd7]/20 focus:outline-none"
                    />
                    <button
                      type="button"
                      aria-label="Показать пароль"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5 stroke-current"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 stroke-current"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-left mb-6">
                  <a
                    className="text-[13px] font-medium text-[#0B5DD7] hover:underline hover:text-[#094bb0]"
                    href="#recover"
                    onClick={(e) => e.preventDefault()}
                  >
                    Восстановить
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[48px] bg-[#0C73FE] hover:bg-[#0062e3] active:bg-[#0055c4] text-white font-semibold text-[15px] rounded-xl shadow-[0_2px_4px_rgba(12,115,254,0.2)] transition duration-150 flex items-center justify-center tracking-wide disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? 'Проверка...' : 'Войти'}
                </button>

                <div className="text-center mt-4">
                  <a
                    className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition"
                    href="#cant-login"
                    onClick={(e) => e.preventDefault()}
                  >
                    Не удаётся войти
                  </a>
                </div>

                <div className="w-full border-t border-slate-100 my-5" />

                <div className="text-center">
                  <a
                    className="text-[13px] font-medium text-[#0B5DD7] hover:underline hover:text-[#094bb0]"
                    href="#other-methods"
                    onClick={(e) => e.preventDefault()}
                  >
                    Войти другим способом. Подробнее
                  </a>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};