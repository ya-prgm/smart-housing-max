import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHaptic } from '../../../../shared/hooks/useHaptic';

export const VoteStepPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { impact } = useHaptic();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [singleChoice, setSingleChoice] = useState<number>(1);
  const [textAnswer, setTextAnswer] = useState<string>(
    'Прошу предусмотреть возможность открытия шлагбаума по звонку для курьеров и такси без необходимости выходить на улицу...'
  );
  const [multiChoice, setMultiChoice] = useState<string[]>(['app', 'plate_cam']);

  const toggleMulti = (val: string) => {
    impact('light');
    setMultiChoice((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  };

  const handleNext = () => {
    impact('medium');
    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);
    } else {
      navigate(`/votes/${id || '1'}/finish`);
    }
  };

  const handlePrev = () => {
    impact('light');
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    } else {
      navigate(-1);
    }
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col relative select-none pb-24">
      <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 pt-safe">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Назад"
              onClick={handlePrev}
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight truncate max-w-[240px]">
              Установка шлагбаума и...
            </h1>
          </div>
        </div>
      </header>

      <main className="px-4 pt-3 flex flex-col gap-4 max-w-[430px] mx-auto w-full">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-1 text-primary font-semibold">
              <span className="material-symbols-outlined text-[17px]">assignment_turned_in</span>
              <span>Вопрос {currentStep} из {totalSteps}</span>
            </div>
            <span className="text-slate-500 font-medium">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {currentStep === 1 && (
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-2">
              <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[11px] font-semibold w-max">
                Один вариант
              </span>
              <h2 className="text-[16px] font-bold text-slate-900 leading-snug">
                Поддерживаете ли вы установку автоматического шлагбаума на главном въезде во двор со стороны ул. Баумана?
              </h2>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                В стоимость входит установка шлагбаума, считывателя номеров и 2 радиопульта на каждую квартиру.
              </p>

              <div className="relative w-full h-32 rounded-xl overflow-hidden mt-1 bg-slate-100">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI4_-TQJr7qV770PzwECSLDcZ8s2Mn6_r6EeHXdAhiMdHP7t83Qw3VQHDcTeruSkUgv0k-0LTgG2CGn6VoNAHVgFg67Op5Fa8h5USv9YTom4DzRxhbUt5pYwZXkS6IUuOh4ZtKgfTPoVD-3b5L3lp0XaTrl2nakt8dj6NYz5VrjKLuGYDp3CofnG4crlrZ54Xnkv_-nvFTLNOoXPdBYpYc8wkex47n7IZhoWLHBNEIDFH8A-2qqKk"
                  alt="Проект шлагбаума"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-[11px] font-medium px-2 py-1 rounded bg-black/60 backdrop-blur-md">
                  <span className="material-symbols-outlined text-[13px]">location_on</span>
                  <span>Въезд с ул. Баумана (проект)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { val: 1, label: 'Да, полностью поддерживаю', sub: 'Включая брелоки и доступ для экстренных служб' },
                { val: 2, label: 'Поддерживаю, но без пультов', sub: 'Только открытие через приложение и по госномеру' },
                { val: 3, label: 'Против установки шлагбаума', sub: 'Считаю ограничения въезда нецелесообразными' },
                { val: 4, label: 'Воздержусь', sub: 'Нужно больше технической информации' },
              ].map((opt) => (
                <div
                  key={opt.val}
                  onClick={() => {
                    impact('light');
                    setSingleChoice(opt.val);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 shadow-xs ${
                    singleChoice === opt.val
                      ? 'bg-sky-50/70 border-primary'
                      : 'bg-white border-slate-200/80'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      singleChoice === opt.val ? 'border-primary bg-primary' : 'border-slate-300'
                    }`}
                  >
                    {singleChoice === opt.val && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-slate-900">{opt.label}</span>
                    <span className="text-[12px] text-slate-500 mt-0.5">{opt.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-2">
              <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[11px] font-semibold w-max">
                Развернутый ответ
              </span>
              <h2 className="text-[16px] font-bold text-slate-900 leading-snug">
                Какие пожелания или ограничения по проезду транспорта вы хотите учесть?
              </h2>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                Например: гостевой доступ, график разгрузки курьеров, машины экстренных служб или такси.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col gap-2 focus-within:border-primary">
              <textarea
                rows={5}
                maxLength={500}
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Напишите ваши предложения или замечания..."
                className="w-full bg-transparent resize-none outline-none text-[14px] text-slate-800 placeholder:text-slate-400 leading-relaxed"
              />
              <div className="flex justify-end pt-1 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">{textAnswer.length} / 500 символов</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-2">
              <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[11px] font-semibold w-max">
                Несколько вариантов
              </span>
              <h2 className="text-[16px] font-bold text-slate-900 leading-snug">
                Какие способы открытия шлагбаума должны поддерживаться?
              </h2>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                Выберите один или несколько вариантов, наиболее удобных для вашей семьи.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { id: 'app', title: 'Мобильное приложение (по кнопке в смартфоне)', sub: 'Быстрое открытие через MiniApp MAX' },
                { id: 'plate_cam', title: 'Автоматическое считывание госномера камерой', sub: 'Камера распознает номер автомобиля из базы жильцов' },
                { id: 'remote', title: 'Классический радиобрелок / пульт', sub: 'Физический пульт дистанционного управления (до 2 шт.)' },
                { id: 'phone_call', title: 'Открытие по звонку с телефона на номер шлагбаума', sub: 'Звонок с зарегистрированного номера собственника' },
              ].map((item) => {
                const isChecked = multiChoice.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleMulti(item.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 shadow-xs ${
                      isChecked ? 'bg-sky-50/70 border-primary' : 'bg-white border-slate-200/80'
                    }`}
                  >
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        isChecked ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <span className="material-symbols-outlined text-[16px] font-bold">check</span>}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-slate-900">{item.title}</span>
                      <span className="text-[12px] text-slate-500 mt-0.5">{item.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/70 p-4 pb-safe flex flex-col gap-2">
        <button
          type="button"
          onClick={handleNext}
          className="w-full h-12 rounded-full text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all bg-primary hover:bg-primary/90 cursor-pointer"
        >
          <span>{currentStep === totalSteps ? 'Перейти к подтверждению' : 'Ответить и продолжить'}</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};