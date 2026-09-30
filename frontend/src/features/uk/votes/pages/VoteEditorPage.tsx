import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { ukApi, UkPollQuestionCreate } from '../../api';
import { useToast } from '../../../../shared/hooks/useToast';

interface PollTemplate {
  name: string;
  badge: string;
  title: string;
  description: string;
  questions: UkPollQuestionCreate[];
}

const TEMPLATES: PollTemplate[] = [
  {
    name: 'Установка шлагбаума и СКУД',
    badge: 'Безопасность',
    title: 'Установка автоматического шлагбаума и системы видеонаблюдения во дворе',
    description: 'Опрос собственников по вопросу ограничения въезда постороннего автотранспорта на придомовую территорию, выбора подрядной организации и утверждения ежемесячной платы за техническое обслуживание шлагбаума.',
    questions: [
      {
        question_text: 'Поддерживаете ли вы установку автоматического шлагбаума на въезде во двор?',
        question_type: 'single_choice',
        options: [{ option_text: 'За' }, { option_text: 'Против' }, { option_text: 'Воздержался' }],
      },
      {
        question_text: 'Какие дополнительные элементы безопасности считаете необходимыми?',
        question_type: 'multiple_choice',
        options: [
          { option_text: 'Камеры видеонаблюдения высокого разрешения' },
          { option_text: 'Распознавание госномеров автотранспорта' },
          { option_text: 'Открытие через мобильное приложение MAX' },
          { option_text: 'Дополнительные брелоки/карты для экстренных служб' },
        ],
      },
      {
        question_text: 'Ваши предложения и комментарии по организации въезда во двор:',
        question_type: 'text',
        options: [],
      },
    ],
  },
  {
    name: 'Благоустройство двора',
    badge: 'Двор и дети',
    title: 'Комплексное благоустройство детской площадки и зоны отдыха',
    description: 'Голосование по включению придомовой территории в муниципальную программу софинансирования благоустройства дворов. Определение приоритетных зон обновления.',
    questions: [
      {
        question_text: 'Согласны ли вы на участие МКД в программе софинансирования благоустройства?',
        question_type: 'single_choice',
        options: [{ option_text: 'Да, поддерживаю' }, { option_text: 'Нет, против' }, { option_text: 'Затрудняюсь ответить' }],
      },
      {
        question_text: 'Какие объекты в приоритете для установки на детской и спортивной площадках?',
        question_type: 'multiple_choice',
        options: [
          { option_text: 'Современный детский игровой комплекс' },
          { option_text: 'Турники и зона воркаута' },
          { option_text: 'Безопасное резиновое покрытие' },
          { option_text: 'Новые скамейки и урны для раздельного сбора' },
        ],
      },
    ],
  },
  {
    name: 'Текущий ремонт подъездов',
    badge: 'Ремонт МКД',
    title: 'Утверждение графика и цветовых решений текущего ремонта подъездов',
    description: 'В рамках плана текущего ремонта на текущий год планируется косметический ремонт входных групп и лестничных клеток. Выберите предпочтительный цвет и перечень работ.',
    questions: [
      {
        question_text: 'Поддерживаете ли вы проведение косметического ремонта в подъездах?',
        question_type: 'single_choice',
        options: [{ option_text: 'За' }, { option_text: 'Против' }, { option_text: 'Воздержался' }],
      },
      {
        question_text: 'Какой оттенок стен предпочитаете для лестничных площадок?',
        question_type: 'single_choice',
        options: [
          { option_text: 'Светло-серый / Скандинавский' },
          { option_text: 'Теплый бежевый' },
          { option_text: 'Мягкий мятно-зеленый' },
        ],
      },
    ],
  },
];

export const VoteEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const storedHouseId = Number(localStorage.getItem('selected_house_id')) || 1;

  const getFutureDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(23, 59, 59, 0);
    return d.toISOString().slice(0, 19);
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(getFutureDate(7));
  const [houseId, setHouseId] = useState(storedHouseId);
  const [questions, setQuestions] = useState<UkPollQuestionCreate[]>([
    {
      question_text: 'Поддерживаете ли вы данную инициативу?',
      question_type: 'single_choice',
      options: [
        { option_text: 'За' },
        { option_text: 'Против' },
        { option_text: 'Воздержался' },
      ],
    },
  ]);

  const { data: houses = [] } = useQuery({
    queryKey: ['uk-houses'],
    queryFn: ukApi.getHouses,
  });

  const normalizeQuestionType = (t: string): 'single_choice' | 'multiple_choice' | 'text' => {
    if (t === 'single' || t === 'single_choice') return 'single_choice';
    if (t === 'multiple' || t === 'multiple_choice') return 'multiple_choice';
    return 'text';
  };

  const createPollMutation = useMutation({
    mutationFn: () =>
      ukApi.createPoll({
        house_id: houseId,
        title: title.trim(),
        description: description.trim(),
        deadline,
        questions: questions.map((q) => ({
          question_text: q.question_text.trim(),
          question_type: normalizeQuestionType(q.question_type),
          options:
            q.question_type === 'text'
              ? []
              : q.options
                  .filter((o) => o.option_text.trim().length > 0)
                  .map((o) => ({ option_text: o.option_text.trim() })),
        })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uk-votes'] });
      queryClient.invalidateQueries({ queryKey: ['votes'] });
      queryClient.invalidateQueries({ queryKey: ['uk-dashboard'] });
      showToast('Опрос успешно создан и опубликован для собственников дома', 'success');
      navigate('/uk/votes');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || 'Ошибка при создании опроса';
      showToast(typeof msg === 'string' ? msg : 'Ошибка при создании опроса', 'error');
    },
  });

  const applyTemplate = (tpl: PollTemplate) => {
    setTitle(tpl.title);
    setDescription(tpl.description);
    setQuestions(JSON.parse(JSON.stringify(tpl.questions)));
    showToast(`Применен шаблон «${tpl.name}»`, 'info');
  };

  const setDeadlineDays = (days: number) => {
    setDeadline(getFutureDate(days));
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: '',
        question_type: 'single_choice',
        options: [{ option_text: 'Да' }, { option_text: 'Нет' }],
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      showToast('В опросе должен оставаться хотя бы один вопрос', 'info');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleMoveQuestion = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;
    const updated = [...questions];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setQuestions(updated);
  };

  const handleQuestionTextChange = (idx: number, text: string) => {
    const updated = [...questions];
    updated[idx].question_text = text;
    setQuestions(updated);
  };

  const handleQuestionTypeChange = (idx: number, type: 'single_choice' | 'multiple_choice' | 'text') => {
    const updated = [...questions];
    updated[idx].question_type = type;
    if (type !== 'text' && (!updated[idx].options || updated[idx].options.length === 0)) {
      updated[idx].options = [{ option_text: 'Да' }, { option_text: 'Нет' }];
    }
    setQuestions(updated);
  };

  const handleSetPresetOptions = (qIdx: number, preset: 'yes_no' | 'for_against' | 'agree_disagree') => {
    const updated = [...questions];
    if (preset === 'for_against') {
      updated[qIdx].options = [{ option_text: 'За' }, { option_text: 'Против' }, { option_text: 'Воздержался' }];
    } else if (preset === 'yes_no') {
      updated[qIdx].options = [{ option_text: 'Да' }, { option_text: 'Нет' }];
    } else {
      updated[qIdx].options = [{ option_text: 'Поддерживаю' }, { option_text: 'Против' }, { option_text: 'Затрудняюсь ответить' }];
    }
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
    if (updated[qIdx].options.length <= 2) {
      showToast('Должно быть минимум 2 варианта ответа', 'info');
      return;
    }
    updated[qIdx].options = updated[qIdx].options.filter((_, i) => i !== oIdx);
    setQuestions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Укажите заголовок / повестку опроса', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('Заполните описание повестки для жителей', 'error');
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        showToast(`Заполните текст вопроса #${i + 1}`, 'error');
        return;
      }
      if (q.question_type !== 'text') {
        const validOptions = q.options.filter((o) => o.option_text.trim().length > 0);
        if (validOptions.length < 2) {
          showToast(`Вопрос #${i + 1} должен содержать минимум 2 заполненных варианта ответа`, 'error');
          return;
        }
      }
    }
    createPollMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              Конструктор голосований
            </span>
            <span className="text-xs text-slate-400">Опросы собственников МКД</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Создание нового опроса
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Удобная повестка, готовые шаблоны вопросов и настройка вариантов голосования
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/uk/votes')}
          className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer shadow-xs self-start sm:self-auto"
        >
          Отмена
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-slate-50 rounded-2xl p-5 border border-blue-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">Готовые шаблоны повесток</span>
            <span className="text-[11px] text-blue-700 bg-white px-2 py-0.5 rounded-md font-semibold border border-blue-200">
              В 1 клик
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">Выберите для быстрой вставки повестки</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyTemplate(tpl)}
              className="p-3.5 rounded-xl bg-white hover:bg-blue-600 hover:text-white border border-slate-200 text-left transition-all group shadow-xs cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 group-hover:text-blue-100 block mb-1">
                  {tpl.badge}
                </span>
                <span className="text-xs font-bold text-slate-900 group-hover:text-white block line-clamp-2">
                  {tpl.name}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 group-hover:text-blue-200 mt-2 block font-medium">
                {tpl.questions.length} вопроса • Заполнить →
              </span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Повестка и параметры голосования</h3>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">
              Тема / заголовок опроса <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Установка автоматического шлагбаума и видеонаблюдения"
              className="h-11 px-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">
              Описание повестки и условий <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите суть вопроса, регламент, сметную стоимость, сроки реализации..."
              className="p-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Объект голосования (Дом)</label>
              <select
                value={houseId}
                onChange={(e) => setHouseId(Number(e.target.value))}
                className="h-11 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {houses.map((house) => (
                  <option key={house.id} value={house.id}>{house.address}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Срок завершения опроса</label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setDeadlineDays(3)}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 cursor-pointer"
                  >
                    3 дня
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeadlineDays(7)}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 cursor-pointer"
                  >
                    7 дней
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeadlineDays(14)}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 cursor-pointer"
                  >
                    14 дней
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeadlineDays(30)}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 cursor-pointer"
                  >
                    30 дней
                  </button>
                </div>
              </div>

              <input
                type="datetime-local"
                value={deadline.slice(0, 16)}
                onChange={(e) => setDeadline(`${e.target.value}:00`)}
                className="h-11 px-3.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Вопросы в повестке ({questions.length})
              </h3>
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Добавить вопрос</span>
            </button>
          </div>

          {questions.map((q, qIdx) => {
            const currentType = normalizeQuestionType(q.question_type);

            return (
              <div
                key={qIdx}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col gap-5 transition-all"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                      Вопрос #{qIdx + 1}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <button
                        type="button"
                        disabled={qIdx === 0}
                        onClick={() => handleMoveQuestion(qIdx, 'up')}
                        title="Поднять выше"
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={qIdx === questions.length - 1}
                        onClick={() => handleMoveQuestion(qIdx, 'down')}
                        title="Опустить ниже"
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                      >
                        ↓
                      </button>
                    </div>
                  </div>

                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="text-slate-400 hover:text-rose-600 text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Удалить вопрос</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Формулировка вопроса <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={q.question_text}
                    onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                    placeholder="Например: Согласны ли вы с утвержденной сметой?"
                    className="h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700">Тип ответа жителя</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuestionTypeChange(qIdx, 'single_choice')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        currentType === 'single_choice'
                          ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        currentType === 'single_choice' ? 'border-blue-600 bg-white' : 'border-slate-400'
                      }`}>
                        {currentType === 'single_choice' && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                      </span>
                      <div>
                        <div className="text-xs font-bold">Один вариант</div>
                        <div className="text-[10px] text-slate-400">Радиокнопка (За/Против)</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuestionTypeChange(qIdx, 'multiple_choice')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        currentType === 'multiple_choice'
                          ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                        currentType === 'multiple_choice' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-400'
                      }`}>
                        {currentType === 'multiple_choice' && (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <div>
                        <div className="text-xs font-bold">Несколько вариантов</div>
                        <div className="text-[10px] text-slate-400">Чекбоксы выбора</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuestionTypeChange(qIdx, 'text')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        currentType === 'text'
                          ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-4 h-4 flex items-center justify-center text-slate-500 shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                      </span>
                      <div>
                        <div className="text-xs font-bold">Текстовый ответ</div>
                        <div className="text-[10px] text-slate-400">Свободное поле ввода</div>
                      </div>
                    </button>
                  </div>
                </div>

                {currentType !== 'text' && (
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">Варианты ответов</label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400 hidden sm:inline">Быстрый набор:</span>
                        <button
                          type="button"
                          onClick={() => handleSetPresetOptions(qIdx, 'for_against')}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                        >
                          За / Против / Воздержался
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetPresetOptions(qIdx, 'yes_no')}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 cursor-pointer"
                        >
                          Да / Нет
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <span className="w-5 text-center text-xs font-mono text-slate-400 font-semibold">
                            {oIdx + 1}.
                          </span>
                          <input
                            type="text"
                            value={opt.option_text}
                            onChange={(e) => handleOptionTextChange(qIdx, oIdx, e.target.value)}
                            placeholder={`Вариант ${oIdx + 1}`}
                            className="flex-1 h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          />
                          {q.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(qIdx, oIdx)}
                              className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddOption(qIdx)}
                      className="w-max text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 mt-1 cursor-pointer"
                    >
                      <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        +
                      </span>
                      <span>Добавить еще вариант</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="h-11 px-5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Добавить еще вопрос</span>
          </button>

          <button
            type="submit"
            disabled={createPollMutation.isPending}
            className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{createPollMutation.isPending ? 'Публикация опроса...' : 'Опубликовать опрос'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
