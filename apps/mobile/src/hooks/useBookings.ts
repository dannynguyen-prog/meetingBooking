import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useUpcomingMeetings() {
  return useQuery({
    queryKey: ['mobile-meetings'],
    queryFn: async () => {
      const { data } = await api.get('/meetings/mine');
      return data;
    }
  });
}

export function useAvailableRooms(start?: string, end?: string) {
  return useQuery({
    queryKey: ['available-rooms', start, end],
    enabled: Boolean(start && end),
    queryFn: async () => {
      const { data } = await api.get('/meetings/available-rooms', {
        params: { start, end }
      });
      return data;
    }
  });
}

export function useBookMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post('/meetings', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mobile-meetings'] });
    }
  });
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: any) => {
      const { data } = await api.patch(`/meetings/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mobile-meetings'] });
    }
  });
}

export function useCancelMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meetings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mobile-meetings'] });
    }
  });
}
