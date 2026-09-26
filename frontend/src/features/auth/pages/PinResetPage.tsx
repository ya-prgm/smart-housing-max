import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from '../../../shared/hooks/useHaptic';
import { authApi } from '../api';

export const PinResetPage: React.FC = () => {
  const navigate = useNavigate();
  const { impact, notification } = useHaptic();

  const [isDismissing, setIsDismissing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleDismiss = () => {
    impact('light');
    setIsDismissing(true);
    setTimeout(() => {
      navigate(-1);
    }, 280);
  };

  const handleConfirmReset = async () => {
    impact('heavy');
    setIsResetting(true);
    notification('warning');

    try {
      await authApi.resetPinCode();
    } catch {}

    setTimeout(() => {
      setIsDismissing(true);
      setTimeout(() => {
        navigate('/auth/login');
      }, 250);
    }, 600);
  };

  return (
    <div className="h-full min-h-screen bg-[#f7f9ff] text-[#141c24] relative select-none">
      <main className="flex-1 flex flex-col relative w-full pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex flex-col items-center pt-8 pb-32 px-4 opacity-45 pointer-events-none transition-opacity duration-300 select-none">
          <h1 className="text-[22px] font-semibold text-[#141c24] mb-24 tracking-tight">
            Пин-код
          </h1>
          <p className="text-[16px] text-[#3e4850] font-medium mb-6">Введите код</p>
          <div className="flex items-center justify-center gap-4 mb-20">
            <div className="w-3.5 h-3.5 rounded-full bg-[#afc6ff]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#dae3ef]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#dae3ef]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#dae3ef]" />
          </div>
          <div className="w-24 h-24 rounded-full bg-[#e6effa] flex items-center justify-center opacity-60">
            <svg
              className="w-8 h-8 text-[#6e7881]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
        </div>

        <div
          onClick={handleDismiss}
          className={`fixed inset-0 bg-[#29313a]/40 backdrop-blur-xs transition-opacity duration-300 z-40 ${
            isDismissing ? 'opacity-0' : 'opacity-100'
          }`}
        />

        <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col justify-end max-w-lg mx-auto">
          <div
            className={`bg-white rounded-t-[32px] shadow-xl px-4 pt-3 pb-8 flex flex-col items-center text-center transform transition-transform duration-300 ease-out ${
              isDismissing ? 'translate-y-full' : 'translate-y-0'
            }`}
          >
            <div className="w-10 h-1.5 bg-[#dae3ef] rounded-full mb-4" />

            <div className="relative w-full max-w-[240px] aspect-[4/3] flex items-center justify-center my-1">
              <svg
                className="w-full h-full drop-shadow-sm"
                fill="none"
                viewBox="0 0 240 180"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="120" cy="95" fill="#ecf4ff" r="70" />
                <path
                  d="M120 30C160 30 190 60 188 100C186 140 150 160 120 160C90 160 52 140 52 100C52 60 80 30 120 30Z"
                  fill="#809dff"
                  fillOpacity="0.18"
                />
                <path
                  d="M64 175C66 145 78 122 96 112C106 106 134 106 144 112C162 122 174 145 176 175"
                  fill="#2aabee"
                  fillOpacity="0.25"
                  stroke="#141c24"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
                <path
                  d="M82 175C84 150 92 135 106 128"
                  stroke="#141c24"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <path
                  d="M158 175C156 150 148 135 134 128"
                  stroke="#141c24"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <path
                  d="M110 110V95H130V110"
                  stroke="#141c24"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
                <path
                  d="M104 110C110 116 130 116 136 110"
                  fill="#ffffff"
                  stroke="#141c24"
                  strokeWidth="2.5"
                />
                <path
                  d="M98 75C96 55 106 42 120 42C134 42 144 55 142 75C141 87 132 96 120 96C108 96 99 87 98 75Z"
                  fill="#ffffff"
                  stroke="#141c24"
                  strokeWidth="2.5"
                />
                <path
                  d="M96 68C94 56 102 44 116 41C130 38 143 45 144 55C145 61 140 64 140 68C137 60 134 56 124 56C112 56 106 63 96 68Z"
                  fill="#141c24"
                />
                <circle cx="112" cy="70" fill="#ffffff" r="8" stroke="#141c24" strokeWidth="2.2" />
                <circle cx="128" cy="70" fill="#ffffff" r="8" stroke="#141c24" strokeWidth="2.2" />
                <path
                  d="M120 70H120.5"
                  stroke="#141c24"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
                <circle cx="113" cy="69" fill="#141c24" r="2.2" />
                <circle cx="129" cy="69" fill="#141c24" r="2.2" />
                <path
                  d="M106 60C109 59 115 60 118 63"
                  stroke="#141c24"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <path
                  d="M124 63C127 60 133 59 136 60"
                  stroke="#141c24"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <path
                  d="M120 71V76H122"
                  stroke="#141c24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M117 84C120 85 124 85 126 84"
                  stroke="#141c24"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <path
                  d="M138 108C136 94 130 84 130 84L128 92"
                  stroke="#141c24"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
                <path
                  d="M130 84C129 80 126 77 124 78C122 79 122 83 123 88"
                  fill="#ffffff"
                  stroke="#141c24"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M140 125C148 116 156 122 165 132"
                  stroke="#141c24"
                  strokeLinecap="round"
                  strokeWidth="2.2"
                />
                <path
                  d="M148 128C154 125 158 128 162 136"
                  stroke="#141c24"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <circle cx="160" cy="50" fill="#2aabee" r="3" />
                <circle cx="168" cy="40" fill="#006591" r="5" />
                <path
                  d="M180 32C181 27 186 25 190 28C193 30 193 34 190 37C188 39 187 42 187 44M187 50H187.01"
                  stroke="#0056c4"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            <h2 className="text-[26px] font-bold text-[#141c24] mt-2 mb-2 tracking-tight">
              Сбросить короткий код?
            </h2>

            <p className="text-[14px] text-[#3e4850] max-w-[290px] mb-8 leading-relaxed">
              Нужно будет заново авторизоваться через Госуслуги
            </p>

            <div className="w-full flex flex-col gap-3">
              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={isResetting}
                className="w-full h-12 rounded-full bg-[#006df5] hover:bg-[#0056c4] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 shadow-sm focus:outline-none cursor-pointer"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-[15px] text-white font-semibold">
                  {isResetting ? 'Сброс...' : 'Да, сбросить'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-full h-11 rounded-full bg-[#ecf4ff] hover:bg-[#e6effa] active:bg-[#dae3ef] active:scale-[0.98] transition-all duration-150 flex items-center justify-center focus:outline-none cursor-pointer"
              >
                <span className="text-[15px] text-[#0056c4] font-medium">Назад</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};