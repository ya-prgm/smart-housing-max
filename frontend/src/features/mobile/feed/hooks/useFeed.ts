import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedApi } from '../api';

export const useFeed = (type?: 'all' | 'uk' | 'chairman') => {
  const queryClient = useQueryClient();

  const {
    data: posts = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['feed', type],
    queryFn: () => feedApi.getFeed(type),
  });

  const createPostMutation = useMutation({
    mutationFn: feedApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const toggleReactionMutation = useMutation({
    mutationFn: ({ postId, reactionType }: { postId: string | number; reactionType: 'like' | 'dislike' }) =>
      feedApi.toggleReaction(postId, reactionType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  return {
    posts,
    isLoading,
    isError,
    refetch,
    createPost: createPostMutation.mutateAsync,
    isCreating: createPostMutation.isPending,
    toggleReaction: toggleReactionMutation.mutateAsync,
  };
};

export const usePostDetails = (postId: string | number, sort: string = 'oldest') => {
  const queryClient = useQueryClient();

  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
    refetch: refetchPost,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => feedApi.getPostById(postId),
    enabled: Boolean(postId),
  });

  const {
    data: comments = [],
    isLoading: isCommentsLoading,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ['post_comments', postId, sort],
    queryFn: () => feedApi.getComments(postId, sort),
    enabled: Boolean(postId),
  });

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => feedApi.addComment(postId, content),
    onSuccess: () => {
      refetchComments();
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  return {
    post,
    isPostLoading,
    isPostError,
    refetchPost,
    comments,
    isCommentsLoading,
    refetchComments,
    addComment: addCommentMutation.mutateAsync,
    isAddingComment: addCommentMutation.isPending,
  };
};
