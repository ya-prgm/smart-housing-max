import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from '../../../shared/hooks/useHaptic';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { impact } = useHaptic();

  const [isNavigating, setIsNavigating] = useState(false);
  const [isCodeDrawerOpen, setIsCodeDrawerOpen] = useState(false);

  const handleStartAuth = () => {
    impact('medium');
    setIsNavigating(true);

    setTimeout(() => {
      navigate('/auth/login');
    }, 700);
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col relative select-none">
      <main className="flex-1 flex flex-col relative w-full bg-surface pt-safe pb-safe">
        <div className="flex flex-col w-full">
           
          <div className="px-4 pt-3 pb-36 flex flex-col items-center max-w-[440px] mx-auto w-full">
            
             
            <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center mb-3">
               
              <div className="absolute inset-0 bg-gradient-to-tr from-[#2aabee]/25 via-[#0056c4]/15 to-transparent rounded-full blur-2xl transform -translate-y-2 pointer-events-none" />

               
              <svg
                className="relative z-10 w-full h-full drop-shadow-md"
                fill="none"
                viewBox="0 0 320 240"
                xmlns="http://www.w3.org/2000/svg"
              >
                 
                <ellipse cx="160" cy="205" fill="#DAE3EF" opacity="0.6" rx="130" ry="24" />
                <path
                  d="M60 205 C90 190 230 190 260 205 C230 216 90 216 60 205 Z"
                  fill="#89CEFF"
                  opacity="0.4"
                />

                 
                <circle cx="70" cy="180" fill="#10B981" opacity="0.85" r="14" />
                <circle cx="82" cy="186" fill="#059669" r="10" />
                <rect fill="#004C6E" height="12" rx="2" width="4" x="73" y="190" />
                <circle cx="250" cy="182" fill="#10B981" opacity="0.85" r="13" />
                <circle cx="238" cy="188" fill="#059669" r="9" />
                <rect fill="#004C6E" height="10" rx="2" width="4" x="246" y="191" />

                 
                <rect fill="#FFFFFF" height="145" rx="14" width="100" x="110" y="55" />

                 
                <path
                  d="M190 55 H196 C203.732 55 210 61.268 210 69 V186 C210 193.732 203.732 200 196 200 H190 V55 Z"
                  fill="#E6EFFA"
                />

                 
                <rect fill="#2AABEE" height="13" rx="4" width="70" x="125" y="42" />
                <rect fill="#006591" height="10" rx="3" width="24" x="148" y="32" />
                <line
                  stroke="#006591"
                  strokeLinecap="round"
                  strokeWidth="3"
                  x1="160"
                  x2="160"
                  y1="20"
                  y2="32"
                />

                 
                 
                <rect fill="#89CEFF" height="20" opacity="0.8" rx="4" width="18" x="124" y="68" />
                <rect fill="#FEF08A" height="20" rx="4" width="18" x="151" y="68" />
                <rect fill="#89CEFF" height="20" opacity="0.9" rx="4" width="18" x="178" y="68" />

                 
                <rect fill="#FEF08A" height="20" rx="4" width="18" x="124" y="98" />
                <rect fill="#89CEFF" height="20" opacity="0.6" rx="4" width="18" x="151" y="98" />
                <rect fill="#FEF08A" height="20" rx="4" width="18" x="178" y="98" />

                 
                <rect fill="#89CEFF" height="20" opacity="0.85" rx="4" width="18" x="124" y="128" />
                <rect fill="#FEF08A" height="20" rx="4" width="18" x="151" y="128" />
                <rect fill="#89CEFF" height="20" opacity="0.7" rx="4" width="18" x="178" y="128" />

                 
                <rect fill="#003C58" height="32" rx="4" width="36" x="142" y="168" />
                <rect fill="#C9E6FF" height="26" rx="2" width="28" x="146" y="174" />
                <rect fill="#2AABEE" height="4" rx="2" width="48" x="136" y="164" />

                 
                <g className="animate-bounce" style={{ animationDuration: '3s' }}>
                  <rect
                    fill="#FFFFFF"
                    filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))"
                    height="34"
                    rx="10"
                    width="34"
                    x="68"
                    y="88"
                  />
                  <circle cx="85" cy="105" fill="#E6EFFA" r="10" />
                  <path
                    d="M81 105 L84 108 L90 102"
                    stroke="#006591"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  />
                </g>

                <g className="animate-pulse">
                  <rect
                    fill="#FFFFFF"
                    filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))"
                    height="32"
                    rx="10"
                    width="32"
                    x="220"
                    y="96"
                  />
                  <path
                    d="M236 104 C232 104 230 107 230 110 C230 114 236 119 236 119 C236 119 242 114 242 110 C242 107 240 104 236 104 Z"
                    fill="#2AABEE"
                  />
                  <circle cx="236" cy="109" fill="#FFFFFF" r="2" />
                </g>
              </svg>
            </div>

             
            <div
              onClick={() => setIsCodeDrawerOpen(!isCodeDrawerOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-sm mb-2 cursor-pointer active:scale-95 transition-transform"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7WPxgkS---gjb1AsgPoBdkkC2gda1-uL3gcxUYo52kAE9aAP5YNC0bRs9XKeylnnW5yzkd_YcQ3JO7lADp3zYh7xtxX6EpPsH8G4zDE5lvA8BiaGc8AM0SFEzIF-bc690CJQGcLJEUznRrU4BUdO8AxbLrjMwMWm6BFo1SssRj-elJivM5DFXVLu_CoG2eYaxzRqFwNHnAKK5nG80xMa6cMXRwdszP3Lakb85wgZ17yhUgyF5P8VfVfrj2EgbDGRc"
                alt="МОЙ ДОМ"
                className="w-7 h-7 rounded-full object-cover shrink-0 shadow-sm"
              />
              <span className="text-[18px] font-semibold tracking-tight text-on-surface">
                МОЙ ДОМ
              </span>
            </div>

             
            <h1 className="text-[26px] font-bold text-center text-on-surface mb-1 tracking-tight leading-tight">
              Цифровой сервис вашего дома
            </h1>
            <p className="text-[14px] text-center text-[#3e4850] max-w-[340px] mb-4 leading-relaxed">
              Управление МКД, обращения в управляющие организации и ресурсоснабжающие организации,
              опросы жильцов в одном MiniApp
            </p>

             
            <div className="w-full bg-white rounded-2xl shadow-sm p-4 space-y-3.5 mb-4">
               
              <div className="flex items-start gap-3.5 p-2 rounded-xl transition-colors hover:bg-[#ecf4ff]">
                <div className="w-11 h-11 shrink-0 rounded-2xl bg-[#c9e6ff] flex items-center justify-center text-[#006591] shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
                </div>
                <div className="flex flex-col min-w-0 pt-0.5">
                  <div className="text-[16px] font-semibold text-on-surface mb-0.5">
                    Заявки в УО и РСО
                  </div>
                  <p className="text-[13px] text-[#3e4850] leading-snug">
                    Быстрая подача обращений в УК/УО/ТСЖ и РСО с возможностью фото-фиксации проблемы.
                  </p>
                </div>
              </div>

               
              <div className="flex items-start gap-3.5 p-2 rounded-xl transition-colors hover:bg-[#ecf4ff]">
                <div className="w-11 h-11 shrink-0 rounded-2xl bg-[#dce1ff] flex items-center justify-center text-[#1a52d9] shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">campaign</span>
                </div>
                <div className="flex flex-col min-w-0 pt-0.5">
                  <div className="text-[16px] font-semibold text-on-surface mb-0.5">
                    Официальные оповещения
                  </div>
                  <p className="text-[13px] text-[#3e4850] leading-snug">
                    Важные объявления от{' '}
                    <span className="bg-[#ecf4ff] px-1 py-0.5 rounded text-[#0056c4] font-medium">
                      УК/УО/ТСЖ
                    </span>{' '}
                    и Председателя дома прямо в ленте без спама и флуда.
                  </p>
                </div>
              </div>

               
              <div className="flex items-start gap-3.5 p-2 rounded-xl transition-colors hover:bg-[#ecf4ff]">
                <div className="w-11 h-11 shrink-0 rounded-2xl bg-[#d9e2ff] flex items-center justify-center text-[#0056c4] shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">how_to_vote</span>
                </div>
                <div className="flex flex-col min-w-0 pt-0.5">
                  <div className="text-[16px] font-semibold text-on-surface mb-0.5">
                    Экспресс-опросы дома
                  </div>
                  <p className="text-[13px] text-[#3e4850] leading-snug">
                    Участие в голосованиях и опросах собственников в 1 клик с подсчетом голосов.
                  </p>
                </div>
              </div>
            </div>

             
            <div className="w-full bg-[#ecf4ff] rounded-xl p-3 flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#006591] shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <p className="text-[13px] text-[#3e4850] leading-tight">
                Защита персональных данных по стандарту 152-ФЗ с поддержкой сквозной криптографии
                ЕСИА.
              </p>
            </div>

             
            {isCodeDrawerOpen && (
              <div className="w-full bg-[#29313a] text-[#e9f2fd] rounded-2xl p-4 shadow-xl mb-4 overflow-hidden animate-fadeIn">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                    <span className="text-[11px] text-[#bec8d2] ml-2 font-mono">
                      MyHomeAuthView.tsx
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCodeDrawerOpen(false)}
                    className="text-[#e9f2fd] opacity-70 hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
                <pre className="font-mono text-xs overflow-x-auto p-2 bg-black/30 rounded-lg text-[#89ceff] leading-relaxed">
                  <code>{`import React, { useState } from 'react';
import { Button } from '@max-messenger/max-ui';

export const MyHomeWelcomeScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    await initEsiaAuth({ scope: 'gis_gkh_resident' });
  };

  return (
    <Button variant="esia-primary" loading={loading} onClick={handleAuth}>
      Войти через Госуслуги
    </Button>
  );
};`}</code>
                </pre>
              </div>
            )}
          </div>

           
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#f7f9ff]/95 backdrop-blur-md px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] shadow-[0_-4px_20px_rgba(20,28,36,0.06)]">
            <div className="max-w-[430px] mx-auto flex flex-col items-center gap-2.5 pb-1">
               
              <button
                type="button"
                id="esiaLoginBtn"
                onClick={handleStartAuth}
                disabled={isNavigating}
                className="w-full h-[54px] rounded-full bg-[#0056c4] hover:bg-[#0056c4]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 px-6 shadow-md shadow-[#0056c4]/25 focus:outline-none cursor-pointer disabled:opacity-85"
              >
                 
                <svg
                  className="w-6 h-6 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
                    stroke="#FFFFFF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                  />
                  <path
                    d="M12 7V17M7 9.5L17 14.5M17 9.5L7 14.5"
                    stroke="#FFFFFF"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
                <span className="text-[18px] font-semibold text-white">Войти через Госуслуги</span>
                <span className="material-symbols-outlined text-white text-[20px]">
                  arrow_forward
                </span>
              </button>

               
              <div className="flex items-center justify-center gap-1.5 px-4 text-center">
                <span className="material-symbols-outlined text-[16px] text-[#6e7881] shrink-0">
                  verified_user
                </span>
                <p className="text-[11px] text-[#3e4850] leading-tight">
                  Авторизация подтверждает статус жильца в МКД через ГИС ЖКХ. Ваши персональные
                  данные защищены.
                </p>
              </div>
            </div>
          </div>

           
          <div
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-none transform ${
              isNavigating
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#29313a] text-[#e9f2fd] shadow-xl text-[13px] font-medium">
              <span className="w-4 h-4 border-2 border-[#2aabee] border-t-transparent rounded-full animate-spin" />
              <span>Перенаправление в ЕСИА Госуслуги...</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};