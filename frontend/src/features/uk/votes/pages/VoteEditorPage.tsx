import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ukApi, UkPollQuestionCreate } from '../../api';
import { useToast } from '../../../../shared/hooks/useToast';

export const VoteEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('2026-12-31T23:59:59');
  const [questions, setQuestions] = useState<UkPollQuestionCreate[]>([
    {
      question_text: 'Поддерживаете ли вы данную инициативу?',
      question_type: 'single',
      options: [
        { option_text: 'За' },
        { option_text: 'Против' },
        { option_text: 'Воздержался' },
      ],
    },
  ]);

  const createPollMutation = useMutation({
    mutationFn: () =>
      ukApi.createPoll({
        house_id: 1,
        title,
        description,
        deadline,
        questions,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uk-votes'] });
      queryClient.invalidateQueries({ queryKey: ['votes'] });
      queryClient.invalidateQueries({ queryKey: ['uk-dashboard'] });
      showToast('Опрос успешно создан и опубликован для жителей дома', 'success');
      navigate('/uk/votes');
    },
    onError: () => {
      showToast('Ошибка при создании опроса', 'error');
    },
  });

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: '',
        question_type: 'single',
        options: [{ option_text: 'Да' }, { option_text: 'Нет' }],
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx: number, text: string) => {
    const updated = [...questions];
    updated[idx].question_text = text;
    setQuestions(updated);
  };

  const handleQuestionTypeChange = (idx: number, type: 'single' | 'multiple' | 'text') => {
    const updated = [...questions];
    updated[idx].question_type = type;
    setQuestions(updated);
  };

  const handleAddOption = (qIdx: number) => {
    const updated = [...questions];
    updated[qIdx].options.push({ option_text: '' });
    setQuestions(updated);
  };

  const handleOptionTextChange = (qIdx: number, oIdx: number, text: string) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx].option_text = text;
    setQuestions(updated);
  };

  const handleRemoveOption = (qIdx: number, oIdx: number) => {
    const updated = [...questions];
    updated[qIdx].options = updated[qIdx].options.filter((_, i) => i !== oIdx);
    setQuestions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Заполните название и описание опроса', 'error');
      return;
    }
    createPollMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Создание нового опроса
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Конструктор повестки и вопросов для голосования собственников дома
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/uk/votes')}
          className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer"
        >
          Отмена
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-slate-900 text-base">Основная информация</h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Тема / заголовок опроса</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Установка автоматического шлагбаума и видеонаблюдения"
              className="h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Подробное описание и обоснование</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите суть вопроса, смету, сроки и регламент..."
              className="p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Дом</label>
              <select className="h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:border-primary">
                <option value="1">ул. Баумана, д. 12</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Срок завершения</label>
              <input
                type="datetime-local"
                value={deadline.slice(0, 16)}
                onChange={(e) => setDeadline(`${e.target.value}:00`)}
                className="h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">Вопросы в опросе ({questions.length})</h3>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="h-9 px-3.5 rounded-xl bg-sky-50 text-primary hover:bg-sky-100 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Добавить вопрос</span>
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                  Вопрос #{qIdx + 1}
                </span>

                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIdx)}
                    className="text-rose-500 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Удалить</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Текст вопроса</label>
                <input
                  type="text"
                  value={q.question_text}
                  onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                  placeholder="Введите текст вопроса..."
                  className="h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Тип ответа</label>
                <select
                  value={q.question_type}
                  onChange={(e) => handleQuestionTypeChange(qIdx, e.target.value as any)}
                  className="h-10 px-3.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:border-primary max-w-xs"
                >
                  <option value="single">Один вариант (радиокнопка)</option>
                  <option value="multiple">Несколько вариантов (чекбокс)</option>
                  <option value="text">Развернутый текстовый ответ</option>
                </select>
              </div>

              {q.question_type !== 'text' && (
                <div className="flex flex-col gap-2 pt-2">
                  <label className="text-xs font-bold text-slate-700">Варианты ответа</label>
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt.option_text}
                        onChange={(e) => handleOptionTextChange(qIdx, oIdx, e.target.value)}
                        placeholder={`Вариант ${oIdx + 1}`}
                        className="flex-1 h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-primary"
                      />
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(qIdx, oIdx)}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 flex items-center justify-center cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleAddOption(qIdx)}
                    className="w-max text-xs font-semibold text-primary hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    + Добавить вариант
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={createPollMutation.isPending}
          className="h-12 bg-primary text-white rounded-xl font-bold text-sm shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">how_to_vote</span>
          <span>{createPollMutation.isPending ? 'Публикация опроса...' : 'Опубликовать опрос'}</span>
        </button>
      </form>
    </div>
  );
};
