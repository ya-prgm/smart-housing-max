import { PostAuthor } from './feed';

export type PollStatus = 'draft' | 'active' | 'completed' | 'cancelled' | 'pending' | 'archived';
export type QuestionType = 'single' | 'multiple' | 'text';

export interface PollOptionResponse {
  id: number;
  order_num: number;
  option_text: string;
  subtext?: string | null;
}

export interface PollQuestionResponse {
  id: number;
  order_num: number;
  question_text: string;
  subtext?: string | null;
  question_type: QuestionType;
  image_url?: string | null;
  options: PollOptionResponse[];
}

export interface PollDetailResponse {
  id: number;
  author: PostAuthor;
  title: string;
  description: string;
  image_url?: string | null;
  status: PollStatus;
  created_at: string;
  deadline?: string | null;
  deadline_text?: string | null;
  estimated_time?: string | null;
  protocol_number?: string | null;
  total_questions: number;
  is_completed_by_me: boolean;
  questions: PollQuestionResponse[];
}

export interface PollCardResponse {
  id: number;
  author: PostAuthor;
  status: PollStatus;
  title: string;
  description: string;
  created_at: string;
  deadline?: string | null;
  deadline_text?: string | null;
  estimated_time?: string | null;
  questions_count: number;
  participants_count: number;
  is_completed: boolean;
}

export interface PollAnswerSubmission {
  question_id: number;
  selected_option_id?: number | null;
  selected_option_ids?: number[] | null;
  text_answer?: string | null;
}

export interface PollSubmitRequest {
  answers: PollAnswerSubmission[];
}

export interface Poll {
  id: string | number;
  title: string;
  description: string;
  authorName: string;
  authorRole: string;
  status: PollStatus;
  deadline: string;
  estimatedTime?: string;
  questionsCount: number;
  participantsCount: number;
  isCompleted?: boolean;
}

export interface QuestionOption {
  id: string | number;
  label: string;
  subtext?: string;
}

export interface Question {
  id: string | number;
  step: number;
  totalSteps: number;
  type: QuestionType;
  title: string;
  description?: string;
  image?: string;
  imageLabel?: string;
  options?: QuestionOption[];
}