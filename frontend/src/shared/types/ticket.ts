export type TicketStatus = 'active' | 'in_progress' | 'completed';

export interface Ticket {
  id: string;
  code: string;
  category: string;
  title: string;
  description: string;
  status: TicketStatus;
  date: string;
  isMy: boolean;
  votesCount: number;
  isVoted: boolean;
  resolvedLabel?: string;
  image?: string;
}

export interface TicketFormRecipient {
  id: string;
  name: string;
  role: string;
  icon: string;
  selected: boolean;
}