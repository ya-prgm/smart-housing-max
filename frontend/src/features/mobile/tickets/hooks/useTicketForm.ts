import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketsApi } from '../api';
import { useHaptic } from '../../../../shared/hooks/useHaptic';

export const useTicketForm = () => {
  const navigate = useNavigate();
  const { impact, notification } = useHaptic();

  const [topicCode, setTopicCode] = useState('1.1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recipients, setRecipients] = useState<string[]>(['uk']);
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Заполните обязательные поля');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    impact('medium');

    try {
      await ticketsApi.createTicket({
        topic_code: topicCode,
        title,
        description,
        recipient_codes: recipients,
        is_public_in_feed: isPublic,
      });
      notification('success');
      navigate('/tickets');
    } catch {
      notification('error');
      setError('Не удалось отправить заявку. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    topicCode,
    setTopicCode,
    title,
    setTitle,
    description,
    setDescription,
    recipients,
    setRecipients,
    isPublic,
    setIsPublic,
    isSubmitting,
    error,
    handleSubmit,
  };
};
