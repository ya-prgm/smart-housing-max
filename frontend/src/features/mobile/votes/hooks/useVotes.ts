import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { votesApi } from '../api';
import { PollSubmitRequest } from '../../../../shared/types/vote';

export const useVotes = () => {
  const pollsQuery = useQuery({
    queryKey: ['votes'],
    queryFn: () => votesApi.getPolls(),
  });

  return {
    polls: pollsQuery.data ?? [],
    isLoading: pollsQuery.isLoading,
    isError: pollsQuery.isError,
    error: pollsQuery.error,
    refetch: pollsQuery.refetch,
  };
};

export const useVoteDetail = (id: number | string | undefined) => {
  const queryClient = useQueryClient();

  const pollQuery = useQuery({
    queryKey: ['votes', id],
    queryFn: () => votesApi.getPoll(id!),
    enabled: Boolean(id),
  });

  const submitMutation = useMutation({
    mutationFn: ({
      pollId,
      payload,
    }: {
      pollId: number | string;
      payload: PollSubmitRequest;
    }) => votesApi.submitPollAnswers(pollId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes'] });
    },
  });

  return {
    poll: pollQuery.data,
    isLoading: pollQuery.isLoading,
    isError: pollQuery.isError,
    error: pollQuery.error,
    refetch: pollQuery.refetch,
    submitAnswers: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
  };
};
