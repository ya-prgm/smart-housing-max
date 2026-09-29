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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f4ff] px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4 animate-bounce">
          <span className="material-symbols-outlined text-[40px] text-emerald-600">how_to_vote</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Опрос создан!</h2>
        <p className="text-sm text-slate-500">Жильцы могут проголосовать в разделе «Голосования»</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen pb-10 bg-[#f0f4ff] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 pt-safe bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 cursor-pointer active:opacity-70"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            <span className="text-[15px] font-medium">Назад</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-indigo-700">Новый опрос</span>
          </div>
        </div>
      </header>

      <div className="px-4 pt-5 pb-6 flex flex-col gap-5">
        {/* Hero */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">how_to_vote</span>
            </div>
            <div>
              <h1 className="text-[17px] font-bold">Создание опроса</h1>
              <p className="text-[12px] text-white/70">Для жильцов вашего дома</p>
            </div>
          </div>
          <p className="text-[12px] text-white/80 leading-relaxed">
            Добавьте вопросы с вариантами ответов или открытыми полями. Жильцы смогут проголосовать анонимно.
          </p>
        </div>

        {/* Poll Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3.5">
          <h2 className="text-[14px] font-bold text-slate-800">Информация об опросе</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-slate-500">Название *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Ремонт подъезда №3"
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-slate-500">Описание *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание темы и цели опроса..."
              rows={3}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-slate-500">Срок</label>
              <input
                type="text"
                value={deadlineText}
                onChange={(e) => setDeadlineText(e.target.value)}
                placeholder="До 31 октября"
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-slate-500">Время прохождения</label>
              <input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="~3 мин"
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[14px] font-bold text-slate-800">Вопросы ({questions.length})</h2>
          </div>

          {questions.map((q, qIdx) => (
            <div key={q.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-indigo-600">Вопрос {qIdx + 1}</span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(q.id)}
                    className="w-7 h-7 rounded-full bg-red-50 text-red-400 flex items-center justify-center cursor-pointer hover:bg-red-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                )}
              </div>

              {/* Question text */}
              <input
                type="text"
                value={q.text}
                onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                placeholder="Текст вопроса..."
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-colors"
              />

              {/* Question type */}
              <div className="flex gap-2">
                {([
                  { id: 'single_choice', label: 'Один ответ', icon: 'radio_button_checked' },
                  { id: 'multiple_choice', label: 'Несколько', icon: 'check_box' },
                  { id: 'text', label: 'Свободный', icon: 'short_text' },
                ] as { id: QuestionType; label: string; icon: string }[]).map((qt) => (
                  <button
                    key={qt.id}
                    type="button"
                    onClick={() => updateQuestion(q.id, { type: qt.id })}
                    className={`flex-1 flex flex-col items-center gap-0.5 p-2 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                      q.type === qt.id
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{qt.icon}</span>
                    {qt.label}
                  </button>
                ))}
              </div>

              {/* Options */}
              {q.type !== 'text' && (
                <div className="flex flex-col gap-2">
                  {q.options.map((opt, optIdx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 w-5 text-center">{optIdx + 1}.</span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => updateOption(q.id, opt.id, e.target.value)}
                        placeholder={`Вариант ${optIdx + 1}`}
                        className="flex-1 h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 transition-colors"
                      />
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(q.id, opt.id)}
                          className="w-7 h-7 rounded-lg bg-red-50 text-red-400 flex items-center justify-center cursor-pointer shrink-0"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(q.id)}
                    className="flex items-center gap-1.5 text-indigo-600 text-[12px] font-medium mt-1 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    Добавить вариант
                  </button>
                </div>
              )}

              {q.type === 'text' && (
                <div className="bg-slate-50 rounded-xl p-3 text-[12px] text-slate-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">edit_note</span>
                  Жильцы введут свободный ответ
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center justify-center gap-2 h-12 rounded-2xl border-2 border-dashed border-indigo-200 text-indigo-600 text-[13px] font-semibold hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Добавить вопрос
          </button>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim() || !description.trim()}
          className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer mt-2"
          style={{ boxShadow: '0 8px 24px rgba(79,70,229,0.3)' }}
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined text-[22px] animate-spin">progress_activity</span>
              Создаём опрос...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[22px]">how_to_vote</span>
              Создать и запустить опрос
            </>
          )}
        </button>
      </div>
    </div>
  );
};
