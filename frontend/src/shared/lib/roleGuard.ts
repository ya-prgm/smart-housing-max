import { UserRole } from '../types/user';

export const isAuthorizedForRole = (userRole: string | undefined, allowedRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole as UserRole);
};
