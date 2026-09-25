export type PollStatus = 'pending' | 'completed' | 'archived';

export interface Poll {
  id: string;
  title: string;
  description: string;
  authorName: string;
  authorRole: string;
  status: PollStatus;
  deadline: string;
  estimatedTime: string;
  questionsCount: number;
  participantsCount: number;
  isCompleted?: boolean;
}

export type QuestionType = 'single' | 'multiple' | 'text';

export interface QuestionOption {
  id: string;
  label: string;
  subtext?: string;
}

export interface Question {
  id: string;
  step: number;
  totalSteps: number;
  type: QuestionType;
  title: string;
  description: string;
  image?: string;
  imageLabel?: string;
  options?: QuestionOption[];
}