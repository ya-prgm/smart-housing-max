import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsApi, TicketCreatePayload } from '../api';

export const useTickets = (status?: string, onlyMy?: boolean, search?: string) => {
  const queryClient = useQueryClient();

  const {
    data: tickets = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['tickets', status, onlyMy, search],
    queryFn: () => ticketsApi.getTickets({
      status: status && status !== 'all' ? status : undefined,
      my: onlyMy,
      search: search || undefined,
    }),
  });

  const toggleSupportMutation = useMutation({
    mutationFn: (id: string | number) => ticketsApi.toggleSupport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: (payload: TicketCreatePayload) => ticketsApi.createTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  return {
    tickets,
    isLoading,
    isError,
    refetch,
    toggleSupport: toggleSupportMutation.mutateAsync,
    createTicket: createTicketMutation.mutateAsync,
    isCreating: createTicketMutation.isPending,
  };
};

export const useTicketDetails = (ticketId: string | number) => {
  const queryClient = useQueryClient();

  const {
    data: ticket,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => ticketsApi.getTicketById(ticketId),
    enabled: Boolean(ticketId),
  });

  const toggleSupportMutation = useMutation({
    mutationFn: () => ticketsApi.toggleSupport(ticketId),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  return {
    ticket,
    isLoading,
    isError,
    toggleSupport: toggleSupportMutation.mutateAsync,
  };
};
