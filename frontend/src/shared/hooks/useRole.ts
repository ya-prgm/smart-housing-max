import { useAuth } from './useAuth';

export const useRole = () => {
  const { user } = useAuth();
  const role = user?.role || 'resident';

  return {
    role,
    isResident: role === 'resident',
    isChairman: role === 'chairman',
    isUkStaff: role === 'uk_staff',
    canCreateFeedPost: role === 'chairman' || role === 'uk_staff',
    canCreatePoll: role === 'chairman' || role === 'uk_staff',
    canChangeTicketStatus: role === 'uk_staff',
  };
};
