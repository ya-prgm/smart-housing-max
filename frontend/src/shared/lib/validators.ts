import { z } from 'zod';

export const pinSchema = z.string().length(4, 'PIN должен содержать 4 цифры').regex(/^\d+$/, 'Только цифры');

export const esiaLoginSchema = z.object({
  identifier: z.string().min(3, 'Введите телефон, email или СНИЛС'),
  password: z.string().min(4, 'Пароль слишком короткий'),
});

export const ticketCreateSchema = z.object({
  topicCode: z.string().min(1, 'Выберите классификатор проблемы'),
  title: z.string().min(3, 'Укажите краткую суть заявки'),
  description: z.string().min(5, 'Опишите проблему подробнее'),
  recipients: z.array(z.string()).min(1, 'Выберите хотя бы одного получателя'),
  isPublicInFeed: z.boolean().default(true),
  attachments: z.array(z.number()).default([]),
});

export const postCreateSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(5, 'Текст публикации не может быть коротким'),
  postType: z.enum(['announcement', 'report', 'info', 'emergency']).default('info'),
});

export const commentCreateSchema = z.object({
  content: z.string().min(1, 'Введите текст комментария'),
});
