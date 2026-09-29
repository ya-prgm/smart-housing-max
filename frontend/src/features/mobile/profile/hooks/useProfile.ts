import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi, UserUpdatePayload } from '../api';

export const useProfile = () => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => profileApi.getProfile(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UserUpdatePayload) => profileApi.updateProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(['profile', 'me'], updated);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
};

export const useMyHouse = () => {
  const houseQuery = useQuery({
    queryKey: ['houses', 'my'],
    queryFn: () => profileApi.getMyHouse(),
  });

  return {
    house: houseQuery.data,
    isLoading: houseQuery.isLoading,
    isError: houseQuery.isError,
    error: houseQuery.error,
    refetch: houseQuery.refetch,
  };
};
