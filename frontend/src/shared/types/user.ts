export type UserRole = 'resident' | 'chairman' | 'uk_staff';

export interface UserProfile {
  id: number;
  max_user_id: number;
  full_name: string;
  phone?: string | null;
  email?: string | null;
  role: UserRole;
  house_id?: number | null;
  house_address?: string | null;
  apartment_number?: string | null;
  personal_account?: string | null;
  debt_amount?: number;
  is_debt_free?: boolean;
  notifications_enabled?: boolean;
  esia_linked?: boolean;
  esia_linked_at?: string | null;
  esia_last_sync_at?: string | null;
  esia_sync_status?: 'never' | 'success' | 'failed' | 'expired';
  esia_token_expires_at?: string | null;
}
