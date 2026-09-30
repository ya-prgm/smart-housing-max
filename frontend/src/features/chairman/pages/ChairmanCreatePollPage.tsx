import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../shared/api/client';
import { useToast } from '../../../shared/hooks/useToast';

type QuestionType = 'single_choice' | 'multiple_choice' | 'text';

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: Option[];
}

const genId = () => Math.random().toString(36).slice(2, 9);

export const ChairmanCreatePollPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadlineText, setDeadlineText] = useState('До 31 октября');
  const [estimatedTime, setEstimatedTime] = useState('~3 мин');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: genId(),
      text: '',
      type: 'single_choice',
      options: [
        { id: genId(), text: '' },
        { id: genId(), text: '' },
      ],
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: genId(),
        text: '',
        type: 'single_choice',
        options: [{ id: genId(), text: '' }, { id: genId(), text: '' }],
      },
    ]);
  };

  const removeQuestion = (qId: string) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((q) => q.id !== qId));
  };

  const updateQuestion = (qId: string, field: Partial<Omit<Question, 'id'>>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, ...field } : q))
    );
  };

  const addOption = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? { ...q, options: [...q.options, { id: genId(), text: '' }] }
          : q
      )
    );
  };

  const removeOption = (qId: string, optId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.filter((o) => o.id !== optId) }
          : q
      )
    );
  };

  const updateOption = (qId: string, optId: string, text: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((o) => (o.id === optId ? { ...o, text } : o)),
            }
          : q
      )
    );
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      showToast('Заполните название и описание опроса', 'error');
      return;
    }
    const emptyQ = questions.find((q) => !q.text.trim());
    if (emptyQ) {
      showToast('Заполните текст всех вопросов', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post('/votes', {
        title: title.trim(),
        description: description.trim(),
        deadline_text: deadlineText.trim(),
        estimated_time: estimatedTime.trim(),
        protocol_number: null,
        questions: questions.map((q) => ({
          question_text: q.text.trim(),
          subtext: null,
          question_type: q.type,
          options:
            q.type !== 'text'
              ? q.options.filter((o) => o.text.trim()).map((o) => ({
                  option_text: o.text.trim(),
                  subtext: null,
                }))
              : [],
        })),
      });

      setIsSuccess(true);
      setTimeout(() => navigate('/chairman/polls'), 1500);
    } catch {
      showToast('Не удалось создать опрос', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[40px] text-emerald-600">how_to_vote</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Опрос создан!</h2>
        <p className="text-sm text-slate-500">Жильцы могут проголосовать в разделе «Опросы»</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen pb-12 bg-[#f8fafc] text-slate-900 select-none">
      <header className="sticky top-0 z-40 pt-safe bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-xs">
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            <span className="text-[14px] font-semibold">Назад</span>
          </button>
          <span className="text-[15px] font-bold text-slate-900">Новый опрос</span>
          <div className="w-12" />
        </div>
      </header>

      <div className="px-4 pt-4 pb-6 flex flex-col gap-4 max-w-lg mx-auto w-full">
        <div className="bg-gradient-to-tr from-[#006591] via-[#0088cc] to-[#2aabee] rounded-3xl p-5 text-white shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">how_to_vote</span>
            </div>
            <div>
              <h1 className="text-[17px] font-bold">Создание опроса</h1>
              <p className="text-[12px] text-white/80">Для собственников вашего МКД</p>
            </div>
          </div>
          <p className="text-[12px] text-white/80 leading-relaxed">
            Сформируйте опрос для жильцов дома с выбором вариантов или открытыми ответами.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-card border border-slate-200/80 flex flex-col gap-3.5">
          <h2 className="text-[14px] font-bold text-slate-900">Основная информация</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-700">Название *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Ремонт входной группы"
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-700">Описание *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание темы и цели опроса..."
              rows={3}
              className="w-full p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm resize-none focus:outline-none focus:border-primary focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-700">Срок</label>
              <input
                type="text"
                value={deadlineText}
                onChange={(e) => setDeadlineText(e.target.value)}
                placeholder="До 31 октября"
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-700">Время на ответ</label>
              <input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="~3 мин"
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[14px] font-bold text-slate-900">Вопросы ({questions.length})</h2>
          </div>

          {questions.map((q, qIdx) => (
            <div
              key={q.id}
              className="bg-white rounded-3xl p-5 shadow-card border border-slate-200/80 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-primary">Вопрос {qIdx + 1}</span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(q.id)}
                    className="w-7 h-7 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center cursor-pointer hover:bg-rose-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                )}
              </div>

              <input
                type="text"
                value={q.text}
                onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                placeholder="Текст вопроса..."
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm focus:outline-none focus:border-primary transition-colors"
              />

              <div className="flex gap-2">
                {(
                  [
                    { id: 'single_choice', label: 'Один ответ', icon: 'radio_button_checked' },
                    { id: 'multiple_choice', label: 'Несколько', icon: 'check_box' },
                    { id: 'text', label: 'Свободный', icon: 'short_text' },
                  ] as { id: QuestionType; label: string; icon: string }[]
                ).map((qt) => (
                  <button
                    key={qt.id}
                    type="button"
                    onClick={() => updateQuestion(q.id, { type: qt.id })}
                    className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                      q.type === qt.id
                        ? 'bg-sky-50 border-primary text-primary shadow-xs'
                        : 'bg-white border-slate-200/80 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{qt.icon}</span>
                    {qt.label}
                  </button>
                ))}
              </div>

              {q.type !== 'text' && (
                <div className="flex flex-col gap-2 pt-1">
                  {q.options.map((opt, optIdx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <span className="text-[12px] text-slate-400 w-5 text-center font-bold">
                        {optIdx + 1}.
                      </span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => updateOption(q.id, opt.id, e.target.value)}
                        placeholder={`Вариант ${optIdx + 1}`}
                        className="flex-1 h-10 px-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(q.id, opt.id)}
                          className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center cursor-pointer shrink-0"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(q.id)}
                    className="flex items-center gap-1.5 text-primary text-[12px] font-bold mt-1 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    Добавить вариант
                  </button>
                </div>
              )}

              {q.type === 'text' && (
                <div className="bg-slate-50 rounded-2xl p-3 text-[12px] text-slate-400 flex items-center gap-2 border border-slate-100">
                  <span className="material-symbols-outlined text-[16px]">edit_note</span>
                  Жильцы смогут ввести произвольный текст
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center justify-center gap-2 h-12 rounded-2xl border-2 border-dashed border-sky-300 text-primary text-[13px] font-semibold hover:border-primary hover:bg-sky-50/50 transition-all cursor-pointer active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Добавить вопрос
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim() || !description.trim()}
          className="w-full h-12 rounded-full bg-primary hover:bg-[#00557a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-card active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">
                progress_activity
              </span>
              Создаём опрос...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">how_to_vote</span>
              Создать и запустить опрос
            </>
          )}
        </button>
      </div>
    </div>
  );
};
